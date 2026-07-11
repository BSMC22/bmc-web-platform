import type { Metadata } from "next";
import StatCard from "@/components/ui/stat-card";
import {
  TrendingUpIcon,
  ReceiptIcon,
  GlobeIcon,
  ClipboardCheckIcon,
  UsersIcon,
  BriefcaseIcon,
  ZapIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "KPIs — Executive Center — Blueseas OS",
  description: "Indicadores clave de desempeño, por categoría.",
};

const CATEGORIES: {
  key: string;
  title: string;
  Icon: typeof TrendingUpIcon;
  kpis: { label: string; value: string }[];
}[] = [
  {
    key: "executive",
    title: "Executive",
    Icon: BriefcaseIcon,
    kpis: [
      { label: "Revenue Growth", value: "—%" },
      { label: "EBITDA Margin", value: "—%" },
      { label: "Operational Efficiency", value: "—%" },
      { label: "Strategic Goals on Track", value: "—" },
    ],
  },
  {
    key: "financial",
    title: "Financial",
    Icon: ReceiptIcon,
    kpis: [
      { label: "Gross Margin", value: "—%" },
      { label: "Net Margin", value: "—%" },
      { label: "Days Sales Outstanding", value: "—" },
      { label: "Operating Cash Flow", value: "$—" },
    ],
  },
  {
    key: "commercial",
    title: "Commercial",
    Icon: GlobeIcon,
    kpis: [
      { label: "Win Rate", value: "—%" },
      { label: "Sales Pipeline", value: "$—" },
      { label: "Client Retention", value: "—%" },
      { label: "Average Deal Size", value: "$—" },
    ],
  },
  {
    key: "operations",
    title: "Operations",
    Icon: ClipboardCheckIcon,
    kpis: [
      { label: "Jobs Completed On Time", value: "—%" },
      { label: "Average Job Duration", value: "— días" },
      { label: "Report Turnaround", value: "— hs" },
      { label: "Rework Rate", value: "—%" },
    ],
  },
  {
    key: "inspectors",
    title: "Inspectors",
    Icon: UsersIcon,
    kpis: [
      { label: "Active Inspectors", value: "—" },
      { label: "Utilization Rate", value: "—%" },
      { label: "Average Response Time", value: "— hs" },
      { label: "Quality Score", value: "—/10" },
    ],
  },
  {
    key: "clients",
    title: "Clients",
    Icon: BriefcaseIcon,
    kpis: [
      { label: "Active Clients", value: "—" },
      { label: "New Clients (MTD)", value: "—" },
      { label: "Client Satisfaction", value: "—/10" },
      { label: "Repeat Business Rate", value: "—%" },
    ],
  },
  {
    key: "growth",
    title: "Growth",
    Icon: ZapIcon,
    kpis: [
      { label: "YoY Revenue Growth", value: "—%" },
      { label: "New Markets Entered", value: "—" },
      { label: "Headcount Growth", value: "—%" },
      { label: "Fleet/Client Base Growth", value: "—%" },
    ],
  },
];

export default function ExecutiveKpisPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy-900">KPIs</h1>
        <p className="mt-1 text-sm text-brand-slate-600">
          Indicadores clave de desempeño por categoría. Todos los valores son demo por ahora.
        </p>
      </div>

      {CATEGORIES.map(({ key, title, Icon, kpis }) => (
        <section key={key}>
          <div className="mb-3 flex items-center gap-2">
            <Icon className="h-4 w-4 text-brand-teal-600" />
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy-900">{title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <StatCard key={kpi.label} label={kpi.label} value={kpi.value} demo />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
