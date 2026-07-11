-- BMC Web Platform - Inspector Portal (Phase 2) schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a fresh project.
-- Depends only on the built-in `auth.users` table.

-- ============================================================================
-- Extensions
-- ============================================================================
create extension if not exists "pgcrypto";

-- ============================================================================
-- profiles
-- One row per auth user. Holds the role (admin | inspector) and basic contact
-- info. Created automatically on signup via trigger below.
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'inspector' check (role in ('admin', 'inspector')),
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Extends auth.users with role + contact info.';

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- updated_at helper trigger
-- ============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- inspections
-- The jobs themselves. Created/managed by admins.
-- ============================================================================
create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client_name text not null,
  vessel_name text,
  port text,
  location text,
  service_type text,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'in_progress', 'completed', 'cancelled')),
  scheduled_date date,
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists inspections_set_updated_at on public.inspections;
create trigger inspections_set_updated_at
  before update on public.inspections
  for each row execute function public.set_updated_at();

-- ============================================================================
-- inspection_assignments
-- Links inspectors to inspections (an inspection can have multiple
-- inspectors; an inspector can have multiple inspections).
-- ============================================================================
create table if not exists public.inspection_assignments (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections (id) on delete cascade,
  inspector_id uuid not null references public.profiles (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  unique (inspection_id, inspector_id)
);

create index if not exists inspection_assignments_inspector_idx
  on public.inspection_assignments (inspector_id);

-- ============================================================================
-- inspection_reports
-- Files/photos an inspector uploads for a given inspection.
-- Actual binary content lives in Supabase Storage (bucket: "inspection-reports");
-- this table stores the storage path + metadata.
-- ============================================================================
create table if not exists public.inspection_reports (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections (id) on delete cascade,
  inspector_id uuid not null references public.profiles (id) on delete cascade,
  file_path text not null,
  file_name text not null,
  file_type text,
  description text,
  uploaded_at timestamptz not null default now()
);

create index if not exists inspection_reports_inspection_idx
  on public.inspection_reports (inspection_id);
create index if not exists inspection_reports_inspector_idx
  on public.inspection_reports (inspector_id);

-- ============================================================================
-- invoices
-- Invoices an inspector submits for a completed inspection.
-- File lives in Storage (bucket: "invoices").
-- ============================================================================
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections (id) on delete cascade,
  inspector_id uuid not null references public.profiles (id) on delete cascade,
  file_path text not null,
  file_name text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'USD',
  status text not null default 'submitted'
    check (status in ('submitted', 'approved', 'rejected', 'paid')),
  notes text,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

create index if not exists invoices_inspection_idx on public.invoices (inspection_id);
create index if not exists invoices_inspector_idx on public.invoices (inspector_id);

-- ============================================================================
-- expenses
-- Reimbursable expenses an inspector logs against an inspection.
-- File (receipt) lives in Storage (bucket: "expenses").
-- ============================================================================
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections (id) on delete cascade,
  inspector_id uuid not null references public.profiles (id) on delete cascade,
  description text not null,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'USD',
  file_path text,
  file_name text,
  status text not null default 'submitted'
    check (status in ('submitted', 'approved', 'rejected', 'reimbursed')),
  incurred_on date,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists expenses_set_updated_at on public.expenses;
create trigger expenses_set_updated_at
  before update on public.expenses
  for each row execute function public.set_updated_at();

create index if not exists expenses_inspection_idx on public.expenses (inspection_id);
create index if not exists expenses_inspector_idx on public.expenses (inspector_id);

-- ============================================================================
-- payments
-- Payment status tracking per inspection/inspector (what BMC owes/has paid
-- the inspector). Managed by admins, read-only for inspectors.
-- ============================================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid not null references public.inspections (id) on delete cascade,
  inspector_id uuid not null references public.profiles (id) on delete cascade,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'USD',
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'paid')),
  paid_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

create index if not exists payments_inspection_idx on public.payments (inspection_id);
create index if not exists payments_inspector_idx on public.payments (inspector_id);

