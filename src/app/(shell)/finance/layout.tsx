import type { ReactNode } from "react";
import AppShell, { type AppShellNavItem } from "@/components/shared/app-shell";
import { requireAdminOrRedirect } from "@/lib/supabase/guards";

const NAV_ITEMS: AppShellNavItem[] = [
  { key: "dashboard", label: "Panel", href: "/finance/dashboard", icon: "dashboard" },
  { key: "invoices", label: "Facturas", href: "/finance/invoices", icon: "invoices" },
  { key: "expenses", label: "Gastos", href: "/finance/expenses", icon: "expenses" },
];

export default async function FinanceLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireAdminOrRedirect();

  return (
    <AppShell
      moduleLabel="Finance"
      navItems={NAV_ITEMS}
      displayName={profile?.full_name || "Finance"}
      logoutRedirect="/login"
    >
      {children}
    </AppShell>
  );
}
