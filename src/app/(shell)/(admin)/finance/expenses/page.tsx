import type { Metadata } from "next";
import ExpenseStatusForm, { STATUS_LABELS } from "@/components/finance/expense-status-form";
import { WalletIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import type { AdminUser, Expense, ExpenseStatus, Inspection } from "@/lib/supabase/types";

const expenseStatusStyles: Record<ExpenseStatus, string> = {
  submitted: "bg-blue-50 text-blue-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  reimbursed: "bg-brand-teal-50 text-brand-teal-700",
};

export const metadata: Metadata = {
  title: "Gastos — Finance — Blueseas OS",
  description: "Revisá y actualizá el estado de los gastos.",
};

export default async function FinanceExpensesPage() {
  const supabase = await createClient();

  const [{ data: expenses }, { data: inspections }, { data: usersData }] = await Promise.all([
    supabase.from("expenses").select("*").order("submitted_at", { ascending: false }).returns<Expense[]>(),
    supabase.from("inspections").select("id, title").returns<Pick<Inspection, "id" | "title">[]>(),
    supabase.rpc("admin_list_users"),
  ]);

  const users = (usersData ?? []) as unknown as AdminUser[];
  const inspectionTitles = new Map((inspections ?? []).map((i) => [i.id, i.title]));
  const userLabel = new Map(users.map((u) => [u.id, u.full_name || u.email]));

  const expensesWithUrls = await Promise.all(
    (expenses ?? []).map(async (expense) => {
      if (!expense.file_path) return { ...expense, url: null as string | null };
      const { data: signed } = await supabase.storage.from("expenses").createSignedUrl(expense.file_path, 60 * 60);
      return { ...expense, url: signed?.signedUrl ?? null };
    })
  );

  const dateFormatter = new Intl.DateTimeFormat("es-AR", { year: "numeric", month: "short", day: "numeric" });
  const currencyFormat = (amount: number, currency: string) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(amount);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy-900">Gastos</h1>
        <p className="mt-1 text-sm text-brand-slate-600">Revisá los gastos enviados por los inspectores.</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy-900">Todos los gastos</h2>

        <div className="mt-4 space-y-3">
          {expensesWithUrls.length === 0 ? (
            <p className="rounded-lg border border-dashed border-brand-slate-300 bg-white px-6 py-10 text-center text-sm text-brand-slate-500">
              Todavía no se enviaron gastos.
            </p>
          ) : (
            expensesWithUrls.map((expense) => (
              <div key={expense.id} className="rounded-lg border border-brand-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <WalletIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-slate-400" />
                    <div>
                      <h3 className="font-semibold text-brand-navy-900">{expense.description}</h3>
                      <p className="mt-1 text-sm text-brand-slate-600">
                        Inspector: {userLabel.get(expense.inspector_id) ?? "—"}
                      </p>
                      <p className="mt-1 text-sm text-brand-slate-600">
                        Inspección: {inspectionTitles.get(expense.inspection_id) ?? "—"}
                      </p>
                      <p className="mt-1 text-sm text-brand-slate-600">
                        Monto: {currencyFormat(expense.amount, expense.currency)}
                      </p>
                      <p className="mt-1 text-xs text-brand-slate-500">
                        Enviado: {dateFormatter.format(new Date(expense.submitted_at))}
                      </p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${expenseStatusStyles[expense.status]}`}>
                    {STATUS_LABELS[expense.status]}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brand-slate-100 pt-4">
                  <ExpenseStatusForm expenseId={expense.id} currentStatus={expense.status} />
                  {expense.url ? (
                    <a
                      href={expense.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-brand-teal-600 hover:text-brand-teal-700"
                    >
                      Ver comprobante
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
