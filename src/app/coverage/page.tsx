import type { Metadata } from "next";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeading from "@/components/ui/section-heading";
import Button from "@/components/ui/button";
import {
  GlobeIcon,
  ClockIcon,
  UsersIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  MapPinIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Global Coverage",
  description:
    "Red de inspectores de Blueseas Marine Consulting (BMC) con cobertura en los principales puertos del mundo y capacidad de respuesta rápida.",
};

const regions = [
  { title: "Américas", description: "Cobertura en puertos de América del Norte, Central y del Sur." },
  { title: "Europa", description: "Red de inspectores en los principales puertos europeos y del Mediterráneo." },
  { title: "África", description: "Presencia en puntos clave de la costa africana." },
  { title: "Medio Oriente", description: "Cobertura en rutas y puertos estratégicos de la región." },
  { title: "Asia-Pacífico", description: "Red de inspectores en los principales hubs marítimos de Asia y Oceanía." },
];

const highlights = [
  {
    icon: GlobeIcon,
    title: "Red Global de Inspectores",
    description: "Profesionales calificados disponibles en los principales puertos del mundo.",
  },
  {
    icon: ClockIcon,
    title: "Coordinación Ágil",
    description: "Asignación rápida de inspectores para minimizar demoras operativas.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Criterio Técnico Uniforme",
    description: "Mismos estándares de calidad y reporte, sin importar la ubicación.",
  },
  {
    icon: UsersIcon,
    title: "Equipo Local, Estándar Global",
    description: "Conocimiento del contexto local combinado con procesos técnicos consistentes.",
  },
];

export default function CoveragePage() {
  return (
    <>
      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col gap-6 py-20 sm:py-24">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-teal-300">
              Global Coverage
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl">
              Presencia mundial, respuesta local
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-brand-slate-200/90">
              Coordinamos inspecciones y auditorías técnicas en los principales
              puertos del mundo, con inspectores preparados para responder donde
              la operación lo requiera.
            </p>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <SectionHeading
          eyebrow="Nuestra Red"
          title="Cobertura por región"
          description="Trabajamos con una red de inspectores distribuida estratégicamente para responder con rapidez en cualquier parte del mundo."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {regions.map((region) => (
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
          eyebrow="Por qué importa"
          title="Cobertura global con criterio técnico consistente"
          description="No se trata solo de estar presentes en más lugares, sino de mantener el mismo nivel de exigencia en cada inspección, sin importar dónde se realice."
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <div key={item.title} className="flex flex-col gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-brand-teal-500 shadow-sm">
                <item.icon className="h-5 w-5" />
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
              ¿Necesitás un inspector en un puerto específico?
            </h2>
            <Button href="/contact" variant="secondary" size="lg">
              Consultar Disponibilidad
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
