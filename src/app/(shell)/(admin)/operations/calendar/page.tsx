import type { Metadata } from "next";
import ComingSoon from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Calendar — Operations — Blueseas OS",
  description: "Calendario operativo de inspecciones y asignaciones.",
};

export default function Page() {
  return <ComingSoon title="Calendar" description="Calendario operativo de inspecciones y asignaciones." />;
}
