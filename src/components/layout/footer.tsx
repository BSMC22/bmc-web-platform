import Link from "next/link";
import Container from "@/components/ui/container";
import { MailIcon, PhoneIcon, MapPinIcon } from "@/components/icons";
import { getPrimaryNav, localizedPath } from "@/lib/navigation";
import type { Locale } from "@/lib/i18n-config";
import type { Dictionary } from "@/lib/dictionaries";

export default function Footer({ lang, dict }: { lang: Locale; dict: Dictionary }) {
  const primaryNav = getPrimaryNav(lang, dict);

  return (
    <footer className="bg-brand-navy-950 text-brand-slate-200">
      <Container>
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-sm font-bold tracking-wide text-brand-teal-400">
                {dict.common.brandShort}
              </span>
              <span className="text-sm font-bold text-white">
                {dict.common.brandName}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-brand-slate-200/80">
              {dict.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              {dict.footer.navHeading}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-slate-200/80 hover:text-brand-teal-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              {dict.footer.servicesHeading}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {dict.footer.services.map((service) => (
                <li key={service}>
                  <Link
                    href={localizedPath(lang, "/services")}
                    className="text-sm text-brand-slate-200/80 hover:text-brand-teal-300"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              {dict.footer.contactHeading}
            </h3>
            {/* TODO(BMC): reemplazar con los datos de contacto reales antes de publicar */}
            <ul className="mt-4 flex flex-col gap-3 text-sm text-brand-slate-200/80">
              <li className="flex items-center gap-2.5">
                <MailIcon className="h-4 w-4 shrink-0 text-brand-teal-400" />
                <span>{dict.footer.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="h-4 w-4 shrink-0 text-brand-teal-400" />
                <span>{dict.footer.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPinIcon className="h-4 w-4 shrink-0 text-brand-teal-400" />
                <span>{dict.footer.officeShort}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-brand-slate-200/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {dict.common.brandName}. {dict.footer.copyright}</p>
          <div className="flex items-center gap-4">
            <p>{dict.footer.tagline}</p>
            <Link
              href={localizedPath(lang, "/portal/login")}
              prefetch={false}
              className="text-brand-slate-200/60 underline-offset-2 hover:text-brand-teal-300 hover:underline"
            >
              {dict.footer.portalLink}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
