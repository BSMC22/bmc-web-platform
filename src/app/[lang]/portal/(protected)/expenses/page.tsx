import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { createClient } from "@/lib/supabase/server";
import type { Expense, ExpenseStatus, Inspection } from "@/lib/supabase/types";
import ExpenseUploadForm from "@/components/portal/expense-upload-form";
import { WalletIcon } from "@/components/icons";

const expenseStatusStyles: Record<ExpenseStatus, string> = {
  submitted: "bg-blue-50 text-blue-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  reimbursed: "bg-brand-teal-50 text-brand-teal-700",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  return {
    title: dict.portal.expenses.metadata.title,
    description: dict.portal.expenses.metadata.description,
  };
}

export default async function PortalExpensesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.portal.expenses;

  const supabase = await createClient();

  const { data: inspections } = await supabase
    .from("inspections")
    .select("id, title")
    .order("scheduled_date", { ascending: false })
    .returns<Pick<Inspection, "id" | "title">[]>();

  const inspectionTitles = new Map((inspections ?? []).map((i) => [i.id, i.title]));

  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .order("submitted_at", { ascending: false })
    .returns<Expense[]>();

  const expensesWithUrls = await Promise.all(
    (expenses ?? []).map(async (expense) => {
      if (!expense.file_path) return { ...expense, url: null as string | null };
      const { data: signed } = await supabase.storage
        .from("expenses")
        .createSignedUrl(expense.file_path, 60 * 60);
      return { ...expense, url: signed?.signedUrl ?? null };
    })
  );

  const dateFormatter = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const currencyFormat = (amount: number, currency: string) =>
    new Intl.NumberFormat(lang === "es" ? "es-AR" : "en-US", { style: "currency", currency }).format(
      amount
    );

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy-900">{t.title}</h1>
      <p className="mt-2 text-sm text-brand-slate-600">{t.subtitle}</p>

      <div className="mt-6 rounded-xl border border-brand-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy-900">{t.form.heading}</h2>
        <div className="mt-4">
          <ExpenseUploadForm inspections={inspections ?? []} dict={t.form} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-brand-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy-900">{t.listHeading}</h2>
        <ul className="mt-4 divide-y divide-brand-slate-200 border-t border-brand-slate-200">
          {expensesWithUrls.length === 0 ? (
            <li className="py-4 text-sm text-brand-slate-500">{t.empty}</li>
          ) : (
            expensesWithUrls.map((expense) => (
              <li key={expense.id} className="flex items-start gap-3 py-4">
                <WalletIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-brand-navy-900">
                    {expense.description}
                  </p>
                  <p className="mt-0.5 text-sm text-brand-slate-600">
                    {inspectionTitles.get(expense.inspection_id) ?? ""}
                  </p>
                  <p className="mt-0.5 text-xs text-brand-slate-500">
                    {currencyFormat(expense.amount, expense.currency)}
                    {expense.incurred_on ? ` · ${dateFormatter.format(new Date(expense.incurred_on))}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${expenseStatusStyles[expense.status]}`}
                >
                  {t.status[expense.status]}
                </span>
                {expense.url ? (
                  <a
                    href={expense.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-sm font-medium text-brand-teal-600 hover:text-brand-teal-700"
                  >
                    {t.viewReceipt}
                  </a>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
