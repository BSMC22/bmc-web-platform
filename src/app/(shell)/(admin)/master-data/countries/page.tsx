import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Countries — Master Data — Blueseas OS",
  description: "Catálogo de países.",
};

export default function Page() {
  return <ComingSoon title="Countries" description="Catálogo de países." />;
}
