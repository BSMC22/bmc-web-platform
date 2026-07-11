import type { Metadata } from "next";
import { ClipboardCheckIcon, CheckCircleIcon } from "@/components/icons";
import StatCard from "@/components/ui/stat-card";
import Panel, { ChartPlaceholder } from "@/components/ui/panel";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Operations — Blueseas OS",
  description: "Panel operativo: inspecciones activas y su estado.",
};

export default async function OperationsDashboardPage() {
  const supabase = await createClient();

  const [{ count: activeCount }, { count: completedCount }] = await Promise.all([
    supabase
      .from("inspections")
      .select("*", { count: "exact", head: true })
      .in("status", ["scheduled", "in_progress"]),
    supabase.from("inspections").select("*", { count: "exact", head: true }).eq("status", "completed"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy-900">Panel de Operaciones</h1>
        <p className="mt-1 text-sm text-brand-slate-600">
          Estado actual de las inspecciones en curso.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Inspecciones activas" value={activeCount ?? 0} Icon={ClipboardCheckIcon} href="/operations/inspections" />
        <StatCard label="Inspecciones completadas" value={completedCount ?? 0} Icon={CheckCircleIcon} href="/operations/inspections" />
        <StatCard label="Reportes pendientes" value="—" demo />
        <StatCard label="Inspectores disponibles" value="—" demo />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Trabajos por país" demo>
          <ChartPlaceholder label="Mapa / gráfico próximamente" />
        </Panel>
        <Panel title="Trabajos por estado" demo>
          <ChartPlaceholder label="Gráfico próximamente" />
        </Panel>
      </div>
    </div>
  );
}
