"use client";

import Image from "next/image";
import { useId } from "react";
import { useFieldError } from "./action-form";

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-900 aria-invalid:border-red-500 dark:border-neutral-700 dark:focus:border-neutral-100";

type FieldProps = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
};

function Field({
  id,
  name,
  label,
  hint,
  required,
  children,
}: FieldProps & { id: string; children: React.ReactNode }) {
  const error = useFieldError(name);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        hint && <p className="text-xs text-neutral-500">{hint}</p>
      )}
    </div>
  );
}

export function TextField({
  type = "text",
  defaultValue,
  placeholder,
  ...field
}: FieldProps & {
  type?: "text" | "email" | "url" | "number" | "month";
  defaultValue?: string | number | null;
  placeholder?: string;
}) {
  const id = useId();
  const error = useFieldError(field.name);
  return (
    <Field id={id} {...field}>
      <input
        id={id}
        name={field.name}
        type={type}
        required={field.required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={inputClass}
      />
    </Field>
  );
}

export function TextAreaField({
  defaultValue,
  rows = 4,
  placeholder,
  ...field
}: FieldProps & { defaultValue?: string | null; rows?: number; placeholder?: string }) {
  const id = useId();
  const error = useFieldError(field.name);
  return (
    <Field id={id} {...field}>
      <textarea
        id={id}
        name={field.name}
        rows={rows}
        required={field.required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={inputClass}
      />
    </Field>
  );
}

export function SelectField({
  options,
  defaultValue,
  ...field
}: FieldProps & { options: { value: string; label: string }[]; defaultValue?: string }) {
  const id = useId();
  return (
    <Field id={id} {...field}>
      <select id={id} name={field.name} defaultValue={defaultValue} className={`${inputClass} dark:bg-neutral-950`}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function CheckboxField({
  name,
  label,
  hint,
  defaultChecked,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-start gap-2 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5" />
      <span>
        <span className="font-medium">{label}</span>
        {hint && <span className="block text-xs text-neutral-500">{hint}</span>}
      </span>
    </label>
  );
}

/** Multi-select as a list of checkboxes, submitted as repeated `name` values */
export function CheckboxGroup({
  name,
  label,
  hint,
  options,
  defaultValues = [],
}: {
  name: string;
  label: string;
  hint?: string;
  options: { value: number; label: string }[];
  defaultValues?: number[];
}) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-medium">{label}</legend>
      {options.length === 0 ? (
        <p className="text-xs text-neutral-500">{hint}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1 text-sm has-checked:border-neutral-900 has-checked:bg-neutral-900 has-checked:text-white dark:border-neutral-700 dark:has-checked:border-neutral-100 dark:has-checked:bg-neutral-100 dark:has-checked:text-neutral-900"
            >
              <input
                type="checkbox"
                name={name}
                value={option.value}
                defaultChecked={defaultValues.includes(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}

/** File input that shows the current file and offers to remove it (`<name>Remove` checkbox) */
export function FileField({
  currentUrl,
  kind = "image",
  ...field
}: FieldProps & { currentUrl?: string | null; kind?: "image" | "pdf" }) {
  const id = useId();
  const accept = kind === "image" ? "image/jpeg,image/png,image/webp,image/avif,image/gif,image/svg+xml" : "application/pdf";
  return (
    <Field id={id} {...field}>
      {currentUrl && (
        <div className="flex items-center gap-3">
          {kind === "image" ? (
            <Image
              src={currentUrl}
              alt=""
              width={64}
              height={64}
              unoptimized
              className="size-16 rounded-md border border-neutral-200 object-cover dark:border-neutral-800"
            />
          ) : (
            <a href={currentUrl} target="_blank" rel="noreferrer" className="text-sm underline">
              View current file
            </a>
          )}
          <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <input type="checkbox" name={`${field.name}Remove`} />
            Remove
          </label>
        </div>
      )}
      <input id={id} name={field.name} type="file" accept={accept} className="text-sm" />
    </Field>
  );
}
