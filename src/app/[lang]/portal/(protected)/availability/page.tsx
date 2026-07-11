import type { Metadata } from "next";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { createClient } from "@/lib/supabase/server";
import type { Availability, AvailabilityStatus } from "@/lib/supabase/types";
import AvailabilityForm from "@/components/portal/availability-form";
import DeleteAvailabilityButton from "@/components/portal/delete-availability-button";
import { CalendarIcon } from "@/components/icons";

const statusStyles: Record<AvailabilityStatus, string> = {
  available: "bg-emerald-50 text-emerald-700",
  unavailable: "bg-brand-slate-100 text-brand-slate-700",
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
    title: dict.portal.availability.metadata.title,
    description: dict.portal.availability.metadata.description,
  };
}

export default async function PortalAvailabilityPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.portal.availability;

  const supabase = await createClient();

  const { data: windows } = await supabase
    .from("availability")
    .select("*")
    .order("start_date", { ascending: true })
    .returns<Availability[]>();

  const dateFormatter = new Intl.DateTimeFormat(lang === "es" ? "es-AR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy-900">{t.title}</h1>
      <p className="mt-2 text-sm text-brand-slate-600">{t.subtitle}</p>

      <div className="mt-6 rounded-xl border border-brand-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy-900">{t.form.heading}</h2>
        <div className="mt-4">
          <AvailabilityForm dict={t.form} statusDict={t.status} />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-brand-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-brand-navy-900">{t.listHeading}</h2>
        <ul className="mt-4 divide-y divide-brand-slate-200 border-t border-brand-slate-200">
          {!windows || windows.length === 0 ? (
            <li className="py-4 text-sm text-brand-slate-500">{t.empty}</li>
          ) : (
            windows.map((window_) => (
              <li key={window_.id} className="flex items-start gap-3 py-4">
                <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-brand-navy-900">
                    {dateFormatter.format(new Date(window_.start_date))} —{" "}
                    {dateFormatter.format(new Date(window_.end_date))}
                  </p>
                  {window_.notes ? (
                    <p className="mt-0.5 text-sm text-brand-slate-600">{window_.notes}</p>
                  ) : null}
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusStyles[window_.status]}`}
                >
                  {t.status[window_.status]}
                </span>
                <DeleteAvailabilityButton
                  id={window_.id}
                  label={t.deleteButton}
                  confirmMessage={t.deleteConfirm}
                />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
