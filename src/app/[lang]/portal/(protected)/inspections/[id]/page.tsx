import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { localizedPath } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Inspection, InspectionReport } from "@/lib/supabase/types";
import InspectionStatusForm from "@/components/portal/inspection-status-form";
import ReportUploadForm from "@/components/portal/report-upload-form";
import { ArrowRightIcon, FileTextIcon } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: inspection } = await supabase
    .from("inspections")
    .select("title")
    .eq("id", id)
    .maybeSingle<Pick<Inspection, "title">>();

  return {
    title: inspection?.title ?? "Inspection",
  };
}

export default async function InspectionDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang: rawLang, id } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.portal.inspections;

  const supabase = await createClient();

  const { data: inspection } = await supabase
    .from("inspections")
    .select("*")
    .eq("id", id)
    .maybeSingle<Inspection>();

  if (!inspection) {
    notFound();
  }

  const { data: reports } = await supabase
    .from("inspection_reports")
    .select("*")
    .eq("inspection_id", id)
    .order("uploaded_at", { ascending: false })
    .returns<InspectionReport[]>();

  const reportsWithUrls = await Promise.all(
    (reports ?? []).map(async (report) => {
      const { data: signed } = await supabase.storage
        .from("inspection-reports")
        .createSignedUrl(report.file_path, 60 * 60);
      return { ...report, url: signed?.signedUrl ?? null };
    })
  );

  const dateFormatter = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const dateTimeFormatter = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const detailFields: { label: string; value: string | null }[] = [
    { label: t.table.client, value: inspection.client_name },
    { label: t.detail.vesselLabel, value: inspection.vessel_name },
    { label: t.detail.portLabel, value: inspection.port },
    { label: t.detail.locationLabel, value: inspection.location },
    { label: t.detail.serviceTypeLabel, value: inspection.service_type },
    {
      label: t.table.date,
      value: inspection.scheduled_date ? dateFormatter.format(new Date(inspection.scheduled_date)) : null,
    },
  ];

  return (
    <div>
      <Link
        href={localizedPath(lang, "/portal/inspections")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-slate-600 hover:text-brand-teal-600"
      >
        <span className="rotate-180">
          <ArrowRightIcon className="h-4 w-4" />
        </span>
        {t.detail.back}
      </Link>

      <div className="mt-4 rounded-xl border border-brand-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-brand-navy-900">{inspection.title}</h1>

        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {detailFields
            .filter((field) => field.value)
            .map((field) => (
              <div key={field.label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-brand-slate-500">
                  {field.label}
                </dt>
                <dd className="mt-0.5 text-sm text-brand-navy-900">{field.value}</dd>
              </div>
            ))}
        </dl>

        {inspection.notes ? (
          <div className="mt-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-brand-slate-500">
              {t.detail.notesLabel}
            </dt>
            <dd className="mt-0.5 text-sm text-brand-navy-900">{inspection.notes}</dd>
          </div>
        ) : null}

        <div className="mt-6 border-t border-brand-slate-200 pt-6">
          <InspectionStatusForm inspectionId={inspection.id} currentStatus={inspection.status} dict={t} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-brand-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy-900">{t.detail.reportsHeading}</h2>
        <p className="mt-1 text-sm text-brand-slate-600">{t.detail.reportsDescription}</p>

        <div className="mt-4">
          <ReportUploadForm inspectionId={inspection.id} dict={t.detail} />
        </div>

        <ul className="mt-6 divide-y divide-brand-slate-200 border-t border-brand-slate-200">
          {reportsWithUrls.length === 0 ? (
            <li className="py-4 text-sm text-brand-slate-500">{t.detail.noReports}</li>
          ) : (
            reportsWithUrls.map((report) => (
              <li key={report.id} className="flex items-start gap-3 py-4">
                <FileTextIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-brand-navy-900">{report.file_name}</p>
                  {report.description ? (
                    <p className="mt-0.5 text-sm text-brand-slate-600">{report.description}</p>
                  ) : null}
                  <p className="mt-0.5 text-xs text-brand-slate-500">
                    {t.detail.uploadedOn} {dateTimeFormatter.format(new Date(report.uploaded_at))}
                  </p>
                </div>
                {report.url ? (
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-sm font-medium text-brand-teal-600 hover:text-brand-teal-700"
                  >
                    {t.detail.downloadLink}
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
