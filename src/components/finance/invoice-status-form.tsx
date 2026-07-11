"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { InvoiceStatus } from "@/lib/supabase/types";

const STATUS_OPTIONS: InvoiceStatus[] = ["submitted", "approved", "rejected", "paid"];

export const STATUS_LABELS: Record<InvoiceStatus, string> = {
  submitted: "Enviada",
  approved: "Aprobada",
  rejected: "Rechazada",
  paid: "Pagada",
};

export default function InvoiceStatusForm({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: InvoiceStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<InvoiceStatus>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("invoices")
      .update({ status })
      .eq("id", invoiceId);

    setIsSubmitting(false);

    if (updateError) {
      setError("No se pudo actualizar el estado. Intentá de nuevo.");
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value as InvoiceStatus)}
        className="rounded-md border border-brand-slate-200 bg-white px-3 py-1.5 text-xs text-brand-navy-900 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {STATUS_LABELS[option]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isSubmitting || status === currentStatus}
        className="rounded-md bg-brand-navy-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-navy-950 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Actualizando…" : "Actualizar"}
      </button>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </form>
  );
}
