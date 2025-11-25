// frontend/src/components/form/Input.tsx
import React from "react";
import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  label?: string;
  register?: UseFormRegisterReturn; // react-hook-form register return
  error?: string;
  className?: string; // container / extra classes
} & InputHTMLAttributes<HTMLInputElement>; // includes name, type, value, onChange, placeholder, etc.

export default function Input({
  label,
  register,
  error,
  className = "",
  // all other standard input props come through rest
  ...rest
}: Props) {
  return (
    <div className={`mb-3 ${className}`}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}

      {/* Spread register props first, then rest to allow explicit props to override if needed */}
      <input
        {...(register as any)} // cast to any here to avoid typing conflicts when spreading
        {...rest}
        className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
      />

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
