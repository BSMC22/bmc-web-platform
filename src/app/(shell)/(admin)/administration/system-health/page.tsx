import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "System Health — Administration — Blueseas OS",
  description: "Estado y monitoreo del sistema.",
};

export default function Page() {
  return <ComingSoon title="System Health" description="Estado y monitoreo del sistema." />;
}
