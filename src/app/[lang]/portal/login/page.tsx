import type { Metadata } from "next";
import Link from "next/link";
import { AnchorIcon, LockIcon } from "@/components/icons";
import LoginForm from "@/components/portal/login-form";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { localizedPath } from "@/lib/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  return {
    title: dict.portal.login.metadata.title,
    description: dict.portal.login.metadata.description,
  };
}

export default async function PortalLoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : defaultLocale;
  const dict = await getDictionary(lang);
  const login = dict.portal.login;

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-brand-slate-100 px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-brand-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy-900 text-brand-teal-400">
            <AnchorIcon className="h-6 w-6" />
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-widest text-brand-teal-600">
            <LockIcon className="h-4 w-4" />
            {login.badge}
          </span>
          <h1 className="text-2xl font-bold text-brand-navy-900">{login.title}</h1>
          <p className="text-sm leading-relaxed text-brand-slate-600">{login.subtitle}</p>
        </div>

        <div className="mt-8">
          <LoginForm lang={lang} dict={login} />
        </div>

        <div className="mt-8 text-center">
          <Link
            href={localizedPath(lang)}
            className="text-sm font-medium text-brand-slate-600 hover:text-brand-teal-600"
          >
            {login.backToSite}
          </Link>
        </div>
      </div>
    </section>
  );
}
