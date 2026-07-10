import type { Metadata } from "next";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeading from "@/components/ui/section-heading";
import Button from "@/components/ui/button";
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

export const metadata: Metadata = {
  title: "Services",
  description:
    "Inspecciones marinas, auditorías técnicas, condition surveys, vetting y consultoría técnica para la industria marítima con cobertura global.",
};

const serviceList = [
  {
    icon: ClipboardCheckIcon,
    title: "Marine Inspections",
    description:
      "Inspecciones a bordo de buques, cargas y equipos, cubriendo desde inspecciones de rutina hasta requerimientos específicos de clientes y aseguradoras.",
    points: [
      "Inspecciones de entrega y redelivery",
      "Inspecciones de carga y estiba",
      "Inspecciones de equipos y maquinaria",
    ],
  },
  {
    icon: FileTextIcon,
    title: "Technical Audits",
    description:
      "Auditorías técnicas y de gestión que evalúan el cumplimiento operativo, documental y regulatorio de la operación.",
    points: [
      "Auditorías de gestión de la seguridad",
      "Auditorías de cumplimiento normativo",
      "Revisión de procedimientos operativos",
    ],
  },
  {
    icon: ShipIcon,
    title: "Condition & Pre-Purchase Surveys",
    description:
      "Relevamiento del estado real de una embarcación para decisiones de compra, venta, financiamiento o aseguramiento.",
    points: [
      "Surveys de condición general",
      "Inspecciones pre-compra",
      "Evaluación de casco, máquinas y equipos",
    ],
  },
  {
    icon: ShieldCheckIcon,
    title: "Vetting Support",
    description:
      "Acompañamiento técnico en procesos de vetting para operadores, charterers y terminales, alineado a estándares del sector.",
    points: [
      "Preparación previa a inspecciones de vetting",
      "Revisión documental",
      "Seguimiento de observaciones y cierre de hallazgos",
    ],
  },
  {
    icon: LifeBuoyIcon,
    title: "Technical Consultancy",
    description:
      "Asesoramiento especializado para armadores, operadores, aseguradoras y clubes P&I en asuntos técnicos y operativos.",
    points: [
      "Asesoría técnica especializada",
      "Soporte en reclamos y disputas técnicas",
      "Evaluación de riesgo operativo",
    ],
  },
  {
    icon: ClockIcon,
    title: "Respuesta a Incidentes",
    description:
      "Coordinación de inspección técnica rápida ante incidentes, averías o eventos que requieren evaluación inmediata.",
    points: [
      "Evaluación de daños",
      "Coordinación con puertos y autoridades",
      "Informes preliminares y finales",
    ],
  },
];

const process = [
  { title: "Solicitud", description: "Nos contás qué necesitás y dónde." },
  { title: "Asignación", description: "Coordinamos el inspector adecuado para el lugar y el trabajo." },
  { title: "Ejecución", description: "Realizamos la inspección o auditoría con estándares técnicos rigurosos." },
  { title: "Reporte", description: "Entregamos un informe claro con hallazgos y recomendaciones." },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-brand-navy-950 text-white">
        <Container>
          <div className="flex flex-col gap-6 py-20 sm:py-24">
            <span className="text-sm font-semibold uppercase tracking-widest text-brand-teal-300">
              Services
            </span>
            <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight sm:text-5xl">
              Servicios técnicos para operar con seguridad y cumplimiento
            </h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-brand-slate-200/90">
              Cubrimos todo el ciclo de necesidades técnicas de la operación
              marítima, desde inspecciones puntuales hasta programas de auditoría
              continuos.
            </p>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {serviceList.map((service) => (
            <div
              key={service.title}
              className="flex flex-col gap-4 rounded-xl border border-brand-slate-200 p-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy-900 text-brand-teal-400">
                <service.icon className="h-6 w-6" />
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
          ))}
        </div>
      </Section>

      <Section tone="slate">
        <SectionHeading
          eyebrow="Cómo Trabajamos"
          title="Un proceso simple, de punta a punta"
          description="Coordinamos cada solicitud con previsibilidad, desde el primer contacto hasta el informe final."
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((item, index) => (
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
              Contanos qué servicio necesitás y coordinamos la inspección
            </h2>
            <Button href="/contact" variant="secondary" size="lg">
              Solicitar Inspección
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
