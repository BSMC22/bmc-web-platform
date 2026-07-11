import type { ReactNode } from "react";
import AppShell from "@/components/shared/app-shell";
import { OS_NAV, OS_PORTAL_LINKS } from "@/lib/navigation-os";
import { requireAdminOrRedirect } from "@/lib/supabase/guards";

/**
 * Single shared layout for the whole admin hub - Executive Center,
 * Operations, Master Data, Finance, Analytics, Administration. Replaces the
 * three separate layouts each module had in Fase 1 (one guard instead of
 * three, one nav definition instead of six). Executive Center is the
 * landing point for admin/super_admin (see src/lib/roles.ts), so this hub
 * doesn't brand itself as any single module - the unified sidebar makes
 * that explicit instead.
 */
export default async function AdminHubLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireAdminOrRedirect();

  return (
    <AppShell
      sections={OS_NAV}
      portalLinks={OS_PORTAL_LINKS}
      displayName={profile?.full_name || "Blueseas OS"}
      logoutRedirect="/login"
    >
      {children}
    </AppShell>
  );
}
