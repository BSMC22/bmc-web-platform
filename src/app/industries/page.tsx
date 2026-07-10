import type { Metadata } from "next";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeading from "@/components/ui/section-heading";
import Button from "@/components/ui/button";
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

export const metadata: Metadata = {
  title: "Industries",
  description:
    "BMC brinda inspección y consultoría técnica a armadores, operadores, charterers, aseguradoras, clubes P&I, astilleros y otros actores de la industria marítima.",
};

const industries = [
  {
    icon: ShipIcon,
    title: "Shipowners & Operators",
    description:
      "Inspecciones y auditorías que acompañan la operación diaria de la flota, reduciendo riesgos y tiempos de parada.",
  },
  {
    icon: BuildingIcon,
    title: "Charterers",
    description:
      "Inspecciones de entrega, redelivery y condición que respaldan decisiones comerciales de fletamento.",
  },
  {
    icon: ShieldCheckIcon,
    title: "P&I Clubs & Insurers",
    description:
      "Surveys técnicos independientes que sustentan evaluaciones de riesgo, siniestros y reclamos.",
  },
  {
    icon: UsersIcon,
    title: "Shipyards",
    description:
      "Auditorías técnicas y de calidad durante procesos de reparación, mantenimiento y construcción.",
  },
  {
    icon: ContainerIcon,
    title: "Cargo Interests",
    description:
      "Inspección de carga y estiba para proteger la integridad de mercancías durante el transporte marítimo.",
  },
  {
    icon: DropletIcon,
    title: "Offshore & Energy",
    description:
      "Consultoría técnica y de inspección para operaciones offshore y proyectos energéticos marítimos.",
  },
  {
    icon: ZapIcon,
    title: "Financial & Legal Advisors",
    description:
      "Informes técnicos objetivos que respaldan procesos de financiamiento, due diligence y disputas legales.",
  },
];

export default function IndustriesPage() {
  return (
    <>
      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col gap-6 py-20 sm:py-24">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-teal-300">
              Industries
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl">
              Un servicio técnico pensado para cada actor de la cadena marítima
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-brand-slate-200/90">
              Trabajamos con distintos segmentos de la industria, adaptando cada
              servicio a sus necesidades comerciales y operativas específicas.
            </p>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <SectionHeading
          eyebrow="A quién servimos"
          title="Segmentos de la industria que acompañamos"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <div
              key={industry.title}
              className="flex flex-col gap-4 rounded-xl border border-brand-slate-200 p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-navy-900 text-brand-teal-400">
                <industry.icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold text-brand-navy-900">
                {industry.title}
              </h3>
              <p className="text-sm leading-relaxed text-brand-slate-600">
                {industry.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col items-start gap-6 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20">
            <h2 className="max-w-xl text-balance text-2xl font-bold sm:text-3xl">
              ¿No ves tu industria en la lista? Igual podemos ayudarte
            </h2>
            <Button href="/contact" variant="secondary" size="lg">
              Hablar con BMC
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
