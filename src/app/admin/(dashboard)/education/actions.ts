"use server";

import { eq, not } from "drizzle-orm";
import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { education } from "@/db/schema";
import {
  checkbox,
  type FormState,
  optionalMonth,
  optionalText,
  requiredMonth,
  requiredText,
  sortOrder,
  validationError,
} from "@/lib/admin/form";
import { requireAdmin } from "@/lib/auth/dal";
import { PORTFOLIO_TAG } from "@/lib/cache";

const schema = z
  .object({
    institution: requiredText("Institution", 150),
    degree: requiredText("Degree", 100),
    fieldOfStudy: optionalText(100),
    location: optionalText(100),
    startDate: requiredMonth("Start month"),
    endDate: optionalMonth,
    grade: optionalText(50),
    sortOrder,
    isVisible: checkbox,
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    path: ["endDate"],
    message: "End month can't be before the start month.",
  });

export async function saveEducation(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  if (id) {
    const updated = await db.update(education).set(parsed.data).where(eq(education.id, id)).returning({ id: education.id });
    if (updated.length === 0) return { error: "This entry no longer exists." };
  } else {
    await db.insert(education).values(parsed.data);
  }

  updateTag(PORTFOLIO_TAG);
  redirect("/admin/education");
}

export async function toggleEducation(id: number) {
  await requireAdmin();
  await db.update(education).set({ isVisible: not(education.isVisible) }).where(eq(education.id, id));
  updateTag(PORTFOLIO_TAG);
  refresh();
}

export async function deleteEducation(id: number) {
  await requireAdmin();
  await db.delete(education).where(eq(education.id, id));
  updateTag(PORTFOLIO_TAG);
  refresh();
}
