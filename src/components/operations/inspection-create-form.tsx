"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { InspectionStatus } from "@/lib/supabase/types";

const STATUS_OPTIONS: InspectionStatus[] = ["scheduled", "in_progress", "completed", "cancelled"];

export const STATUS_LABELS: Record<InspectionStatus, string> = {
  scheduled: "Programada",
  in_progress: "En curso",
  completed: "Completada",
  cancelled: "Cancelada",
};

const inputStyles =
  "w-full rounded-md border border-brand-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy-900 placeholder:text-brand-slate-500 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30";

export default function InspectionCreateForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const clientName = (form.elements.namedItem("client_name") as HTMLInputElement).value;
    const vesselName = (form.elements.namedItem("vessel_name") as HTMLInputElement).value;
    const port = (form.elements.namedItem("port") as HTMLInputElement).value;
    const serviceType = (form.elements.namedItem("service_type") as HTMLInputElement).value;
    const status = (form.elements.namedItem("status") as HTMLSelectElement).value as InspectionStatus;
    const scheduledDate = (form.elements.namedItem("scheduled_date") as HTMLInputElement).value;
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value;

    if (!title || !clientName) return;

    setIsSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error: insertError } = await supabase.from("inspections").insert({
      title,
      client_name: clientName,
      vessel_name: vesselName || null,
      port: port || null,
      service_type: serviceType || null,
      status,
      scheduled_date: scheduledDate || null,
      notes: notes || null,
      created_by: user?.id ?? null,
    });

    setIsSubmitting(false);

    if (insertError) {
      setError("Ocurrió un error al crear la inspección. Intentá de nuevo.");
      return;
    }

    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-brand-navy-900">
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className={inputStyles}
            placeholder="ej. Inspección de carga pre-embarque"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="client_name" className="text-sm font-medium text-brand-navy-900">
            Cliente
          </label>
          <input
            id="client_name"
            name="client_name"
            type="text"
            required
            className={inputStyles}
            placeholder="Nombre del cliente"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="vessel_name" className="text-sm font-medium text-brand-navy-900">
            Embarcación (opcional)
          </label>
          <input id="vessel_name" name="vessel_name" type="text" className={inputStyles} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="port" className="text-sm font-medium text-brand-navy-900">
            Puerto (opcional)
          </label>
          <input id="port" name="port" type="text" className={inputStyles} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="service_type" className="text-sm font-medium text-brand-navy-900">
            Tipo de servicio (opcional)
          </label>
          <input id="service_type" name="service_type" type="text" className={inputStyles} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium text-brand-navy-900">
            Estado
          </label>
          <select id="status" name="status" defaultValue="scheduled" className={inputStyles}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {STATUS_LABELS[option]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="scheduled_date" className="text-sm font-medium text-brand-navy-900">
            Fecha programada (opcional)
          </label>
          <input id="scheduled_date" name="scheduled_date" type="date" className={inputStyles} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-brand-navy-900">
          Notas (opcional)
        </label>
        <textarea id="notes" name="notes" rows={3} className={inputStyles} />
      </div>

      {error ? <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-brand-teal-500 px-5 py-2.5 text-sm font-semibold text-brand-navy-950 transition-colors hover:bg-brand-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creando…" : "Crear inspección"}
      </button>
    </form>
  );
}
