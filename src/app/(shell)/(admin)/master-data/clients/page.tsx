import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Clients — Master Data — Blueseas OS",
  description: "Catálogo de clientes.",
};

export default function Page() {
  return <ComingSoon title="Clients" description="Catálogo de clientes." />;
}
