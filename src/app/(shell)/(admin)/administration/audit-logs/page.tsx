import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Audit Logs — Administration — Blueseas OS",
  description: "Registro de auditoría de acciones del sistema.",
};

export default function Page() {
  return <ComingSoon title="Audit Logs" description="Registro de auditoría de acciones del sistema." />;
}
