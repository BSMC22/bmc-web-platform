import type { Metadata } from "next";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import ContactForm from "@/components/contact/contact-form";
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon } from "@/components/icons";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";

const infoIcons = [MailIcon, PhoneIcon, MapPinIcon, ClockIcon];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  return {
    title: dict.contact.metadata.title,
    description: dict.contact.metadata.description,
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const contact = dict.contact;

  return (
    <>
      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col gap-6 py-20 sm:py-24">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-teal-300">
              {contact.hero.eyebrow}
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl">
              {contact.hero.title}
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-brand-slate-200/90">
              {contact.hero.description}
            </p>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-brand-navy-900">
              {contact.infoHeading}
            </h2>
            {/* TODO(BMC): reemplazar con los datos de contacto reales antes de publicar */}
            <div className="flex flex-col gap-5">
              {contact.info.map((item, index) => {
                const Icon = infoIcons[index];
                return (
                  <div key={item.label} className="flex items-start gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy-900/5 text-brand-navy-900">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-brand-navy-900">{item.label}</p>
                      <p className="text-sm text-brand-slate-600">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm dict={contact.form} />
          </div>
        </div>
      </Section>
    </>
  );
}
