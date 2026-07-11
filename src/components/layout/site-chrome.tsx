"use client";

import { usePathname } from "next/navigation";

// The Inspector Portal has its own shell (see portal/layout.tsx) and
// shouldn't be wrapped in the public marketing site's Header/Footer.
const PORTAL_PATH_PATTERN = /^\/[a-z]{2}\/portal(\/|$)/;

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortalRoute = PORTAL_PATH_PATTERN.test(pathname ?? "");

  if (isPortalRoute) return null;

  return <>{children}</>;
}
