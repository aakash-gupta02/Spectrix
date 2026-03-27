import Link from "next/link";
import React from "react";

const baseClassName =
  "group inline-flex items-center justify-center gap-2 border px-6 py-4 text-xs font-medium uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary:
    "border-border bg-primary text-black hover:bg-primary-strong",
  ghost:
    "border-border bg-transparent text-heading hover:bg-surface-2",
};

export default function LandingButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const variantClassName = variants[variant] || variants.primary;
  const classes = `${baseClassName} ${variantClassName} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes} aria-disabled={disabled}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
