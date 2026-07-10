import Link from "next/link";
import Container from "@/components/ui/container";
import Button from "@/components/ui/button";
import MobileNav from "@/components/layout/mobile-nav";
import LanguageSwitcher from "@/components/layout/language-switcher";
import { getPrimaryNav, localizedPath } from "@/lib/navigation";
import type { Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/dictionaries";

export default function Header({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const primaryNav = getPrimaryNav(lang, dict);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-slate-200 bg-white/95 backdrop-blur">
      <Container>
        <div className="relative flex items-center justify-between py-4">
          <Link href={localizedPath(lang)} className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-navy-900 text-sm font-bold tracking-wide text-brand-teal-400">
              {dict.common.brandShort}
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-bold text-brand-navy-900">
                {dict.common.brandName}
              </span>
              <span className="text-xs text-brand-slate-500">
                {dict.common.brandTagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-brand-slate-600 transition-colors hover:text-brand-navy-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitcher lang={lang} />
            <Button href={localizedPath(lang, "/contact")} size="sm">
              {dict.common.ctaRequestInspection}
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher lang={lang} />
            <MobileNav links={primaryNav} lang={lang} dict={dict} />
          </div>
        </div>
      </Container>
    </header>
  );
}
