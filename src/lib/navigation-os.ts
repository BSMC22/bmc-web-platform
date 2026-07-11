import type { AppShellNavSection, AppShellPortalLink } from "@/components/shared/app-shell";
import { defaultLocale } from "@/lib/i18n-config";

/**
 * The definitive Blueseas OS menu (Fase 1.6 - Commercial Module & Final
 * Navigation Refinement). This is the single source of truth for the admin
 * hub's navigation - it's rendered by the shared `(admin)/layout.tsx` via
 * AppShell's `sections` prop, so every screen under Executive/Commercial/
 * Operations/Business Data/Finance/Analytics/Administration shows the exact
 * same menu, with the active section auto-expanded.
 *
 * Many of the child routes below are placeholders (no logic yet) - see
 * INFORME-FASE-1.6.md for the full list of what's real vs. prepared.
 *
 * Note: the "master-data" key/route is unchanged on purpose (URLs stay
 * stable) - only its visible label became "Business Data" in Fase 1.6.
 */
export const OS_NAV: AppShellNavSection[] = [
  {
    key: "executive",
    label: "Executive Center",
    href: "/executive",
    basePath: "/executive",
    icon: "dashboard",
  },
  {
    key: "commercial",
    label: "Commercial",
    href: "/commercial/dashboard",
    basePath: "/commercial",
    icon: "commercial",
    children: [
      { key: "dashboard", label: "Dashboard", href: "/commercial/dashboard" },
      { key: "leads", label: "Leads", href: "/commercial/leads" },
      { key: "opportunities", label: "Opportunities", href: "/commercial/opportunities" },
      { key: "quotations", label: "Quotations", href: "/commercial/quotations" },
    ],
  },
  {
    key: "operations",
    label: "Operations",
    href: "/operations/dashboard",
    basePath: "/operations",
    icon: "inspections",
    children: [
      { key: "dashboard", label: "Dashboard", href: "/operations/dashboard" },
      { key: "jobs", label: "Jobs", href: "/operations/jobs" },
      { key: "calendar", label: "Calendar", href: "/operations/calendar" },
      { key: "assignments", label: "Assignments", href: "/operations/assignments" },
      { key: "reports", label: "Reports", href: "/operations/reports" },
      // Not part of the target menu list, kept so the real, working
      // inspection-creation + inspector-assignment flow built in Fase 1
      // stays reachable until "Jobs"/"Assignments" absorb it in Fase 2.
      { key: "inspections", label: "Inspecciones (Fase 1)", href: "/operations/inspections" },
    ],
  },
  {
    key: "master-data",
    label: "Business Data",
    href: "/master-data/clients",
    basePath: "/master-data",
    icon: "master-data",
    children: [
      { key: "clients", label: "Clients", href: "/master-data/clients" },
      { key: "contacts", label: "Contacts", href: "/master-data/contacts" },
      { key: "vessels", label: "Vessels", href: "/master-data/vessels" },
      { key: "inspectors", label: "Inspectors", href: "/master-data/inspectors" },
      { key: "ports", label: "Ports", href: "/master-data/ports" },
      { key: "countries", label: "Countries", href: "/master-data/countries" },
      { key: "service-types", label: "Service Types", href: "/master-data/service-types" },
      { key: "companies", label: "Companies", href: "/master-data/companies" },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    href: "/finance/dashboard",
    basePath: "/finance",
    icon: "invoices",
    children: [
      { key: "dashboard", label: "Dashboard", href: "/finance/dashboard" },
      { key: "invoices", label: "Invoices", href: "/finance/invoices" },
      { key: "payments", label: "Payments", href: "/finance/payments" },
      { key: "expenses", label: "Expenses", href: "/finance/expenses" },
      { key: "accounts-receivable", label: "Accounts Receivable", href: "/finance/accounts-receivable" },
      { key: "collections", label: "Collections", href: "/finance/collections" },
      { key: "accounts-payable", label: "Accounts Payable", href: "/finance/accounts-payable" },
      { key: "profitability", label: "Profitability", href: "/finance/profitability" },
    ],
  },
  {
    key: "analytics",
    label: "Analytics",
    href: "/analytics/kpis",
    basePath: "/analytics",
    icon: "kpis",
    children: [
      { key: "kpis", label: "KPIs", href: "/analytics/kpis" },
      { key: "reports", label: "Reports", href: "/analytics/reports" },
      { key: "dashboards", label: "Dashboards", href: "/analytics/dashboards" },
    ],
  },
  {
    key: "administration",
    label: "Administration",
    href: "/administration/users",
    basePath: "/administration",
    icon: "administration",
    children: [
      { key: "users", label: "Users", href: "/administration/users" },
      { key: "roles", label: "Roles", href: "/administration/roles" },
      { key: "permissions", label: "Permissions", href: "/administration/permissions" },
      { key: "settings", label: "Settings", href: "/administration/settings" },
      { key: "audit-logs", label: "Audit Logs", href: "/administration/audit-logs" },
      { key: "system-health", label: "System Health", href: "/administration/system-health" },
    ],
  },
];

// Cross-links from the admin hub into the other personas' portals, shown at
// the bottom of the sidebar (matches the tail of the target menu in the
// Fase 1.5 spec: Inspector Portal / Client Portal / Shareholder Portal).
export const OS_PORTAL_LINKS: AppShellPortalLink[] = [
  { key: "inspector", label: "Portal", href: `/${defaultLocale}/portal` },
  { key: "client", label: "Client Portal", href: "/client/dashboard" },
  { key: "shareholder", label: "Shareholder Portal", href: "/shareholder/dashboard" },
];
