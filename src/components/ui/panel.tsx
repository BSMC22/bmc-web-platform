import type { ReactNode } from "react";

/**
 * Bordered section wrapper with a heading, used to lay out the "prepared
 * but not wired yet" areas of the Executive Center (charts, trends, etc.)
 * and any other dashboard section.
 */
export default function Panel({
  title,
  description,
  demo = false,
  children,
}: {
  title: string;
  description?: string;
  demo?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-brand-slate-200 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy-900">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-brand-slate-600">{description}</p>
          ) : null}
        </div>
        {demo ? (
          <span className="shrink-0 rounded-full bg-brand-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-slate-500">
            Demo
          </span>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/**
 * Empty-state placeholder for a chart/graph area that isn't wired to real
 * data yet.
 */
export function ChartPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-brand-slate-300 bg-brand-slate-50 text-sm text-brand-slate-400">
      {label}
    </div>
  );
}
