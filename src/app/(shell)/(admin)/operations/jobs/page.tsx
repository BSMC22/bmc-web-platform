import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Jobs — Operations — Blueseas OS",
  description: "El módulo principal del negocio. Se construirá en una fase posterior.",
};

export default function Page() {
  return <ComingSoon title="Jobs" description="El módulo principal del negocio. Se construirá en una fase posterior." />;
}
