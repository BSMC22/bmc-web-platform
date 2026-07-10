"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "@/components/icons";
import type { NavLink } from "@/lib/navigation";

export default function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
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
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-brand-teal-500 px-5 py-3 text-sm font-semibold text-brand-navy-950"
            >
              Solicitar Inspección
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
