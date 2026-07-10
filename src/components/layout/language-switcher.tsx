"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n-config";

export default function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname() ?? `/${lang}`;
  const segments = pathname.split("/");

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-brand-slate-200 p-0.5">
      {locales.map((locale) => {
        const targetSegments = [...segments];
        if (targetSegments.length > 1) {
          targetSegments[1] = locale;
        }
        const href = targetSegments.join("/") || `/${locale}`;
        const isActive = locale === lang;

        return (
          <Link
            key={locale}
            href={href}
            aria-current={isActive ? "true" : undefined}
            className={`rounded px-2 py-1 text-xs font-semibold uppercase transition-colors ${
              isActive
                ? "bg-brand-navy-900 text-white"
                : "text-brand-slate-500 hover:text-brand-navy-900"
            }`}
          >
            {locale}
          </Link>
        );
      })}
    </div>
  );
}
