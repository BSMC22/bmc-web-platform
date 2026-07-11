import type { Metadata } from "next";
import { ReceiptIcon, WalletIcon } from "@/components/icons";
import StatCard from "@/components/ui/stat-card";
import Panel, { ChartPlaceholder } from "@/components/ui/panel";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Finance — Blueseas OS",
  description: "Facturas y gastos pendientes de revisión.",
};

export default async function FinanceDashboardPage() {
  const supabase = await createClient();

  const [{ count: pendingInvoices }, { count: pendingExpenses }] = await Promise.all([
    supabase.from("invoices").select("*", { count: "exact", head: true }).eq("status", "submitted"),
    supabase.from("expenses").select("*", { count: "exact", head: true }).eq("status", "submitted"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy-900">Panel de Finance</h1>
        <p className="mt-1 text-sm text-brand-slate-600">
          Facturas y gastos pendientes de aprobación.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Facturas pendientes" value={pendingInvoices ?? 0} Icon={ReceiptIcon} href="/finance/invoices" />
        <StatCard label="Gastos pendientes" value={pendingExpenses ?? 0} Icon={WalletIcon} href="/finance/expenses" />
        <StatCard label="Cuentas por cobrar" value="—" demo />
        <StatCard label="Cuentas por pagar" value="—" demo />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Pagos" description="Seguimiento de pagos a inspectores y proveedores." demo>
          <ChartPlaceholder label="Próximamente" />
        </Panel>
        <Panel title="Flujo de caja" demo>
          <ChartPlaceholder label="Próximamente" />
        </Panel>
      </div>
    </div>
  );
}
