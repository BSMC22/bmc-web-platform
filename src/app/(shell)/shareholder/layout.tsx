import type { ReactNode } from "react";
import AppShell, { type AppShellNavItem } from "@/components/shared/app-shell";
import { requireAdminOrRedirect } from "@/lib/supabase/guards";

const NAV_ITEMS: AppShellNavItem[] = [
  { key: "dashboard", label: "Panel", href: "/shareholder/dashboard", icon: "dashboard" },
];

export default async function ShareholderLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireAdminOrRedirect();

  return (
    <AppShell
      moduleLabel="Shareholder Portal"
      navItems={NAV_ITEMS}
      displayName={profile?.full_name || "Shareholder"}
      logoutRedirect="/login"
    >
      {children}
    </AppShell>
  );
}
