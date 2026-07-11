"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Dictionary } from "@/lib/dictionaries";

type DetailDict = Dictionary["portal"]["inspections"]["detail"];

const inputStyles =
  "w-full rounded-md border border-brand-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy-900 placeholder:text-brand-slate-500 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30";

export default function ReportUploadForm({
  inspectionId,
  dict,
}: {
  inspectionId: string;
  dict: DetailDict;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const descriptionInput = form.elements.namedItem("description") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) return;

    setIsSubmitting(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError(dict.uploadError);
      setIsSubmitting(false);
      return;
    }

    const filePath = `${inspectionId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("inspection-reports")
      .upload(filePath, file);

    if (uploadError) {
      setError(dict.uploadError);
      setIsSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("inspection_reports").insert({
      inspection_id: inspectionId,
      inspector_id: user.id,
      file_path: filePath,
      file_name: file.name,
      file_type: file.type || null,
      description: descriptionInput.value || null,
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(dict.uploadError);
      return;
    }

    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="file" className="text-sm font-medium text-brand-navy-900">
          {dict.uploadFileLabel}
        </label>
        <input id="file" name="file" type="file" required className={inputStyles} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-brand-navy-900">
          {dict.uploadDescriptionLabel}
        </label>
        <input
          id="description"
          name="description"
          type="text"
          className={inputStyles}
          placeholder={dict.uploadDescriptionPlaceholder}
        />
      </div>

      {error ? <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-brand-teal-500 px-5 py-2.5 text-sm font-semibold text-brand-navy-950 transition-colors hover:bg-brand-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? dict.uploadingButton : dict.uploadButton}
      </button>
    </form>
  );
}
