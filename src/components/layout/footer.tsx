import Link from "next/link";
import Container from "@/components/ui/container";
import { MailIcon, PhoneIcon, MapPinIcon } from "@/components/icons";
import { primaryNav } from "@/lib/navigation";

const services = [
  { label: "Marine Inspections", href: "/services" },
  { label: "Technical Audits", href: "/services" },
  { label: "Condition Surveys", href: "/services" },
  { label: "Vetting Support", href: "/services" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-navy-950 text-brand-slate-200">
      <Container>
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-sm font-bold tracking-wide text-brand-teal-400">
                BMC
              </span>
              <span className="text-sm font-bold text-white">
                Blueseas Marine Consulting
              </span>
            </div>
            <p className="text-sm leading-relaxed text-brand-slate-200/80">
              Inspección marina, auditorías técnicas y consultoría para la industria
              marítima, con cobertura global y respuesta rápida.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Navegación
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
              Servicios
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="text-sm text-brand-slate-200/80 hover:text-brand-teal-300"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Contacto
            </h3>
            {/* TODO(BMC): reemplazar con los datos de contacto reales antes de publicar */}
            <ul className="mt-4 flex flex-col gap-3 text-sm text-brand-slate-200/80">
              <li className="flex items-center gap-2.5">
                <MailIcon className="h-4 w-4 shrink-0 text-brand-teal-400" />
                <span>contact@blueseasmc.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <PhoneIcon className="h-4 w-4 shrink-0 text-brand-teal-400" />
                <span>+1 (000) 000-0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPinIcon className="h-4 w-4 shrink-0 text-brand-teal-400" />
                <span>Oficina central — dirección pendiente</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs text-brand-slate-200/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Blueseas Marine Consulting. Todos los derechos reservados.</p>
          <p>Worldwide Marine Inspection, Audits and Technical Consultancy.</p>
        </div>
      </Container>
    </footer>
  );
}
