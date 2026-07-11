import type { Metadata } from "next";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SiteChrome from "@/components/layout/site-chrome";
import { locales, isLocale, defaultLocale, type Locale } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/dictionaries";
import { geistSans, geistMono } from "@/lib/fonts";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const dict = await getDictionary(locale);

  return {
    title: {
      default: dict.metadata.titleDefault,
      template: dict.metadata.titleTemplate,
    },
    description: dict.metadata.description,
    keywords: dict.metadata.keywords,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteChrome>
          <Header lang={locale} dict={dict} />
        </SiteChrome>
        <main className="flex-1">{children}</main>
        <SiteChrome>
          <Footer lang={locale} dict={dict} />
        </SiteChrome>
      </body>
    </html>
  );
}
