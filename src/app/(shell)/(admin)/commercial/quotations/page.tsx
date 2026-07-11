import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Quotations — Commercial — Blueseas OS",
  description: "Cotizaciones enviadas a clientes.",
};

export default function Page() {
  return <ComingSoon title="Quotations" description="Cotizaciones enviadas a clientes." />;
}
