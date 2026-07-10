import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeading from "@/components/ui/section-heading";
import Button from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { localizedPath } from "@/lib/navigation";
import {
  AnchorIcon,
  ShieldCheckIcon,
  GlobeIcon,
  ClockIcon,
  ClipboardCheckIcon,
  FileTextIcon,
  ShipIcon,
  LifeBuoyIcon,
  UsersIcon,
  BuildingIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@/components/icons";

const trustBadgeIcons = [GlobeIcon, ClockIcon, ShieldCheckIcon, CheckCircleIcon];
const serviceIcons = [ClipboardCheckIcon, FileTextIcon, ShipIcon, LifeBuoyIcon];
const valueIcons = [ShieldCheckIcon, GlobeIcon, ClockIcon, CheckCircleIcon];
const industryIcons = [ShipIcon, BuildingIcon, ShieldCheckIcon, UsersIcon];

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const home = dict.home;

  return (
    <>
      <section className="relative overflow-hidden bg-brand-navy-950 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(45,212,191,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(31,77,128,0.4), transparent 45%)",
          }}
        />
        <Container className="relative">
          <div className="flex flex-col gap-8 py-24 sm:py-28 lg:py-32">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-teal-300">
              <AnchorIcon className="h-4 w-4" />
              {home.hero.badge}
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              {home.hero.title}
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-brand-slate-200/90">
              {home.hero.subtitle}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button href={localizedPath(lang, "/contact")} size="lg">
                {home.hero.ctaPrimary}
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
              <Button href={localizedPath(lang, "/services")} variant="outline" size="lg">
                {home.hero.ctaSecondary}
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {home.trustBadges.map((label, index) => {
                const Icon = trustBadgeIcons[index];
                return (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-brand-teal-400" />
                    <span className="text-sm font-medium text-brand-slate-100">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <SectionHeading
          eyebrow={home.services.eyebrow}
          title={home.services.title}
          description={home.services.description}
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {home.services.items.map((service, index) => {
            const Icon = serviceIcons[index];
            return (
              <div
                key={service.title}
                className="flex flex-col gap-4 rounded-xl border border-brand-slate-200 p-6 transition-shadow hover:shadow-lg"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-navy-900/5 text-brand-navy-900">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold text-brand-navy-900">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-slate-600">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-10">
          <Link
            href={localizedPath(lang, "/services")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy-900 hover:text-brand-teal-500"
          >
            {home.services.viewAll}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section tone="slate">
        <SectionHeading
          eyebrow={home.values.eyebrow}
          title={home.values.title}
          description={home.values.description}
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {home.values.items.map((value, index) => {
            const Icon = valueIcons[index];
            return (
              <div key={value.title} className="flex flex-col gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-brand-teal-500 shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold text-brand-navy-900">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-slate-600">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="white">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow={home.industries.eyebrow}
              title={home.industries.title}
              description={home.industries.description}
            />
            <div className="mt-8">
              <Button href={localizedPath(lang, "/industries")} variant="ghost" size="sm">
                {home.industries.viewAll}
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {home.industries.items.map((industry, index) => {
              const Icon = industryIcons[index];
              return (
                <div
                  key={industry.title}
                  className="flex flex-col items-start gap-3 rounded-xl border border-brand-slate-200 p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-navy-900 text-brand-teal-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-brand-navy-900">
                    {industry.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col items-start gap-8 py-20 sm:py-24 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-widest text-brand-teal-300">
                {home.coverage.eyebrow}
              </span>
              <h2 className="mt-3 text-balance text-3xl font-bold sm:text-4xl">
                {home.coverage.title}
              </h2>
              <p className="mt-4 text-balance text-base leading-relaxed text-brand-slate-200/90 sm:text-lg">
                {home.coverage.description}
              </p>
            </div>
            <Button href={localizedPath(lang, "/coverage")} variant="secondary" size="lg">
              {home.coverage.cta}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-brand-slate-100 px-6 py-16 text-center sm:px-16">
          <h2 className="text-balance text-3xl font-bold text-brand-navy-900 sm:text-4xl">
            {home.finalCta.title}
          </h2>
          <p className="max-w-2xl text-balance text-base leading-relaxed text-brand-slate-600 sm:text-lg">
            {home.finalCta.description}
          </p>
          <Button href={localizedPath(lang, "/contact")} size="lg">
            {home.finalCta.button}
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </Section>
    </>
  );
}
