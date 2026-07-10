import type { Metadata } from "next";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeading from "@/components/ui/section-heading";
import Button from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { localizedPath } from "@/lib/navigation";
import {
  ClipboardCheckIcon,
  FileTextIcon,
  ShipIcon,
  LifeBuoyIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@/components/icons";

const serviceIcons = [
  ClipboardCheckIcon,
  FileTextIcon,
  ShipIcon,
  ShieldCheckIcon,
  LifeBuoyIcon,
  ClockIcon,
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  return {
    title: dict.services.metadata.title,
    description: dict.services.metadata.description,
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const services = dict.services;

  return (
    <>
      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col gap-6 py-20 sm:py-24">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-teal-300">
              {services.hero.eyebrow}
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl">
              {services.hero.title}
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-brand-slate-200/90">
              {services.hero.description}
            </p>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {services.list.map((service, index) => {
            const Icon = serviceIcons[index];
            return (
              <div
                key={service.title}
                className="flex flex-col gap-4 rounded-xl border border-brand-slate-200 p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy-900 text-brand-teal-400">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-semibold text-brand-navy-900">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-slate-600">
                  {service.description}
                </p>
                <ul className="mt-2 flex flex-col gap-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-brand-slate-600">
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="slate">
        <SectionHeading
          eyebrow={services.process.eyebrow}
          title={services.process.title}
          description={services.process.description}
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.process.items.map((item, index) => (
            <div key={item.title} className="flex flex-col gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy-900 text-sm font-bold text-brand-teal-400">
                {index + 1}
              </span>
              <h3 className="text-base font-semibold text-brand-navy-900">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col items-start gap-6 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20">
            <h2 className="max-w-xl text-balance text-2xl font-bold sm:text-3xl">
              {services.cta.title}
            </h2>
            <Button href={localizedPath(lang, "/contact")} variant="secondary" size="lg">
              {services.cta.button}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
