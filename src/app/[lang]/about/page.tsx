import type { Metadata } from "next";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeading from "@/components/ui/section-heading";
import Button from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { localizedPath } from "@/lib/navigation";
import {
  ShieldCheckIcon,
  GlobeIcon,
  ClockIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  UsersIcon,
  ArrowRightIcon,
} from "@/components/icons";

const valueIcons = [ShieldCheckIcon, CheckCircleIcon, ClipboardCheckIcon, ClockIcon, GlobeIcon, UsersIcon];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  return {
    title: dict.about.metadata.title,
    description: dict.about.metadata.description,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const about = dict.about;

  return (
    <>
      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col gap-6 py-20 sm:py-24">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-teal-300">
              {about.hero.eyebrow}
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl">
              {about.hero.title}
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-brand-slate-200/90">
              {about.hero.description}
            </p>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow={about.mission.eyebrow}
            title={about.mission.title}
            description={about.mission.description}
          />
          <SectionHeading
            eyebrow={about.vision.eyebrow}
            title={about.vision.title}
            description={about.vision.description}
          />
        </div>
      </Section>

      <Section tone="slate">
        <SectionHeading
          eyebrow={about.valuesHeading.eyebrow}
          title={about.valuesHeading.title}
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {about.values.map((value, index) => {
            const Icon = valueIcons[index];
            return (
              <div
                key={value}
                className="flex flex-col items-center gap-3 rounded-xl bg-white p-5 text-center shadow-sm"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-navy-900/5 text-brand-navy-900">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-brand-navy-900">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow={about.approach.eyebrow}
          title={about.approach.title}
          description={about.approach.description}
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {about.approach.items.map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <span className="text-3xl font-bold text-brand-teal-500">
                {item.step}
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
              {about.cta.title}
            </h2>
            <Button href={localizedPath(lang, "/contact")} variant="secondary" size="lg">
              {about.cta.button}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
