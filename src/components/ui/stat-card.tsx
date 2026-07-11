import type { ComponentType } from "react";
import type { IconProps } from "@/components/icons";

/**
 * Generic metric card used across Executive/Operations/Finance/Shareholder
 * dashboards. `demo` renders a small "Demo" tag so fabricated numbers are
 * never mistaken for live data.
 */
export default function StatCard({
  label,
  value,
  Icon,
  demo = false,
  href,
}: {
  label: string;
  value: string | number;
  Icon?: ComponentType<IconProps>;
  demo?: boolean;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        {Icon ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-teal-50 text-brand-teal-600">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        {demo ? (
          <span className="rounded-full bg-brand-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-slate-500">
            Demo
          </span>
        ) : null}
      </div>
      <span className="text-2xl font-bold text-brand-navy-900">{value}</span>
      <span className="text-sm text-brand-slate-600">{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex flex-col gap-3 rounded-xl border border-brand-slate-200 bg-white p-5 transition-colors hover:border-brand-teal-500"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-brand-slate-200 bg-white p-5">
      {content}
    </div>
  );
}
