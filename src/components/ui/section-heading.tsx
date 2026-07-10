type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto items-center" : "text-left";
  const eyebrowClass = tone === "dark" ? "text-brand-teal-500" : "text-brand-teal-300";
  const descriptionClass = tone === "dark" ? "text-brand-slate-600" : "text-brand-slate-200";

  return (
    <div className={`flex max-w-3xl flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow ? (
        <span
          className={`text-sm font-semibold uppercase tracking-widest ${eyebrowClass}`}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className={`text-balance text-base leading-relaxed sm:text-lg ${descriptionClass}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
