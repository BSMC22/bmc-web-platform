import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Reports — Operations — Blueseas OS",
  description: "Reportes operativos.",
};

export default function Page() {
  return <ComingSoon title="Reports" description="Reportes operativos." />;
}
