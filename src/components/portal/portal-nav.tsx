"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  ClipboardCheckIcon,
  ReceiptIcon,
  WalletIcon,
  CalendarIcon,
} from "@/components/icons";
import { localizedPath } from "@/lib/navigation";
import type { Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/dictionaries";

type PortalNavDict = Dictionary["portal"]["nav"];

export default function PortalNav({
  lang,
  dict,
  orientation = "vertical",
}: {
  lang: Locale;
  dict: PortalNavDict;
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();

  const links = [
    { key: "dashboard", label: dict.dashboard, href: localizedPath(lang, "/portal"), Icon: LayoutDashboardIcon },
    { key: "inspections", label: dict.inspections, href: localizedPath(lang, "/portal/inspections"), Icon: ClipboardCheckIcon },
    { key: "invoices", label: dict.invoices, href: localizedPath(lang, "/portal/invoices"), Icon: ReceiptIcon },
    { key: "expenses", label: dict.expenses, href: localizedPath(lang, "/portal/expenses"), Icon: WalletIcon },
    { key: "availability", label: dict.availability, href: localizedPath(lang, "/portal/availability"), Icon: CalendarIcon },
  ];

  const navLayout =
    orientation === "horizontal" ? "flex flex-row gap-1 overflow-x-auto" : "flex flex-col gap-1";

  return (
    <nav className={navLayout}>
      {links.map(({ key, label, href, Icon }) => {
        const isActive = pathname === href;
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
}
