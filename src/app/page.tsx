import Link from "next/link";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeading from "@/components/ui/section-heading";
import Button from "@/components/ui/button";
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

const trustBadges = [
  { icon: GlobeIcon, label: "Cobertura Global" },
  { icon: ClockIcon, label: "Respuesta Rápida" },
  { icon: ShieldCheckIcon, label: "Inspectores Calificados" },
  { icon: CheckCircleIcon, label: "Excelencia Técnica" },
];

const services = [
  {
    icon: ClipboardCheckIcon,
    title: "Marine Inspections",
    description:
      "Inspecciones a bordo de buques y equipos, alineadas con estándares internacionales de la industria.",
  },
  {
    icon: FileTextIcon,
    title: "Technical Audits",
    description:
      "Auditorías técnicas y de gestión para verificar el cumplimiento operativo y regulatorio.",
  },
  {
    icon: ShipIcon,
    title: "Condition Surveys",
    description:
      "Relevamientos de condición y pre-compra para evaluar el estado real de una embarcación.",
  },
  {
    icon: LifeBuoyIcon,
    title: "Consultoría Técnica",
    description:
      "Asesoramiento especializado para operadores, aseguradoras y clubes de protección e indemnización.",
  },
];

const values = [
  {
    icon: ShieldCheckIcon,
    title: "Excelencia Técnica",
    description: "Estándares rigurosos en cada inspección y reporte que entregamos.",
  },
  {
    icon: GlobeIcon,
    title: "Cobertura Global",
    description: "Red de inspectores preparada para responder en los principales puertos del mundo.",
  },
  {
    icon: ClockIcon,
    title: "Rapidez de Respuesta",
    description: "Coordinación ágil para minimizar tiempos de espera y demoras operativas.",
  },
  {
    icon: CheckCircleIcon,
    title: "Confianza y Transparencia",
    description: "Reportes claros y objetivos que respaldan decisiones comerciales seguras.",
  },
];

const industries = [
  { icon: ShipIcon, title: "Shipowners & Operators" },
  { icon: BuildingIcon, title: "Charterers" },
  { icon: ShieldCheckIcon, title: "P&I Clubs & Insurers" },
  { icon: UsersIcon, title: "Shipyards" },
];

export default function Home() {
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
              Blueseas Marine Consulting
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Inspección Marina, Auditorías y Consultoría Técnica a Nivel Mundial
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-brand-slate-200/90">
              Acompañamos a armadores, operadores, aseguradoras y clubes P&amp;I con
              inspecciones confiables, auditorías técnicas rigurosas y respuesta rápida
              en cualquier puerto del mundo.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button href="/contact" size="lg">
                Solicitar Inspección
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
              <Button href="/services" variant="outline" size="lg">
                Conocer Servicios
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-4 py-3"
                >
                  <badge.icon className="h-5 w-5 shrink-0 text-brand-teal-400" />
                  <span className="text-sm font-medium text-brand-slate-100">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <SectionHeading
          eyebrow="Servicios"
          title="Soluciones técnicas para cada etapa de la operación"
          description="Desde inspecciones puntuales hasta programas de auditoría continuos, adaptamos cada servicio a las necesidades de tu flota u operación."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col gap-4 rounded-xl border border-brand-slate-200 p-6 transition-shadow hover:shadow-lg"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-navy-900/5 text-brand-navy-900">
                <service.icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-brand-navy-900">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-slate-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy-900 hover:text-brand-teal-500"
          >
            Ver todos los servicios
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section tone="slate">
        <SectionHeading
          eyebrow="Por qué BMC"
          title="Los valores que guían cada inspección"
          description="La misma exigencia técnica y profesionalismo de los líderes del sector marítimo, con una identidad propia y moderna."
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div key={value.title} className="flex flex-col gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-brand-teal-500 shadow-sm">
                <value.icon className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold text-brand-navy-900">
                {value.title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-slate-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Industrias"
              title="Trabajamos junto a los actores clave de la industria marítima"
              description="Nuestros servicios están diseñados para responder a las necesidades específicas de cada segmento de la cadena marítima."
            />
            <div className="mt-8">
              <Button href="/industries" variant="ghost" size="sm">
                Ver todas las industrias
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {industries.map((industry) => (
              <div
                key={industry.title}
                className="flex flex-col items-start gap-3 rounded-xl border border-brand-slate-200 p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-navy-900 text-brand-teal-400">
                  <industry.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-brand-navy-900">
                  {industry.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col items-start gap-8 py-20 sm:py-24 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-widest text-brand-teal-300">
                Cobertura Global
              </span>
              <h2 className="mt-3 text-balance text-3xl font-bold sm:text-4xl">
                Una red de inspectores lista para responder donde estés
              </h2>
              <p className="mt-4 text-balance text-base leading-relaxed text-brand-slate-200/90 sm:text-lg">
                Coordinamos inspecciones y auditorías en los principales puertos del
                mundo, con tiempos de respuesta pensados para no interrumpir tu
                operación.
              </p>
            </div>
            <Button href="/coverage" variant="secondary" size="lg">
              Ver cobertura mundial
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-brand-slate-100 px-6 py-16 text-center sm:px-16">
          <h2 className="text-balance text-3xl font-bold text-brand-navy-900 sm:text-4xl">
            ¿Necesitás una inspección o auditoría técnica?
          </h2>
          <p className="max-w-2xl text-balance text-base leading-relaxed text-brand-slate-600 sm:text-lg">
            Contanos qué necesitás y coordinamos con nuestro equipo la mejor solución
            para tu operación, donde estés.
          </p>
          <Button href="/contact" size="lg">
            Contactar a BMC
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </Section>
    </>
  );
}
