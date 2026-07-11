import Panel from "@/components/ui/panel";

/**
 * Shared placeholder for Fase 1.5 architecture pages - routes that exist
 * (so the navigation/IA is complete) but have no logic behind them yet.
 * Reuses Panel instead of a bespoke layout per page.
 */
export default function ComingSoon({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy-900">{title}</h1>
        {description ? <p className="mt-1 text-sm text-brand-slate-600">{description}</p> : null}
      </div>

      <Panel title="Próximamente" demo>
        <p className="text-sm text-brand-slate-500">
          Esta sección está preparada en la navegación de Blueseas OS pero todavía no tiene
          funcionalidad. Se construirá en una fase posterior.
        </p>
      </Panel>
    </div>
  );
}