-- ============================================================================
-- availability
-- Inspector-submitted availability windows.
-- ============================================================================
create table if not exists public.availability (
  id uuid primary key default gen_random_uuid(),
  inspector_id uuid not null references public.profiles (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  status text not null default 'available'
    check (status in ('available', 'unavailable')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

drop trigger if exists availability_set_updated_at on public.availability;
create trigger availability_set_updated_at
  before update on public.availability
  for each row execute function public.set_updated_at();

create index if not exists availability_inspector_idx on public.availability (inspector_id);

-- ============================================================================
-- Row Level Security
-- Inspectors: read/write only their own rows (and only inspections they're
-- assigned to). Admins: full access to everything.
-- ============================================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_assigned_to_inspection(target_inspection_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.inspection_assignments
    where inspection_id = target_inspection_id
      and inspector_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.inspections enable row level security;
alter table public.inspection_assignments enable row level security;
alter table public.inspection_reports enable row level security;
alter table public.invoices enable row level security;
alter table public.expenses enable row level security;
alter table public.payments enable row level security;
alter table public.availability enable row level security;

-- profiles: users can read/update their own profile; admins can read/update all.
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
  for update using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin" on public.profiles
  for insert with check (public.is_admin());

-- inspections: inspectors see only inspections they're assigned to; admins see all.
drop policy if exists "inspections_select_assigned_or_admin" on public.inspections;
create policy "inspections_select_assigned_or_admin" on public.inspections
  for select using (public.is_assigned_to_inspection(id) or public.is_admin());
drop policy if exists "inspections_write_admin" on public.inspections;
create policy "inspections_write_admin" on public.inspections
  for insert with check (public.is_admin());
drop policy if exists "inspections_update_assigned_or_admin" on public.inspections;
create policy "inspections_update_assigned_or_admin" on public.inspections
  for update using (public.is_assigned_to_inspection(id) or public.is_admin());
drop policy if exists "inspections_delete_admin" on public.inspections;
create policy "inspections_delete_admin" on public.inspections
  for delete using (public.is_admin());

-- inspection_assignments: inspectors see their own assignments; admins manage all.
drop policy if exists "assignments_select_own_or_admin" on public.inspection_assignments;
create policy "assignments_select_own_or_admin" on public.inspection_assignments
  for select using (inspector_id = auth.uid() or public.is_admin());
drop policy if exists "assignments_write_admin" on public.inspection_assignments;
create policy "assignments_write_admin" on public.inspection_assignments
  for insert with check (public.is_admin());
drop policy if exists "assignments_delete_admin" on public.inspection_assignments;
create policy "assignments_delete_admin" on public.inspection_assignments
  for delete using (public.is_admin());

-- inspection_reports: inspectors manage their own uploads on inspections they're
-- assigned to; admins see/manage all.
drop policy if exists "reports_select_own_or_admin" on public.inspection_reports;
create policy "reports_select_own_or_admin" on public.inspection_reports
  for select using (inspector_id = auth.uid() or public.is_admin());
drop policy if exists "reports_insert_own_assigned" on public.inspection_reports;
create policy "reports_insert_own_assigned" on public.inspection_reports
  for insert with check (
    inspector_id = auth.uid() and public.is_assigned_to_inspection(inspection_id)
    or public.is_admin()
  );
drop policy if exists "reports_update_own_or_admin" on public.inspection_reports;
create policy "reports_update_own_or_admin" on public.inspection_reports
  for update using (inspector_id = auth.uid() or public.is_admin());
drop policy if exists "reports_delete_own_or_admin" on public.inspection_reports;
create policy "reports_delete_own_or_admin" on public.inspection_reports
  for delete using (inspector_id = auth.uid() or public.is_admin());

-- invoices: inspectors manage their own; admins see/manage all (approve/mark paid).
drop policy if exists "invoices_select_own_or_admin" on public.invoices;
create policy "invoices_select_own_or_admin" on public.invoices
  for select using (inspector_id = auth.uid() or public.is_admin());
drop policy if exists "invoices_insert_own_assigned" on public.invoices;
create policy "invoices_insert_own_assigned" on public.invoices
  for insert with check (
    inspector_id = auth.uid() and public.is_assigned_to_inspection(inspection_id)
    or public.is_admin()
  );
drop policy if exists "invoices_update_own_or_admin" on public.invoices;
create policy "invoices_update_own_or_admin" on public.invoices
  for update using (inspector_id = auth.uid() or public.is_admin());
drop policy if exists "invoices_delete_own_or_admin" on public.invoices;
create policy "invoices_delete_own_or_admin" on public.invoices
  for delete using (inspector_id = auth.uid() or public.is_admin());

-- expenses: same pattern as invoices.
drop policy if exists "expenses_select_own_or_admin" on public.expenses;
create policy "expenses_select_own_or_admin" on public.expenses
  for select using (inspector_id = auth.uid() or public.is_admin());
drop policy if exists "expenses_insert_own_assigned" on public.expenses;
create policy "expenses_insert_own_assigned" on public.expenses
  for insert with check (
    inspector_id = auth.uid() and public.is_assigned_to_inspection(inspection_id)
    or public.is_admin()
  );
drop policy if exists "expenses_update_own_or_admin" on public.expenses;
create policy "expenses_update_own_or_admin" on public.expenses
  for update using (inspector_id = auth.uid() or public.is_admin());
drop policy if exists "expenses_delete_own_or_admin" on public.expenses;
create policy "expenses_delete_own_or_admin" on public.expenses
  for delete using (inspector_id = auth.uid() or public.is_admin());

-- payments: inspectors read-only their own; admins manage all.
drop policy if exists "payments_select_own_or_admin" on public.payments;
create policy "payments_select_own_or_admin" on public.payments
  for select using (inspector_id = auth.uid() or public.is_admin());
drop policy if exists "payments_write_admin" on public.payments;
create policy "payments_write_admin" on public.payments
  for insert with check (public.is_admin());
drop policy if exists "payments_update_admin" on public.payments;
create policy "payments_update_admin" on public.payments
  for update using (public.is_admin());
drop policy if exists "payments_delete_admin" on public.payments;
create policy "payments_delete_admin" on public.payments
  for delete using (public.is_admin());

-- availability: inspectors manage only their own; admins read all.
drop policy if exists "availability_select_own_or_admin" on public.availability;
create policy "availability_select_own_or_admin" on public.availability
  for select using (inspector_id = auth.uid() or public.is_admin());
drop policy if exists "availability_insert_own" on public.availability;
create policy "availability_insert_own" on public.availability
  for insert with check (inspector_id = auth.uid() or public.is_admin());
drop policy if exists "availability_update_own_or_admin" on public.availability;
create policy "availability_update_own_or_admin" on public.availability
  for update using (inspector_id = auth.uid() or public.is_admin());
drop policy if exists "availability_delete_own_or_admin" on public.availability;
create policy "availability_delete_own_or_admin" on public.availability
  for delete using (inspector_id = auth.uid() or public.is_admin());

-- ============================================================================
-- admin_list_users
-- auth.users isn't exposed via the API schema, so the client can't query
-- emails directly. This security-definer function joins profiles with
-- auth.users and is restricted to admins (raises if called by anyone else),
-- letting the Operations dashboard list users with their email addresses.
-- ============================================================================
create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  role text,
  full_name text,
  phone text,
  created_at timestamptz
)
language plpgsql
stable
security definer set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only admins can list users';
  end if;

  return query
    select p.id, u.email::text, p.role, p.full_name, p.phone, p.created_at
    from public.profiles p
    join auth.users u on u.id = p.id
    order by p.created_at asc;
end;
$$;

revoke all on function public.admin_list_users() from public;
grant execute on function public.admin_list_users() to authenticated;

-- ============================================================================
-- Storage buckets (private; access controlled via signed URLs + RLS-style
-- storage policies mirroring the tables above)
-- ============================================================================
insert into storage.buckets (id, name, public)
values
  ('inspection-reports', 'inspection-reports', false),
  ('invoices', 'invoices', false),
  ('expenses', 'expenses', false)
on conflict (id) do nothing;

-- Storage policy convention: objects are stored under `${inspection_id}/${filename}`
-- for reports, and `${inspector_id}/${filename}` for invoices/expenses, so we can
-- check the owning inspector via the path prefix.
drop policy if exists "storage_reports_select" on storage.objects;
create policy "storage_reports_select" on storage.objects
  for select using (
    bucket_id = 'inspection-reports'
    and (public.is_admin() or public.is_assigned_to_inspection((storage.foldername(name))[1]::uuid))
  );
drop policy if exists "storage_reports_insert" on storage.objects;
create policy "storage_reports_insert" on storage.objects
  for insert with check (
    bucket_id = 'inspection-reports'
    and (public.is_admin() or public.is_assigned_to_inspection((storage.foldername(name))[1]::uuid))
  );

drop policy if exists "storage_invoices_all" on storage.objects;
create policy "storage_invoices_all" on storage.objects
  for all using (
    bucket_id = 'invoices'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  ) with check (
    bucket_id = 'invoices'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );

drop policy if exists "storage_expenses_all" on storage.objects;
create policy "storage_expenses_all" on storage.objects
  for all using (
    bucket_id = 'expenses'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  ) with check (
    bucket_id = 'expenses'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );
