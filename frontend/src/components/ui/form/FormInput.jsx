"use client";

import { useFormContext } from "react-hook-form";

export default function FormInput({
  name,
  label,
  type = "text",
  placeholder,
  maxLength,
  inputRef,
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

      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        {...register(name)}
        className={`w-full rounded border bg-surface-2 px-3 py-2 text-sm text-heading outline-none transition 
          ${error ? "border-red-500" : "border-border focus:border-primary"}`}
      />

      {error && (
        <p className="text-xs text-red-400">{error.message}</p>
      )}
    </div>
  );
}