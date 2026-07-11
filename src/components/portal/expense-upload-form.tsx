"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Dictionary } from "@/lib/dictionaries";

type ExpenseFormDict = Dictionary["portal"]["expenses"]["form"];

const inputStyles =
  "w-full rounded-md border border-brand-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy-900 placeholder:text-brand-slate-500 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30";

export default function ExpenseUploadForm({
  inspections,
  dict,
}: {
  inspections: { id: string; title: string }[];
  dict: ExpenseFormDict;
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
    const description = (form.elements.namedItem("description") as HTMLInputElement).value;
    const amount = (form.elements.namedItem("amount") as HTMLInputElement).value;
    const currency = (form.elements.namedItem("currency") as HTMLInputElement).value;
    const incurredOn = (form.elements.namedItem("incurred_on") as HTMLInputElement).value;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!inspectionId || !description) return;

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

    let filePath: string | null = null;
    let fileName: string | null = null;

    if (file) {
      filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("expenses").upload(filePath, file);
      if (uploadError) {
        setError(dict.error);
        setIsSubmitting(false);
        return;
      }
      fileName = file.name;
    }

    const { error: insertError } = await supabase.from("expenses").insert({
      inspection_id: inspectionId,
      inspector_id: user.id,
      description,
      amount: Number(amount),
      currency: currency || "USD",
      file_path: filePath,
      file_name: fileName,
      incurred_on: incurredOn || null,
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-brand-navy-900">
          {dict.descriptionLabel}
        </label>
        <input
          id="description"
          name="description"
          type="text"
          required
          className={inputStyles}
          placeholder={dict.descriptionPlaceholder}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="incurred_on" className="text-sm font-medium text-brand-navy-900">
            {dict.dateLabel}
          </label>
          <input id="incurred_on" name="incurred_on" type="date" className={inputStyles} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="file" className="text-sm font-medium text-brand-navy-900">
          {dict.receiptLabel}
        </label>
        <input id="file" name="file" type="file" className={inputStyles} />
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
