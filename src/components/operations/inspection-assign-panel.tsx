"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { XIcon } from "@/components/icons";

export default function InspectionAssignPanel({
  inspectionId,
  assigned,
  available,
}: {
  inspectionId: string;
  assigned: { id: string; label: string }[];
  available: { id: string; label: string }[];
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(available[0]?.id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAssign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedId) return;
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: insertError } = await supabase
      .from("inspection_assignments")
      .insert({ inspection_id: inspectionId, inspector_id: selectedId });

    setIsSubmitting(false);

    if (insertError) {
      setError("No se pudo asignar el inspector. Intentá de nuevo.");
      return;
    }

    router.refresh();
  }

  async function handleUnassign(inspectorId: string) {
    setError(null);
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("inspection_assignments")
      .delete()
      .eq("inspection_id", inspectionId)
      .eq("inspector_id", inspectorId);

    if (deleteError) {
      setError("No se pudo asignar el inspector. Intentá de nuevo.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap gap-2">
        {assigned.length === 0 ? (
          <p className="text-sm text-brand-slate-500">Todavía no hay inspectores asignados.</p>
        ) : (
          assigned.map((inspector) => (
            <span
              key={inspector.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal-50 py-1 pl-3 pr-1.5 text-xs font-medium text-brand-teal-700"
            >
              {inspector.label}
              <button
                type="button"
                onClick={() => handleUnassign(inspector.id)}
                aria-label="Quitar"
                className="flex h-4 w-4 items-center justify-center rounded-full text-brand-teal-700 hover:bg-brand-teal-100"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </span>
          ))
        )}
      </div>

      {available.length > 0 ? (
        <form onSubmit={handleAssign} className="flex items-center gap-2">
          <select
            value={selectedId}
            onChange={(event) => setSelectedId(event.target.value)}
            className="rounded-md border border-brand-slate-200 bg-white px-3 py-1.5 text-xs text-brand-navy-900 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30"
          >
            {available.map((inspector) => (
              <option key={inspector.id} value={inspector.id}>
                {inspector.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-brand-navy-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-navy-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Asignando…" : "Asignar"}
          </button>
        </form>
      ) : (
        <p className="text-xs text-brand-slate-500">Todavía no hay inspectores disponibles.</p>
      )}

      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
