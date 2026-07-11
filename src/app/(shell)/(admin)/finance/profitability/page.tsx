import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Profitability — Finance — Blueseas OS",
  description: "Rentabilidad por cliente, job o período.",
};

export default function Page() {
  return <ComingSoon title="Profitability" description="Rentabilidad por cliente, job o período." />;
}
