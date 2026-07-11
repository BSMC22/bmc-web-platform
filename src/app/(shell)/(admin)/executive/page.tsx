import type { Metadata } from "next";
import {
  TrendingUpIcon,
  ClipboardCheckIcon,
  CheckCircleIcon,
  ReceiptIcon,
  WalletIcon,
  UsersIcon,
  AlertTriangleIcon,
  GlobeIcon,
  ClockIcon,
} from "@/components/icons";
import StatCard from "@/components/ui/stat-card";
import Panel, { ChartPlaceholder } from "@/components/ui/panel";
import AiBrief from "@/components/executive/ai-brief";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Executive Center — Blueseas OS",
  description: "Executive Command Center de Blueseas Marine Consulting.",
};

export default async function ExecutivePage() {
  const supabase = await createClient();

  // A handful of Executive Summary cards can already pull real numbers from
  // what's built (inspections, invoices); the rest (revenue, profit, cash)
  // have no data source yet and are shown as demo placeholders.
  const [{ count: activeJobs }, { count: completedJobs }, { count: outstandingInvoices }] =
    await Promise.all([
      supabase.from("inspections").select("*", { count: "exact", head: true }).in("status", ["scheduled", "in_progress"]),
      supabase.from("inspections").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("invoices").select("*", { count: "exact", head: true }).eq("status", "submitted"),
    ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy-900">Executive Command Center</h1>
        <p className="mt-1 text-sm text-brand-slate-600">
          Vista consolidada de la operación de Blueseas Marine Consulting.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-navy-900">
          Executive Summary
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Revenue MTD" value="$—" Icon={TrendingUpIcon} demo />
          <StatCard label="Revenue YTD" value="$—" Icon={TrendingUpIcon} demo />
          <StatCard label="Gross Profit" value="$—" Icon={TrendingUpIcon} demo />
          <StatCard label="Net Profit" value="$—" Icon={TrendingUpIcon} demo />
          <StatCard label="Active Jobs" value={activeJobs ?? 0} Icon={ClipboardCheckIcon} href="/operations/inspections" />
          <StatCard label="Completed Jobs" value={completedJobs ?? 0} Icon={CheckCircleIcon} href="/operations/inspections" />
          <StatCard label="Outstanding Invoices" value={outstandingInvoices ?? 0} Icon={ReceiptIcon} href="/finance/invoices" />
          <StatCard label="Cash Position" value="$—" Icon={WalletIcon} demo />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-navy-900">
          Financial Performance
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="Revenue Trend" demo>
            <ChartPlaceholder label="Gráfico próximamente" />
          </Panel>
          <Panel title="Expenses Trend" demo>
            <ChartPlaceholder label="Gráfico próximamente" />
          </Panel>
          <Panel title="Profit Trend" demo>
            <ChartPlaceholder label="Gráfico próximamente" />
          </Panel>
          <Panel title="Cash Flow" demo>
            <ChartPlaceholder label="Gráfico próximamente" />
          </Panel>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-navy-900">
          Operations Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel title="Active Jobs & Pending Reports" demo>
            <ChartPlaceholder label="Gráfico próximamente" />
          </Panel>
          <Panel title="Jobs by Country" demo>
            <ChartPlaceholder label="Mapa próximamente" />
          </Panel>
          <Panel title="Jobs by Status" demo>
            <ChartPlaceholder label="Gráfico próximamente" />
          </Panel>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-navy-900">
          Commercial Performance
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Top Clients" value="—" Icon={GlobeIcon} demo />
          <StatCard label="New Clients" value="—" Icon={UsersIcon} demo />
          <StatCard label="Win Rate" value="—%" Icon={TrendingUpIcon} demo />
          <StatCard label="Average Job Value" value="$—" Icon={TrendingUpIcon} demo />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-navy-900">
          Inspector Network
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active Inspectors" value="—" Icon={UsersIcon} href="/administration/users" />
          <StatCard label="Availability" value="—%" Icon={ClockIcon} demo />
          <StatCard label="Jobs per Inspector" value="—" Icon={ClipboardCheckIcon} demo />
          <StatCard label="Response Time" value="—" Icon={ClockIcon} demo />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-navy-900">Alerts</h2>
        <Panel title="Notificaciones críticas" demo>
          <div className="flex flex-col gap-3 text-sm text-brand-slate-600">
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="h-4 w-4 shrink-0 text-amber-500" />
              Overdue Invoices — próximamente
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="h-4 w-4 shrink-0 text-amber-500" />
              Jobs Waiting Assignment — próximamente
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="h-4 w-4 shrink-0 text-amber-500" />
              Reports Delayed — próximamente
            </div>
          </div>
        </Panel>
      </section>

      <AiBrief />
    </div>
  );
}
