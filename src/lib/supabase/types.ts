// Hand-written types mirroring `supabase/schema.sql`.
// Once the project is live, these can be replaced with generated types via
// `supabase gen types typescript --project-id <ref> > src/lib/supabase/types.ts`.

export type ProfileRole = "admin" | "inspector";

export interface Profile {
  id: string;
  role: ProfileRole;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export type InspectionStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface Inspection {
  id: string;
  title: string;
  client_name: string;
  vessel_name: string | null;
  port: string | null;
  location: string | null;
  service_type: string | null;
  status: InspectionStatus;
  scheduled_date: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface InspectionAssignment {
  id: string;
  inspection_id: string;
  inspector_id: string;
  assigned_at: string;
}

export interface InspectionReport {
  id: string;
  inspection_id: string;
  inspector_id: string;
  file_path: string;
  file_name: string;
  file_type: string | null;
  description: string | null;
  uploaded_at: string;
}

export type InvoiceStatus = "submitted" | "approved" | "rejected" | "paid";

export interface Invoice {
  id: string;
  inspection_id: string;
  inspector_id: string;
  file_path: string;
  file_name: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  notes: string | null;
  submitted_at: string;
  updated_at: string;
}

export type ExpenseStatus = "submitted" | "approved" | "rejected" | "reimbursed";

export interface Expense {
  id: string;
  inspection_id: string;
  inspector_id: string;
  description: string;
  amount: number;
  currency: string;
  file_path: string | null;
  file_name: string | null;
  status: ExpenseStatus;
  incurred_on: string | null;
  submitted_at: string;
  updated_at: string;
}

export type PaymentStatus = "pending" | "processing" | "paid";

export interface Payment {
  id: string;
  inspection_id: string;
  inspector_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Returned by the `admin_list_users()` Postgres function (admin-only; joins
// profiles with auth.users to expose email, which isn't otherwise queryable
// from the client since auth.users isn't in the exposed API schema).
export interface AdminUser {
  id: string;
  email: string;
  role: ProfileRole;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

export type AvailabilityStatus = "available" | "unavailable";

export interface Availability {
  id: string;
  inspector_id: string;
  start_date: string;
  end_date: string;
  status: AvailabilityStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
