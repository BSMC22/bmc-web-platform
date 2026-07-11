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
} as const;

export type AppShellIconName = keyof typeof ICONS;

export type AppShellNavItem = {
  key: string;
  label: string;
  href: string;
  icon: AppShellIconName;
};

/**
 * Shared authenticated shell (desktop sidebar + mobile top bar) for every
 * Blueseas OS module - Executive, Operations, Finance, Shareholder, Client.
 * Keeps the sidebar markup in one place instead of copy-pasted per module.
 */
export default function AppShell({
  moduleLabel,
  navItems,
  displayName,
  logoutRedirect,
  logoutLabel = "Cerrar sesión",
  children,
}: {
  moduleLabel: string;
  navItems: AppShellNavItem[];
  displayName: string;
  logoutRedirect: string;
  logoutLabel?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  const nav = (orientation: "vertical" | "horizontal") => (
    <nav className={orientation === "vertical" ? "flex flex-col gap-1" : "flex flex-row gap-1 overflow-x-auto"}>
      {navItems.map(({ key, label, href, icon }) => {
        const isActive = pathname === href;
        const Icon = ICONS[icon];
        return (
          <Link
            key={key}
            href={href}
            className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-white/10 text-white"
                : "text-brand-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

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
        <p className="px-2 pb-5 text-xs font-medium uppercase tracking-widest text-brand-teal-400">
          {moduleLabel}
        </p>

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
            Blueseas OS · {moduleLabel}
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
