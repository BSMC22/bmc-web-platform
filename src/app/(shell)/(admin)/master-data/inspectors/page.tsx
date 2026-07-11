import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Inspectors — Master Data — Blueseas OS",
  description: "Catálogo de inspectores.",
};

export default function Page() {
  return <ComingSoon title="Inspectors" description="Catálogo de inspectores." />;
}
