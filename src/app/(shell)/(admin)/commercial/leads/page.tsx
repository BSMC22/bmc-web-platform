import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Leads — Commercial — Blueseas OS",
  description: "Leads comerciales entrantes.",
};

export default function Page() {
  return <ComingSoon title="Leads" description="Leads comerciales entrantes." />;
}
