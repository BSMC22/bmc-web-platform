import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Collections — Finance — Blueseas OS",
  description: "Gestión de cobranza.",
};

export default function Page() {
  return <ComingSoon title="Collections" description="Gestión de cobranza." />;
}
