import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Dashboards — Analytics — Blueseas OS",
  description: "Dashboards personalizados.",
};

export default function Page() {
  return <ComingSoon title="Dashboards" description="Dashboards personalizados." />;
}
