import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Permissions — Administration — Blueseas OS",
  description: "Permisos por rol y módulo.",
};

export default function Page() {
  return <ComingSoon title="Permissions" description="Permisos por rol y módulo." />;
}
