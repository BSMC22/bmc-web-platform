import type { Metadata } from "next";
import { ClipboardCheckIcon, ReceiptIcon } from "@/components/icons";
import StatCard from "@/components/ui/stat-card";
import Panel from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Client Portal — Blueseas OS",
  description: "Panel del cliente: sus inspecciones y facturas.",
};

export default function ClientDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy-900">Client Portal</h1>
        <p className="mt-1 text-sm text-brand-slate-600">
          Tus inspecciones y facturas con Blueseas Marine Consulting.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Mis inspecciones" value="—" Icon={ClipboardCheckIcon} demo />
        <StatCard label="Mis facturas" value="—" Icon={ReceiptIcon} demo />
      </div>

      <Panel title="Historial de inspecciones" description="Todavía no hay datos vinculados a tu cuenta de cliente." demo>
        <p className="text-sm text-brand-slate-500">Próximamente.</p>
      </Panel>
    </div>
  );
}
