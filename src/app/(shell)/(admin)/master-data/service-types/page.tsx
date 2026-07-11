import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Service Types — Master Data — Blueseas OS",
  description: "Catálogo de tipos de servicio.",
};

export default function Page() {
  return <ComingSoon title="Service Types" description="Catálogo de tipos de servicio." />;
}
