import type { ReactNode } from "react";
import AppShell, { type AppShellNavItem } from "@/components/shared/app-shell";
import { requireAdminOrRedirect } from "@/lib/supabase/guards";

const NAV_ITEMS: AppShellNavItem[] = [
  { key: "dashboard", label: "Panel", href: "/client/dashboard", icon: "dashboard" },
];

export default async function ClientLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireAdminOrRedirect();

  return (
    <AppShell
      moduleLabel="Client Portal"
      navItems={NAV_ITEMS}
      displayName={profile?.full_name || "Client"}
      logoutRedirect="/login"
    >
      {children}
    </AppShell>
  );
}
