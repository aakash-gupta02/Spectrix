"use client";

import { useFormContext } from "react-hook-form";

export default function FormTextarea({
  name,
  label,
  placeholder,
  rows = 4,
  className = "",
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors?.[name];

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs uppercase tracking-[0.12em] text-muted">
          {label}
        </label>
      )}

      <textarea
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full rounded border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition ${
          error ? "border-red-500" : "border-border focus:border-primary"
        } ${className}`}
      />

      {error && <p className="text-xs text-red-400">{error.message}</p>}
    </div>
  );
}