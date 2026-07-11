import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Contacts — Master Data — Blueseas OS",
  description: "Catálogo de contactos.",
};

export default function Page() {
  return <ComingSoon title="Contacts" description="Catálogo de contactos." />;
}
