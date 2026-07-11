import { redirect } from "next/navigation";

// KPIs moved to /analytics/kpis in Fase 1.5 (Analytics is now its own
// module, independent from Executive Center). This shim keeps the old
// Fase 1 URL from 404ing.
export default function ExecutiveKpisRedirect() {
  redirect("/analytics/kpis");
}
