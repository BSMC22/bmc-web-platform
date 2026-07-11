"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { ProfileRole } from "@/lib/supabase/types";

export default function UserRoleForm({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: ProfileRole;
}) {
  const router = useRouter();
  const [role, setRole] = useState<ProfileRole>(currentRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.from("profiles").update({ role }).eq("id", userId);

    setIsSubmitting(false);

    if (updateError) {
      setError("No se pudo actualizar el rol. Intentá de nuevo.");
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
      <div className="flex items-center gap-2">
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as ProfileRole)}
          className="rounded-md border border-brand-slate-200 bg-white px-3 py-1.5 text-xs text-brand-navy-900 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30"
        >
          <option value="inspector">Inspector</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={isSubmitting || role === currentRole}
          className="rounded-md bg-brand-navy-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-navy-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Guardando…" : "Guardar"}
        </button>
      </div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </form>
  );
}
