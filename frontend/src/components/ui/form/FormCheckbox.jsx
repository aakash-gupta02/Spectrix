"use client";

import { useFormContext } from "react-hook-form";

export default function FormCheckbox({ name, label }) {
  const { register } = useFormContext();

  return (
    <label className="flex items-center gap-2 text-sm text-body">
      <input
        type="checkbox"
        {...register(name)}
        className="h-4 w-4 accent-primary"
      />
      {label}
    </label>
  );
}