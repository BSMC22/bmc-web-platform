import type { Metadata } from "next";
import { TrendingUpIcon, ClipboardCheckIcon, ReceiptIcon, WalletIcon, LockIcon } from "@/components/icons";
import StatCard from "@/components/ui/stat-card";
import Panel, { ChartPlaceholder } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Shareholder Portal — Blueseas OS",
  description: "Vista de solo lectura para accionistas.",
};

export default function ShareholderDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy-900">Shareholder Portal</h1>
          <p className="mt-1 text-sm text-brand-slate-600">
            Un resumen del desempeño de la empresa, con menor nivel de detalle que Executive Center.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-slate-100 px-3 py-1 text-xs font-medium text-brand-slate-600">
          <LockIcon className="h-3.5 w-3.5" />
          Solo lectura
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue YTD" value="$—" Icon={TrendingUpIcon} demo />
        <StatCard label="Net Profit" value="$—" Icon={TrendingUpIcon} demo />
        <StatCard label="Active Jobs" value="—" Icon={ClipboardCheckIcon} demo />
        <StatCard label="Cash Position" value="$—" Icon={WalletIcon} demo />
      </div>

      <Panel title="Revenue Trend" description="Vista resumida — sin desglose por cliente ni por región." demo>
        <ChartPlaceholder label="Gráfico próximamente" />
      </Panel>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Outstanding Invoices" value="—" Icon={ReceiptIcon} demo />
        <StatCard label="Completed Jobs (YTD)" value="—" Icon={ClipboardCheckIcon} demo />
      </div>
    </div>
  );
}
