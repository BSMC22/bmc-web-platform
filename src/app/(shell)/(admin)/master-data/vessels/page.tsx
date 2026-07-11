import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Vessels — Master Data — Blueseas OS",
  description: "Catálogo de embarcaciones.",
};

export default function Page() {
  return <ComingSoon title="Vessels" description="Catálogo de embarcaciones." />;
}
