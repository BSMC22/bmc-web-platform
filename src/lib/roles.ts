// Blueseas OS role model.
//
// IMPORTANT: only "admin" and "inspector" are real Supabase roles today -
// `public.profiles.role` has `check (role in ('admin', 'inspector'))` (see
// supabase/schema.sql). The other five roles below are prepared here so the
// redirect map, navigation and permission checks are ready to extend once
// those roles are actually added to the database in a later phase. Until
// then they simply can't be assigned to a real user.
export type AppRole =
  | "super_admin"
  | "admin"
  | "operations"
  | "finance"
  | "shareholder"
  | "inspector"
  | "client";

// Where each role lands right after login.
export const ROLE_REDIRECTS: Record<AppRole, string> = {
  super_admin: "/executive",
  admin: "/executive",
  operations: "/operations/dashboard",
  finance: "/finance/dashboard",
  shareholder: "/shareholder/dashboard",
  inspector: "/inspector/dashboard",
  client: "/client/dashboard",
};
