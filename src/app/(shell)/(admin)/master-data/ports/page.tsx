import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Ports — Master Data — Blueseas OS",
  description: "Catálogo de puertos.",
};

export default function Page() {
  return <ComingSoon title="Ports" description="Catálogo de puertos." />;
}
