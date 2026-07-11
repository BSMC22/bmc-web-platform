import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Dashboard — Commercial — Blueseas OS",
  description: "Panel comercial: leads, oportunidades y cotizaciones.",
};

export default function Page() {
  return <ComingSoon title="Dashboard" description="Panel comercial: leads, oportunidades y cotizaciones." />;
}
