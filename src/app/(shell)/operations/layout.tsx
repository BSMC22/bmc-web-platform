import type { ReactNode } from "react";
import AppShell, { type AppShellNavItem } from "@/components/shared/app-shell";
import { requireAdminOrRedirect } from "@/lib/supabase/guards";

const NAV_ITEMS: AppShellNavItem[] = [
  { key: "dashboard", label: "Panel", href: "/operations/dashboard", icon: "dashboard" },
  { key: "inspections", label: "Inspecciones", href: "/operations/inspections", icon: "inspections" },
];

export default async function OperationsLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireAdminOrRedirect();

  return (
    <AppShell
      moduleLabel="Operations"
      navItems={NAV_ITEMS}
      displayName={profile?.full_name || "Operaciones"}
      logoutRedirect="/login"
    >
      {children}
    </AppShell>
  );
}
