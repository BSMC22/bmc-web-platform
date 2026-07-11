import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { createClient } from "@/lib/supabase/server";
import type { Inspection, Invoice, InvoiceStatus, Payment, PaymentStatus } from "@/lib/supabase/types";
import InvoiceUploadForm from "@/components/portal/invoice-upload-form";
import { FileTextIcon } from "@/components/icons";

const invoiceStatusStyles: Record<InvoiceStatus, string> = {
  submitted: "bg-blue-50 text-blue-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-700",
  paid: "bg-brand-teal-50 text-brand-teal-700",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  pending: "bg-brand-slate-100 text-brand-slate-700",
  processing: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
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
    title: dict.portal.invoices.metadata.title,
    description: dict.portal.invoices.metadata.description,
  };
}

export default async function PortalInvoicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.portal.invoices;

  const supabase = await createClient();

  const { data: inspections } = await supabase
    .from("inspections")
    .select("id, title")
    .order("scheduled_date", { ascending: false })
    .returns<Pick<Inspection, "id" | "title">[]>();

  const inspectionTitles = new Map((inspections ?? []).map((i) => [i.id, i.title]));

  const { data: invoices } = await supabase
    .from("invoices")
    .select("*")
    .order("submitted_at", { ascending: false })
    .returns<Invoice[]>();

  const invoicesWithUrls = await Promise.all(
    (invoices ?? []).map(async (invoice) => {
      const { data: signed } = await supabase.storage
        .from("invoices")
        .createSignedUrl(invoice.file_path, 60 * 60);
      return { ...invoice, url: signed?.signedUrl ?? null };
    })
  );

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Payment[]>();

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
          <InvoiceUploadForm inspections={inspections ?? []} dict={t.form} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-brand-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy-900">{t.listHeading}</h2>
        <ul className="mt-4 divide-y divide-brand-slate-200 border-t border-brand-slate-200">
          {invoicesWithUrls.length === 0 ? (
            <li className="py-4 text-sm text-brand-slate-500">{t.empty}</li>
          ) : (
            invoicesWithUrls.map((invoice) => (
              <li key={invoice.id} className="flex items-start gap-3 py-4">
                <FileTextIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-brand-navy-900">
                    {inspectionTitles.get(invoice.inspection_id) ?? invoice.file_name}
                  </p>
                  <p className="mt-0.5 text-sm text-brand-slate-600">
                    {currencyFormat(invoice.amount, invoice.currency)} ·{" "}
                    {dateFormatter.format(new Date(invoice.submitted_at))}
                  </p>
                  {invoice.notes ? (
                    <p className="mt-0.5 text-xs text-brand-slate-500">{invoice.notes}</p>
                  ) : null}
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${invoiceStatusStyles[invoice.status]}`}
                >
                  {t.status[invoice.status]}
                </span>
                {invoice.url ? (
                  <a
                    href={invoice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-sm font-medium text-brand-teal-600 hover:text-brand-teal-700"
                  >
                    {t.viewFile}
                  </a>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-brand-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy-900">{t.paymentsHeading}</h2>
        <p className="mt-1 text-sm text-brand-slate-600">{t.paymentsDescription}</p>
        <ul className="mt-4 divide-y divide-brand-slate-200 border-t border-brand-slate-200">
          {!payments || payments.length === 0 ? (
            <li className="py-4 text-sm text-brand-slate-500">{t.paymentsEmpty}</li>
          ) : (
            payments.map((payment) => (
              <li key={payment.id} className="flex items-start justify-between gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-brand-navy-900">
                    {inspectionTitles.get(payment.inspection_id) ?? payment.inspection_id}
                  </p>
                  <p className="mt-0.5 text-sm text-brand-slate-600">
                    {currencyFormat(payment.amount, payment.currency)}
                    {payment.paid_at ? ` · ${dateFormatter.format(new Date(payment.paid_at))}` : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${paymentStatusStyles[payment.status]}`}
                >
                  {t.paymentStatus[payment.status]}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
