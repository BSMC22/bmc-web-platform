import type { ReactNode } from "react";
import AppShell, { type AppShellNavItem } from "@/components/shared/app-shell";
import { requireAdminOrRedirect } from "@/lib/supabase/guards";

const NAV_ITEMS: AppShellNavItem[] = [
  { key: "summary", label: "Resumen", href: "/executive", icon: "dashboard" },
  { key: "kpis", label: "KPIs", href: "/executive/kpis", icon: "kpis" },
  { key: "users", label: "Usuarios", href: "/executive/users", icon: "users" },
];

export default async function ExecutiveLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireAdminOrRedirect();

  return (
    <AppShell
      moduleLabel="Executive Center"
      navItems={NAV_ITEMS}
      displayName={profile?.full_name || "Executive"}
      logoutRedirect="/login"
    >
      {children}
    </AppShell>
  );
}
