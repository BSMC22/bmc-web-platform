import type { Metadata } from "next";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeading from "@/components/ui/section-heading";
import Button from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { localizedPath } from "@/lib/navigation";
import {
  ShipIcon,
  BuildingIcon,
  ShieldCheckIcon,
  UsersIcon,
  ContainerIcon,
  DropletIcon,
  ZapIcon,
  ArrowRightIcon,
} from "@/components/icons";

const industryIcons = [
  ShipIcon,
  BuildingIcon,
  ShieldCheckIcon,
  UsersIcon,
  ContainerIcon,
  DropletIcon,
  ZapIcon,
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
    title: dict.industries.metadata.title,
    description: dict.industries.metadata.description,
  };
}

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const industries = dict.industries;

  return (
    <>
      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col gap-6 py-20 sm:py-24">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-teal-300">
              {industries.hero.eyebrow}
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl">
              {industries.hero.title}
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-brand-slate-200/90">
              {industries.hero.description}
            </p>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <SectionHeading
          eyebrow={industries.section.eyebrow}
          title={industries.section.title}
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.items.map((industry, index) => {
            const Icon = industryIcons[index];
            return (
              <div
                key={industry.title}
                className="flex flex-col gap-4 rounded-xl border border-brand-slate-200 p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-navy-900 text-brand-teal-400">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-brand-navy-900">
                  {industry.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-slate-600">
                  {industry.description}
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
              {industries.cta.title}
            </h2>
            <Button href={localizedPath(lang, "/contact")} variant="secondary" size="lg">
              {industries.cta.button}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
