import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Payments — Finance — Blueseas OS",
  description: "Seguimiento de pagos a inspectores y proveedores.",
};

export default function Page() {
  return <ComingSoon title="Payments" description="Seguimiento de pagos a inspectores y proveedores." />;
}
