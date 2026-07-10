import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Blueseas Marine Consulting (BMC) | Marine Inspection & Technical Consultancy",
    template: "%s | BMC",
  },
  description:
    "Blueseas Marine Consulting (BMC) ofrece inspecciones marinas, auditorías técnicas y consultoría especializada para la industria marítima, con cobertura y respuesta a nivel mundial.",
  keywords: [
    "marine inspection",
    "marine surveyor",
    "technical consultancy",
    "ship audits",
    "vetting inspections",
    "Blueseas Marine Consulting",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
