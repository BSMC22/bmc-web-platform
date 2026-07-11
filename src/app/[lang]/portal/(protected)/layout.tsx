import { redirect } from "next/navigation";
import { AnchorIcon } from "@/components/icons";
import PortalNav from "@/components/portal/portal-nav";
import LogoutButton from "@/components/shared/logout-button";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { localizedPath } from "@/lib/navigation";
import type { Profile } from "@/lib/supabase/types";

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const nav = dict.portal.nav;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // src/proxy.ts already redirects unauthenticated requests away from
  // /portal/*, but this guard keeps the layout safe if it's ever rendered
  // without going through the proxy.
  if (!user) {
    redirect(localizedPath(lang, "/portal/login"));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle<Pick<Profile, "full_name">>();

  const displayName = profile?.full_name || user.email || "";

  return (
    <div className="flex min-h-screen flex-col bg-brand-slate-100 md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-brand-navy-900 px-4 py-6 md:flex">
        <div className="flex items-center gap-2 px-2 pb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-brand-teal-400">
            <AnchorIcon className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-widest text-white">BMC</span>
        </div>

        <div className="flex-1">
          <PortalNav lang={lang} dict={nav} orientation="vertical" />
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <p className="truncate px-3 text-xs text-brand-slate-400">{displayName}</p>
          <LogoutButton redirectTo={localizedPath(lang, "/portal/login")} label={nav.logout} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between bg-brand-navy-900 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-brand-teal-400">
            <AnchorIcon className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold uppercase tracking-widest text-white">BMC</span>
        </div>
        <LogoutButton redirectTo={localizedPath(lang, "/portal/login")} label={nav.logout} />
      </header>
      <nav className="border-b border-brand-slate-200 bg-brand-navy-900 px-4 pb-3 md:hidden">
        <PortalNav lang={lang} dict={nav} orientation="horizontal" />
      </nav>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
