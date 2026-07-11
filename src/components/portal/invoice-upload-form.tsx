"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Dictionary } from "@/lib/dictionaries";

type InvoiceFormDict = Dictionary["portal"]["invoices"]["form"];

const inputStyles =
  "w-full rounded-md border border-brand-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy-900 placeholder:text-brand-slate-500 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30";

export default function InvoiceUploadForm({
  inspections,
  dict,
}: {
  inspections: { id: string; title: string }[];
  dict: InvoiceFormDict;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const inspectionId = (form.elements.namedItem("inspection_id") as HTMLSelectElement).value;
    const amount = (form.elements.namedItem("amount") as HTMLInputElement).value;
    const currency = (form.elements.namedItem("currency") as HTMLInputElement).value;
    const notes = (form.elements.namedItem("notes") as HTMLInputElement).value;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!inspectionId || !file) return;

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

    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("invoices").upload(filePath, file);

    if (uploadError) {
      setError(dict.error);
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("invoices").insert({
      inspection_id: inspectionId,
      inspector_id: user.id,
      file_path: filePath,
      file_name: file.name,
      amount: Number(amount),
      currency: currency || "USD",
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
      <div className="flex flex-col gap-1.5">
        <label htmlFor="inspection_id" className="text-sm font-medium text-brand-navy-900">
          {dict.inspectionLabel}
        </label>
        <select id="inspection_id" name="inspection_id" required defaultValue="" className={inputStyles}>
          <option value="" disabled>
            {dict.inspectionPlaceholder}
          </option>
          {inspections.map((inspection) => (
            <option key={inspection.id} value={inspection.id}>
              {inspection.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="amount" className="text-sm font-medium text-brand-navy-900">
            {dict.amountLabel}
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            required
            className={inputStyles}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="currency" className="text-sm font-medium text-brand-navy-900">
            {dict.currencyLabel}
          </label>
          <input id="currency" name="currency" type="text" defaultValue="USD" className={inputStyles} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="file" className="text-sm font-medium text-brand-navy-900">
          {dict.fileLabel}
        </label>
        <input id="file" name="file" type="file" required className={inputStyles} />
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
