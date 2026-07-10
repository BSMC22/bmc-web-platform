import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal-500 disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-teal-500 text-brand-navy-950 hover:bg-brand-teal-400",
  secondary:
    "bg-white text-brand-navy-900 hover:bg-brand-slate-100",
  outline:
    "border border-white/30 text-white hover:bg-white/10",
  ghost:
    "text-brand-navy-900 hover:bg-brand-slate-100",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type ButtonAsLink = CommonProps &
  ComponentPropsWithoutRef<typeof Link> & {
    href: string;
  };

type ButtonAsButton = CommonProps &
  ComponentPropsWithoutRef<"button"> & {
    href?: undefined;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const classes = [baseStyles, variantStyles[variant], sizeStyles[size], className]
    .filter(Boolean)
    .join(" ");

  if (props.href) {
    const { href, children, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { children, ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
