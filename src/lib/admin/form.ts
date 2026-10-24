import "server-only";
import { z } from "zod";
import { deleteFile, UploadError, uploadFile } from "@/lib/storage";

// What admin Server Actions return to <ActionForm>
export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  message?: string;
};

export function validationError(error: z.ZodError): FormState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "");
    fieldErrors[field] ??= issue.message;
  }
  return { error: "Please fix the highlighted fields.", fieldErrors };
}

export function uploadErrorState(error: unknown): FormState {
  if (error instanceof UploadError) return { error: error.message };
  throw error;
}

// Reusable field schemas. FormData values arrive as strings (or null when absent).

export const requiredText = (label: string, max = 200) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be at most ${max} characters.`);

export const optionalText = (max = 5000) =>
  z
    .string()
    .trim()
    .max(max, `Must be at most ${max} characters.`)
    .nullish()
    .transform((value) => value || null);

export const optionalUrl = z
  .string()
  .trim()
  .nullish()
  .refine((value) => !value || /^https?:\/\/\S+$/.test(value), "Enter a full URL starting with https://")
  .transform((value) => value || null);

export const checkbox = z.unknown().transform((value) => value === "on");

export const sortOrder = z.coerce
  .number({ error: "Order must be a number." })
  .int("Order must be a whole number.")
  .min(0, "Order can't be negative.")
  .max(9999, "Order is too large.");

// <input type="month"> sends "2024-03"; stored as the first day of that month
const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;
export const requiredMonth = (label: string) =>
  z
    .string({ error: `${label} is required.` })
    .regex(monthPattern, `${label} is required.`)
    .transform((value) => `${value}-01`);
export const optionalMonth = z
  .string()
  .nullish()
  .refine((value) => !value || monthPattern.test(value), "Pick a month.")
  .transform((value) => (value ? `${value}-01` : null));

/** "2024-03-01" -> "2024-03" for <input type="month"> */
export function toMonthInput(date: string | null | undefined) {
  return date ? date.slice(0, 7) : "";
}

// Text split into a clean list: one item per line (or per comma)
export function splitList(value: FormDataEntryValue | null, separator: RegExp) {
  if (typeof value !== "string") return [];
  const items = value.split(separator).map((item) => item.trim()).filter(Boolean);
  return [...new Set(items)];
}

export function ids(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .map(Number)
    .filter((id) => Number.isInteger(id) && id > 0);
}

/**
 * Handles a file input plus its "<name>Remove" checkbox.
 * Uploads a new file if one was chosen. Returns the key to store, and the old key,
 * which the caller deletes only after the DB write succeeds.
 */
export async function resolveFile(
  formData: FormData,
  field: string,
  folder: string,
  allowedTypes: Record<string, string>,
  currentKey: string | null,
) {
  const file = formData.get(field);
  if (file instanceof File && file.size > 0) {
    const key = await uploadFile(file, folder, allowedTypes);
    return { key, staleKey: currentKey, uploaded: key };
  }
  if (formData.get(`${field}Remove`) === "on") {
    return { key: null, staleKey: currentKey, uploaded: null };
  }
  return { key: currentKey, staleKey: null, uploaded: null };
}

/** Deletes storage objects, skipping nulls: stale files after a save, or uploads whose save failed */
export async function deleteFiles(...keys: (string | null | undefined)[]) {
  await Promise.all(keys.map((key) => deleteFile(key)));
}

export function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Postgres unique-constraint violation (e.g. a skill name that already exists) */
export function isUniqueViolation(error: unknown) {
  const code = (error as { code?: string; cause?: { code?: string } })?.code
    ?? (error as { cause?: { code?: string } })?.cause?.code;
  return code === "23505";
}

/** "My Chat App!" -> "my-chat-app" */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
