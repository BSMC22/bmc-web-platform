import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/shared/login-form";
import { AnchorIcon } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { ROLE_REDIRECTS } from "@/lib/roles";
import { defaultLocale } from "@/lib/i18n-config";
import type { Profile } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Blueseas OS — Iniciar sesión",
  description: "Iniciá sesión en Blueseas OS para acceder a tu panel.",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle<Pick<Profile, "role">>();

    // Inspector Portal hasn't moved into the flat shell yet.
    if (profile?.role === "inspector") {
      redirect(`/${defaultLocale}/portal`);
    }
    redirect(profile?.role ? ROLE_REDIRECTS[profile.role] : "/executive");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-slate-100 px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-brand-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2 pb-6 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-navy-900 text-brand-teal-400">
            <AnchorIcon className="h-6 w-6" />
          </span>
          <h1 className="text-lg font-semibold text-brand-navy-900">Blueseas OS</h1>
          <p className="text-sm text-brand-slate-600">
            Iniciá sesión para acceder a tu panel.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
