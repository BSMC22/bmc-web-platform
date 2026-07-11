import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  return {
    title: dict.portal.dashboard.metadata.title,
    description: dict.portal.dashboard.metadata.description,
  };
}

export default async function PortalDashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;

  // Admins land in the Executive Center (the flat "Blueseas OS" shell)
  // instead of the inspector dashboard. The (protected) layout already
  // guarantees `user` is set.
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

    if (profile?.role === "admin") {
      redirect("/executive");
    }
  }

  const dict = await getDictionary(lang);
  const dashboard = dict.portal.dashboard;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy-900">{dashboard.welcomeTitle}</h1>
      <p className="mt-2 text-sm text-brand-slate-600">{dashboard.welcomeDescription}</p>
    </div>
  );
}
