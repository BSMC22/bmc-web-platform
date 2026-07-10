import type { Metadata } from "next";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeading from "@/components/ui/section-heading";
import Button from "@/components/ui/button";
import {
  ShieldCheckIcon,
  GlobeIcon,
  ClockIcon,
  CheckCircleIcon,
  ClipboardCheckIcon,
  UsersIcon,
  ArrowRightIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Conocé a Blueseas Marine Consulting (BMC): nuestra misión, valores y el enfoque técnico que aplicamos en cada inspección y auditoría.",
};

const values = [
  { icon: ShieldCheckIcon, title: "Profesionalismo" },
  { icon: CheckCircleIcon, title: "Confianza" },
  { icon: ClipboardCheckIcon, title: "Excelencia Técnica" },
  { icon: ClockIcon, title: "Rapidez de Respuesta" },
  { icon: GlobeIcon, title: "Cobertura Global" },
  { icon: UsersIcon, title: "Innovación" },
];

const approach = [
  {
    step: "01",
    title: "Entendemos tu operación",
    description:
      "Relevamos el contexto, el tipo de buque o activo y el objetivo de la inspección o auditoría antes de coordinar el trabajo.",
  },
  {
    step: "02",
    title: "Coordinamos en el lugar correcto",
    description:
      "Asignamos inspectores calificados en el puerto o ubicación requerida, minimizando demoras operativas.",
  },
  {
    step: "03",
    title: "Ejecutamos con rigor técnico",
    description:
      "Aplicamos estándares internacionales de la industria en cada inspección, auditoría o survey.",
  },
  {
    step: "04",
    title: "Entregamos reportes claros",
    description:
      "Documentación precisa y accionable, pensada para respaldar decisiones comerciales y operativas.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col gap-6 py-20 sm:py-24">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-teal-300">
              About Us
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl">
              Experiencia técnica marítima con estándares internacionales
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-brand-slate-200/90">
              Blueseas Marine Consulting (BMC) nace para ofrecer inspecciones,
              auditorías y consultoría técnica confiable a la industria marítima,
              con la misma exigencia que caracteriza a los líderes del sector.
            </p>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Misión"
            title="Ser el socio técnico confiable de la industria marítima"
            description="Brindar inspecciones, auditorías y consultoría técnica de alta precisión, que permitan a nuestros clientes operar con seguridad, cumplimiento y confianza en cualquier parte del mundo."
          />
          <SectionHeading
            eyebrow="Visión"
            title="Ser referentes en inspección y consultoría marítima a nivel global"
            description="Construir una plataforma de servicios que evolucione junto a la industria, incorporando tecnología y digitalización sin perder el criterio técnico que define a BMC."
          />
        </div>
      </Section>

      <Section tone="slate">
        <SectionHeading
          eyebrow="Nuestros Valores"
          title="Lo que nos define en cada trabajo"
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex flex-col items-center gap-3 rounded-xl bg-white p-5 text-center shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-navy-900/5 text-brand-navy-900">
                <value.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-brand-navy-900">
                {value.title}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="Nuestro Enfoque"
          title="Cómo trabajamos en cada inspección"
          description="Un proceso claro y repetible, diseñado para dar previsibilidad a nuestros clientes de principio a fin."
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {approach.map((item) => (
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
              ¿Querés conocer más sobre cómo trabajamos?
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
