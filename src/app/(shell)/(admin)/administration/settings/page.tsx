import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Settings — Administration — Blueseas OS",
  description: "Configuración general de Blueseas OS.",
};

export default function Page() {
  return <ComingSoon title="Settings" description="Configuración general de Blueseas OS." />;
}
