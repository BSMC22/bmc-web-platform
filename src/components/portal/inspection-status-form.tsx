"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Dictionary } from "@/lib/dictionaries";
import type { InspectionStatus } from "@/lib/supabase/types";

type InspectionsDict = Dictionary["portal"]["inspections"];

const STATUS_OPTIONS: InspectionStatus[] = ["scheduled", "in_progress", "completed", "cancelled"];

const selectStyles =
  "w-full rounded-md border border-brand-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy-900 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30 sm:w-auto";

export default function InspectionStatusForm({
  inspectionId,
  currentStatus,
  dict,
}: {
  inspectionId: string;
  currentStatus: InspectionStatus;
  dict: InspectionsDict;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<InspectionStatus>(currentStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("inspections")
      .update({ status })
      .eq("id", inspectionId);

    setIsSubmitting(false);

    if (updateError) {
      setError(dict.detail.statusError);
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="status" className="text-sm font-medium text-brand-navy-900">
          {dict.detail.statusHeading}
        </label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as InspectionStatus)}
          className={selectStyles}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {dict.status[option]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || status === currentStatus}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-teal-500 px-5 py-2.5 text-sm font-semibold text-brand-navy-950 transition-colors hover:bg-brand-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? dict.detail.statusSavingButton : dict.detail.statusSaveButton}
      </button>

      {error ? <p className="text-sm text-red-700 sm:ml-2">{error}</p> : null}
    </form>
  );
}
