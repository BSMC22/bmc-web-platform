import { redirect } from "next/navigation";

// User management moved to /administration/users in Fase 1.5 (folded into
// the new Administration module, matching the target nav). This shim keeps
// the old Fase 1 URL from 404ing.
export default function ExecutiveUsersRedirect() {
  redirect("/administration/users");
}
