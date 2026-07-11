import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Assignments — Operations — Blueseas OS",
  description: "Asignación de trabajos a inspectores.",
};

export default function Page() {
  return <ComingSoon title="Assignments" description="Asignación de trabajos a inspectores." />;
}
