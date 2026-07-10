import type { Metadata } from "next";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeading from "@/components/ui/section-heading";
import Button from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { localizedPath } from "@/lib/navigation";
import {
  GlobeIcon,
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  MapPinIcon,
} from "@/components/icons";

const highlightIcons = [GlobeIcon, ClockIcon, ShieldCheckIcon, UsersIcon];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  return {
    title: dict.coverage.metadata.title,
    description: dict.coverage.metadata.description,
  };
}

export default async function CoveragePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const coverage = dict.coverage;

  return (
    <>
      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col gap-6 py-20 sm:py-24">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-teal-300">
              {coverage.hero.eyebrow}
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl">
              {coverage.hero.title}
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-brand-slate-200/90">
              {coverage.hero.description}
            </p>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <SectionHeading
          eyebrow={coverage.regions.eyebrow}
          title={coverage.regions.title}
          description={coverage.regions.description}
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {coverage.regions.items.map((region) => (
            <div
              key={region.title}
              className="flex flex-col gap-3 rounded-xl border border-brand-slate-200 p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-navy-900 text-brand-teal-400">
                <MapPinIcon className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold text-brand-navy-900">
                {region.title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-slate-600">
                {region.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="slate">
        <SectionHeading
          eyebrow={coverage.highlights.eyebrow}
          title={coverage.highlights.title}
          description={coverage.highlights.description}
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {coverage.highlights.items.map((item, index) => {
            const Icon = highlightIcons[index];
            return (
              <div key={item.title} className="flex flex-col gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-brand-teal-500 shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-brand-navy-900">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col items-start gap-6 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20">
            <h2 className="max-w-xl text-balance text-2xl font-bold sm:text-3xl">
              {coverage.cta.title}
            </h2>
            <Button href={localizedPath(lang, "/contact")} variant="secondary" size="lg">
              {coverage.cta.button}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
