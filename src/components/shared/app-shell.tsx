"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  AnchorIcon,
  LayoutDashboardIcon,
  ClipboardCheckIcon,
  TrendingUpIcon,
  UsersIcon,
  ReceiptIcon,
  WalletIcon,
  ContainerIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
} from "@/components/icons";
import LogoutButton from "@/components/shared/logout-button";

// Server Components (the module layouts) can't pass component/function
// references as props into a Client Component like this one - React can't
// serialize them across the boundary ("Functions cannot be passed directly
// to Client Components..."). So nav items carry an icon *name* instead, and
// this map (defined inside the client file) resolves it to the real icon.
const ICONS = {
  dashboard: LayoutDashboardIcon,
  inspections: ClipboardCheckIcon,
  kpis: TrendingUpIcon,
  users: UsersIcon,
  invoices: ReceiptIcon,
  expenses: WalletIcon,
  "master-data": ContainerIcon,
  administration: ShieldCheckIcon,
  commercial: BriefcaseIcon,
} as const;

export type AppShellIconName = keyof typeof ICONS;

export type AppShellNavItem = {
  key: string;
  label: string;
  href: string;
  icon: AppShellIconName;
};

// Nested nav used by the admin hub (Executive/Operations/Master Data/
// Finance/Analytics/Administration) - a section with children auto-expands
// its sub-items whenever the current route falls under `basePath`.
export type AppShellNavChild = { key: string; label: string; href: string };

export type AppShellNavSection = {
  key: string;
  label: string;
  href: string;
  basePath: string;
  icon: AppShellIconName;
  children?: AppShellNavChild[];
};

export type AppShellPortalLink = { key: string; label: string; href: string };

/**
 * Shared authenticated shell (desktop sidebar + mobile top bar) for every
 * Blueseas OS module. Two nav shapes are supported so this stays one
 * component instead of being duplicated:
 *  - `navItems`: flat list (used by Shareholder/Client - unchanged since
 *    Fase 1).
 *  - `sections` (+ optional `portalLinks`): nested admin hub nav (used by
 *    the Executive/Operations/Master Data/Finance/Analytics/Administration
 *    group) - only one of the two should be passed.
 */
export default function AppShell({
  moduleLabel,
  navItems,
  sections,
  portalLinks,
  displayName,
  logoutRedirect,
  logoutLabel = "Cerrar sesión",
  children,
}: {
  moduleLabel?: string;
  navItems?: AppShellNavItem[];
  sections?: AppShellNavSection[];
  portalLinks?: AppShellPortalLink[];
  displayName: string;
  logoutRedirect: string;
  logoutLabel?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  const linkClasses = (isActive: boolean) =>
    `flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive ? "bg-white/10 text-white" : "text-brand-slate-300 hover:bg-white/5 hover:text-white"
    }`;

  const childLinkClasses = (isActive: boolean) =>
    `block rounded-md px-3 py-1.5 text-sm transition-colors ${
      isActive ? "text-white" : "text-brand-slate-400 hover:text-white"
    }`;

  const flatNav = (orientation: "vertical" | "horizontal") => (
    <nav className={orientation === "vertical" ? "flex flex-col gap-1" : "flex flex-row gap-1 overflow-x-auto"}>
      {(navItems ?? []).map(({ key, label, href, icon }) => {
        const isActive = pathname === href;
        const Icon = ICONS[icon];
        return (
          <Link key={key} href={href} className={linkClasses(isActive)}>
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const nestedNav = (orientation: "vertical" | "horizontal") => (
    <nav className={orientation === "vertical" ? "flex flex-col gap-1" : "flex flex-row gap-1 overflow-x-auto"}>
      {(sections ?? []).map((section) => {
        const isActiveSection = pathname === section.basePath || pathname.startsWith(`${section.basePath}/`);
        const Icon = ICONS[section.icon];
        return (
          <div key={section.key} className={orientation === "vertical" ? "flex flex-col" : "shrink-0"}>
            <Link href={section.href} className={linkClasses(isActiveSection)}>
              <Icon className="h-4 w-4" />
              {section.label}
            </Link>
            {orientation === "vertical" && isActiveSection && section.children && section.children.length > 0 ? (
              <div className="ml-7 mt-1 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                {section.children.map((child) => (
                  <Link key={child.key} href={child.href} className={childLinkClasses(pathname === child.href)}>
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      {orientation === "vertical" && portalLinks && portalLinks.length > 0 ? (
        <div className="mt-4 flex flex-col gap-1 border-t border-white/10 pt-4">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-brand-slate-500">
            Portales
          </p>
          {portalLinks.map((link) => (
            <Link key={link.key} href={link.href} className={childLinkClasses(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  );

  const nav = (orientation: "vertical" | "horizontal") =>
    sections ? nestedNav(orientation) : flatNav(orientation);

  return (
    <div className="flex min-h-screen flex-col bg-brand-slate-100 md:flex-row">
      <aside className="hidden w-64 shrink-0 flex-col bg-brand-navy-900 px-4 py-6 md:flex">
        <div className="flex items-center gap-2 px-2 pb-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-brand-teal-400">
            <AnchorIcon className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-widest text-white">
            Blueseas OS
          </span>
        </div>
        {moduleLabel ? (
          <p className="px-2 pb-5 text-xs font-medium uppercase tracking-widest text-brand-teal-400">
            {moduleLabel}
          </p>
        ) : (
          <div className="pb-3" />
        )}

        <div className="flex-1">{nav("vertical")}</div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="truncate px-3 text-xs text-brand-slate-400">{displayName}</p>
          <LogoutButton redirectTo={logoutRedirect} label={logoutLabel} />
        </div>
      </aside>

      <header className="flex items-center justify-between bg-brand-navy-900 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-brand-teal-400">
            <AnchorIcon className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-widest text-white">
            Blueseas OS{moduleLabel ? ` · ${moduleLabel}` : ""}
          </span>
        </div>
        <LogoutButton redirectTo={logoutRedirect} label={logoutLabel} />
      </header>
      <nav className="border-b border-brand-slate-200 bg-brand-navy-900 px-4 pb-3 md:hidden">
        {nav("horizontal")}
      </nav>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
