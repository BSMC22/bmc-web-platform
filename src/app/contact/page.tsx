import type { Metadata } from "next";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import ContactForm from "@/components/contact/contact-form";
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactá a Blueseas Marine Consulting (BMC) para solicitar una inspección, auditoría técnica o consultoría marítima en cualquier parte del mundo.",
};

const contactInfo = [
  { icon: MailIcon, label: "Email", value: "contact@blueseasmc.com" },
  { icon: PhoneIcon, label: "Teléfono", value: "+1 (000) 000-0000" },
  { icon: MapPinIcon, label: "Oficina Central", value: "Dirección pendiente" },
  { icon: ClockIcon, label: "Horario", value: "Lunes a Viernes, 9:00 - 18:00" },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col gap-6 py-20 sm:py-24">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-teal-300">
              Contact
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl">
              Hablemos de tu próxima inspección
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-brand-slate-200/90">
              Contanos qué necesitás y nuestro equipo te va a responder a la
              brevedad para coordinar los próximos pasos.
            </p>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-brand-navy-900">
              Información de contacto
            </h2>
            {/* TODO(BMC): reemplazar con los datos de contacto reales antes de publicar */}
            <div className="flex flex-col gap-5">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy-900/5 text-brand-navy-900">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-brand-navy-900">{item.label}</p>
                    <p className="text-sm text-brand-slate-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
