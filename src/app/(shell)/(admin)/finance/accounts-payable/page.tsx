import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Accounts Payable — Finance — Blueseas OS",
  description: "Cuentas por pagar.",
};

export default function Page() {
  return <ComingSoon title="Accounts Payable" description="Cuentas por pagar." />;
}
