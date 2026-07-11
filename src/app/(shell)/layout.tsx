import type { Metadata } from "next";
import { geistSans, geistMono } from "@/lib/fonts";
import "../globals.css";

// This is the second of two independent Next.js "root layouts" in this app
// (see https://nextjs.org/docs/app/building-your-application/routing/route-groups#creating-multiple-root-layouts).
// [lang]/layout.tsx is the root for the bilingual marketing site + Inspector
// Portal; this one is the root for the flat, single-language "Blueseas OS"
// shell (/login, /executive, /operations, /finance, /shareholder, /client).
// Route groups like (shell) don't affect the URL, so /executive still
// resolves to /executive - this folder only exists so these routes get
// their own <html>/<body> and globals.css instead of falling through with
// no styling at all (that was the "everything looks huge/unstyled" bug).
export const metadata: Metadata = {
  title: "Blueseas OS",
  description: "Sistema operativo empresarial de Blueseas Marine Consulting.",
};

export default function ShellRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
