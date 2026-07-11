"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ProfileRole } from "@/lib/supabase/types";

export default function InviteUserForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const form = event.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const fullName = (form.elements.namedItem("full_name") as HTMLInputElement).value;
    const role = (form.elements.namedItem("role") as HTMLSelectElement).value as ProfileRole;

    if (!email) return;

    setIsSubmitting(true);

    const response = await fetch("/api/admin/invite-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, fullName: fullName || null, role }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ? `Ocurrió un error al enviar la invitación. (${body.error})` : "Ocurrió un error al enviar la invitación. Intentá de nuevo.");
      return;
    }

    setSuccess(true);
    formRef.current?.reset();
    router.refresh();
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="invite_email" className="text-sm font-medium text-brand-navy-900">
            Email
          </label>
          <input
            id="invite_email"
            name="email"
            type="email"
            required
            placeholder="persona@empresa.com"
            className="w-full rounded-md border border-brand-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy-900 placeholder:text-brand-slate-500 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="invite_full_name" className="text-sm font-medium text-brand-navy-900">
            Nombre completo (opcional)
          </label>
          <input
            id="invite_full_name"
            name="full_name"
            type="text"
            className="w-full rounded-md border border-brand-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy-900 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="invite_role" className="text-sm font-medium text-brand-navy-900">
            Rol
          </label>
          <select
            id="invite_role"
            name="role"
            defaultValue="inspector"
            className="w-full rounded-md border border-brand-slate-200 bg-white px-4 py-2.5 text-sm text-brand-navy-900 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30"
          >
            <option value="inspector">Inspector</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {error ? <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {success ? (
        <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Invitación enviada.</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-fit items-center justify-center gap-2 rounded-md bg-brand-teal-500 px-5 py-2.5 text-sm font-semibold text-brand-navy-950 transition-colors hover:bg-brand-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Enviando…" : "Enviar invitación"}
      </button>
    </form>
  );
}
