import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Reports — Analytics — Blueseas OS",
  description: "Reportes analíticos.",
};

export default function Page() {
  return <ComingSoon title="Reports" description="Reportes analíticos." />;
}
