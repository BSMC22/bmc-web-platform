import { SparklesIcon } from "@/components/icons";

/**
 * Placeholder for the future AI-generated executive brief. Content here is
 * entirely fabricated for demo purposes and clearly labeled as such - this
 * component will eventually be fed by a real model once that phase starts.
 */
export default function AiBrief() {
  return (
    <div className="rounded-xl border border-brand-teal-500/30 bg-gradient-to-br from-brand-navy-900 to-brand-navy-800 p-6 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-brand-teal-300">
            <SparklesIcon className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-semibold uppercase tracking-wide">AI Executive Brief</h2>
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-teal-200">
          Demo — datos ficticios
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-brand-slate-200">
        Este mes la operación se mantiene estable: las inspecciones activas crecieron un 8% frente al
        mes anterior y el tiempo de respuesta promedio se mantuvo dentro del objetivo. Se recomienda
        priorizar el seguimiento de las facturas vencidas en Sudamérica y reforzar la disponibilidad
        de inspectores en la región de Asia-Pacífico para la próxima quincena.
      </p>
      <p className="mt-3 text-xs text-brand-slate-400">
        Este resumen usa datos de ejemplo. En una fase futura será generado automáticamente por IA a
        partir de los datos reales de la operación.
      </p>
    </div>
  );
}
