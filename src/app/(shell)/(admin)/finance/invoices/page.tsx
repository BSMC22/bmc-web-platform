import type { Metadata } from "next";
import InvoiceStatusForm, { STATUS_LABELS } from "@/components/finance/invoice-status-form";
import { FileTextIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import type { AdminUser, Inspection, Invoice, InvoiceStatus } from "@/lib/supabase/types";

const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  submitted: "bg-blue-50 text-blue-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  paid: "bg-brand-teal-50 text-brand-teal-700",
};

export const metadata: Metadata = {
  title: "Facturas — Finance — Blueseas OS",
  description: "Revisá y actualizá el estado de las facturas.",
};

export default async function FinanceInvoicesPage() {
  const supabase = await createClient();

  const [{ data: invoices }, { data: inspections }, { data: usersData }] = await Promise.all([
    supabase.from("invoices").select("*").order("submitted_at", { ascending: false }).returns<Invoice[]>(),
    supabase.from("inspections").select("id, title").returns<Pick<Inspection, "id" | "title">[]>(),
    supabase.rpc("admin_list_users"),
  ]);

  const users = (usersData ?? []) as unknown as AdminUser[];
  const inspectionTitles = new Map((inspections ?? []).map((i) => [i.id, i.title]));
  const userLabel = new Map(users.map((u) => [u.id, u.full_name || u.email]));

  const invoicesWithUrls = await Promise.all(
    (invoices ?? []).map(async (invoice) => {
      const { data: signed } = await supabase.storage
        .from("invoices")
        .createSignedUrl(invoice.file_path, 60 * 60);
      return { ...invoice, url: signed?.signedUrl ?? null };
    })
  );

  const dateFormatter = new Intl.DateTimeFormat("es-AR", { year: "numeric", month: "short", day: "numeric" });
  const currencyFormat = (amount: number, currency: string) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(amount);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy-900">Facturas</h1>
        <p className="mt-1 text-sm text-brand-slate-600">Revisá las facturas enviadas por los inspectores.</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy-900">
          Todas las facturas
        </h2>

        <div className="mt-4 space-y-3">
          {invoicesWithUrls.length === 0 ? (
            <p className="rounded-lg border border-dashed border-brand-slate-300 bg-white px-6 py-10 text-center text-sm text-brand-slate-500">
              Todavía no se enviaron facturas.
            </p>
          ) : (
            invoicesWithUrls.map((invoice) => (
              <div key={invoice.id} className="rounded-lg border border-brand-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <FileTextIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-slate-400" />
                    <div>
                      <h3 className="font-semibold text-brand-navy-900">
                        {inspectionTitles.get(invoice.inspection_id) ?? invoice.file_name}
                      </h3>
                      <p className="mt-1 text-sm text-brand-slate-600">
                        Inspector: {userLabel.get(invoice.inspector_id) ?? "—"}
                      </p>
                      <p className="mt-1 text-sm text-brand-slate-600">
                        Monto: {currencyFormat(invoice.amount, invoice.currency)}
                      </p>
                      <p className="mt-1 text-xs text-brand-slate-500">
                        Enviada: {dateFormatter.format(new Date(invoice.submitted_at))}
                      </p>
                      {invoice.notes ? <p className="mt-1 text-xs text-brand-slate-500">{invoice.notes}</p> : null}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${invoiceStatusStyles[invoice.status]}`}>
                    {STATUS_LABELS[invoice.status]}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brand-slate-100 pt-4">
                  <InvoiceStatusForm invoiceId={invoice.id} currentStatus={invoice.status} />
                  {invoice.url ? (
                    <a
                      href={invoice.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-brand-teal-600 hover:text-brand-teal-700"
                    >
                      Ver archivo
                    </a>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
