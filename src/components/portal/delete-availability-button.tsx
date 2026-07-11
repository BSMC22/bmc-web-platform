"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { XIcon } from "@/components/icons";

export default function DeleteAvailabilityButton({
  id,
  label,
  confirmMessage,
}: {
  id: string;
  label: string;
  confirmMessage: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(confirmMessage)) return;

    setIsDeleting(true);
    const supabase = createClient();
    await supabase.from("availability").delete().eq("id", id);
    setIsDeleting(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label={label}
      title={label}
      className="shrink-0 rounded-md p-1.5 text-brand-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
    >
      <XIcon className="h-4 w-4" />
    </button>
  );
}
