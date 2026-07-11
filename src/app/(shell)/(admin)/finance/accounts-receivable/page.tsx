import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Accounts Receivable — Finance — Blueseas OS",
  description: "Cuentas por cobrar.",
};

export default function Page() {
  return <ComingSoon title="Accounts Receivable" description="Cuentas por cobrar." />;
}
