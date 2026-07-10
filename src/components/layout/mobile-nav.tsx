"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "@/components/icons";
import type { NavLink } from "@/lib/navigation";
import { localizedPath } from "@/lib/navigation";
import type { Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/dictionaries";

export default function MobileNav({
  links,
  lang,
  dict,
}: {
  links: NavLink[];
  lang: Locale;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? dict.common.closeMenu : dict.common.openMenu}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-brand-navy-900 hover:bg-brand-slate-100"
      >
        {open ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-full z-40 border-t border-brand-slate-200 bg-white shadow-lg">
          <nav className="flex flex-col px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-brand-slate-100 py-3 text-base font-medium text-brand-navy-900 last:border-none"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={localizedPath(lang, "/contact")}
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-brand-teal-500 px-5 py-3 text-sm font-semibold text-brand-navy-950"
            >
              {dict.common.ctaRequestInspection}
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
