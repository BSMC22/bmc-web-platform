import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Opportunities — Commercial — Blueseas OS",
  description: "Oportunidades en seguimiento.",
};

export default function Page() {
  return <ComingSoon title="Opportunities" description="Oportunidades en seguimiento." />;
}
