import Link from "next/link";
import React from "react";

const baseClassName =
  "inline-flex items-center justify-center gap-2 rounded border px-3 py-1.5 text-[0.75rem] transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  secondary: "border-border text-body hover:bg-white/5",
  primary:
    "border-primary/40 bg-primary-soft text-primary hover:bg-primary/20",
};

export default function DashboardButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "secondary",
  disabled = false,
  className = "",
}) {
  const variantClassName = variants[variant] || variants.secondary;
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
