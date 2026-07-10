import Link from "next/link";
import Container from "@/components/ui/container";
import Button from "@/components/ui/button";
import MobileNav from "@/components/layout/mobile-nav";
import { primaryNav } from "@/lib/navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-slate-200 bg-white/95 backdrop-blur">
      <Container>
        <div className="relative flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-navy-900 text-sm font-bold tracking-wide text-brand-teal-400">
              BMC
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-bold text-brand-navy-900">
                Blueseas Marine Consulting
              </span>
              <span className="text-xs text-brand-slate-500">
                Worldwide Marine Inspection &amp; Technical Consultancy
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

          <div className="hidden md:block">
            <Button href="/contact" size="sm">
              Solicitar Inspección
            </Button>
          </div>

          <MobileNav links={primaryNav} />
        </div>
      </Container>
    </header>
  );
}
