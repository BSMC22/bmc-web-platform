import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Companies — Master Data — Blueseas OS",
  description: "Catálogo de empresas.",
};

export default function Page() {
  return <ComingSoon title="Companies" description="Catálogo de empresas." />;
}
