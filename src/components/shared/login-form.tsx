"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ROLE_REDIRECTS } from "@/lib/roles";
import { defaultLocale } from "@/lib/i18n-config";

const inputStyles =
  "w-full rounded-md border border-brand-slate-200 bg-white px-4 py-3 text-sm text-brand-navy-900 placeholder:text-brand-slate-500 focus:border-brand-teal-500 focus:outline-none focus:ring-2 focus:ring-brand-teal-500/30";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(
        signInError.code === "invalid_credentials"
          ? "Email o contraseña incorrectos."
          : "Ocurrió un error. Intentá de nuevo."
      );
      setIsSubmitting(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const { data: profile } = userData.user
      ? await supabase.from("profiles").select("role").eq("id", userData.user.id).maybeSingle<{
          role: keyof typeof ROLE_REDIRECTS;
        }>()
      : { data: null };

    // Inspector Portal hasn't moved into the flat shell yet - bridge to
    // where it actually lives (bilingual, under [lang]) instead of the
    // /inspector/dashboard placeholder in ROLE_REDIRECTS.
    if (profile?.role === "inspector") {
      router.push(`/${defaultLocale}/portal`);
    } else {
      router.push(profile?.role ? ROLE_REDIRECTS[profile.role] : "/executive");
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-brand-navy-900">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputStyles}
          placeholder="tu@empresa.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-brand-navy-900">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={inputStyles}
          placeholder="••••••••"
        />
      </div>

      {error ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-teal-500 px-6 py-3 text-sm font-semibold text-brand-navy-950 transition-colors hover:bg-brand-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
