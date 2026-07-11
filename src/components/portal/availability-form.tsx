"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Dictionary } from "@/lib/dictionaries";
import type { AvailabilityStatus } from "@/lib/supabase/types";

type AvailabilityFormDict = Dictionary["portal"]["availability"]["form"];
type AvailabilityStatusDict = Dictionary["portal"]["availability"]["status"];

const inputStyles =
  "w-full rounded-md border border-brand-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy-900 placeholder:text-brand-slate-500 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30";

export default function AvailabilityForm({
  dict,
  statusDict,
}: {
  dict: AvailabilityFormDict;
  statusDict: AvailabilityStatusDict;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const startDate = (form.elements.namedItem("start_date") as HTMLInputElement).value;
    const endDate = (form.elements.namedItem("end_date") as HTMLInputElement).value;
    const status = (form.elements.namedItem("status") as HTMLSelectElement).value as AvailabilityStatus;
    const notes = (form.elements.namedItem("notes") as HTMLInputElement).value;

    if (!startDate || !endDate) return;

    setIsSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(dict.error);
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("availability").insert({
      inspector_id: user.id,
      start_date: startDate,
      end_date: endDate,
      status,
      notes: notes || null,
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(dict.error);
      return;
    }

    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="start_date" className="text-sm font-medium text-brand-navy-900">
            {dict.startDateLabel}
          </label>
          <input id="start_date" name="start_date" type="date" required className={inputStyles} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="end_date" className="text-sm font-medium text-brand-navy-900">
            {dict.endDateLabel}
          </label>
          <input id="end_date" name="end_date" type="date" required className={inputStyles} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium text-brand-navy-900">
            {dict.statusLabel}
          </label>
          <select id="status" name="status" defaultValue="available" className={inputStyles}>
            <option value="available">{statusDict.available}</option>
            <option value="unavailable">{statusDict.unavailable}</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notes" className="text-sm font-medium text-brand-navy-900">
          {dict.notesLabel}
        </label>
        <input
          id="notes"
          name="notes"
          type="text"
          className={inputStyles}
          placeholder={dict.notesPlaceholder}
        />
      </div>

      {error ? <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-brand-teal-500 px-5 py-2.5 text-sm font-semibold text-brand-navy-950 transition-colors hover:bg-brand-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? dict.submittingButton : dict.submitButton}
      </button>
    </form>
  );
}
