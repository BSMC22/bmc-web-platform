import Container from "@/components/ui/container";

type SectionTone = "white" | "slate" | "navy";

type SectionProps = {
  children: React.ReactNode;
  tone?: SectionTone;
  className?: string;
  id?: string;
};

const toneStyles: Record<SectionTone, string> = {
  white: "bg-white text-brand-navy-900",
  slate: "bg-brand-slate-100 text-brand-navy-900",
  navy: "bg-brand-navy-950 text-white",
};

export default function Section({
  children,
  tone = "white",
  className = "",
  id,
}: SectionProps) {
  return (
    <section id={id} className={`${toneStyles[tone]} py-20 sm:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
