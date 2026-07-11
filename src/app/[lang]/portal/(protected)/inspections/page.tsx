import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { localizedPath } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Inspection, InspectionStatus } from "@/lib/supabase/types";

const statusStyles: Record<InspectionStatus, string> = {
  scheduled: "bg-blue-50 text-blue-700",
  in_progress: "bg-amber-50 text-amber-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
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
    title: dict.portal.inspections.metadata.title,
    description: dict.portal.inspections.metadata.description,
  };
}

export default async function PortalInspectionsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.portal.inspections;

  const supabase = await createClient();
  // RLS scopes this to the current inspector's assigned inspections (or all
  // inspections if the user is an admin) — no extra filtering needed here.
  const { data: inspections } = await supabase
    .from("inspections")
    .select("*")
    .order("scheduled_date", { ascending: true })
    .returns<Inspection[]>();

  const dateFormatter = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy-900">{t.title}</h1>
      <p className="mt-2 text-sm text-brand-slate-600">{t.subtitle}</p>

      <div className="mt-6 space-y-3">
        {!inspections || inspections.length === 0 ? (
          <p className="rounded-lg border border-dashed border-brand-slate-300 bg-white px-6 py-10 text-center text-sm text-brand-slate-500">
            {t.empty}
          </p>
        ) : (
          inspections.map((inspection) => (
            <Link
              key={inspection.id}
              href={localizedPath(lang, `/portal/inspections/${inspection.id}`)}
              className="block rounded-lg border border-brand-slate-200 bg-white p-5 transition-colors hover:border-brand-teal-400 hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-brand-navy-900">{inspection.title}</h2>
                  <p className="mt-1 text-sm text-brand-slate-600">
                    {[inspection.vessel_name, inspection.port ?? inspection.location]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[inspection.status]}`}
                >
                  {t.status[inspection.status]}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-brand-slate-500">
                <span>
                  {t.table.client}: {inspection.client_name}
                </span>
                {inspection.scheduled_date && (
                  <span>
                    {t.table.date}: {dateFormatter.format(new Date(inspection.scheduled_date))}
                  </span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
