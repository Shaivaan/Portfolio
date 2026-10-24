"use server";

import { eq, not } from "drizzle-orm";
import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { skillCategory, skills } from "@/db/schema";
import {
  checkbox,
  deleteFiles,
  type FormState,
  isUniqueViolation,
  requiredText,
  resolveFile,
  sortOrder,
  splitList,
  uploadErrorState,
  validationError,
} from "@/lib/admin/form";
import { requireAdmin } from "@/lib/auth/dal";
import { PORTFOLIO_TAG } from "@/lib/cache";
import { IMAGE_TYPES } from "@/lib/storage";

const schema = z.object({
  name: requiredText("Name", 60),
  category: z.enum(skillCategory.enumValues, { error: "Pick a category." }),
  sortOrder,
  isVisible: checkbox,
});

export async function saveSkill(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  const current = id ? await db.query.skills.findFirst({ where: eq(skills.id, id) }) : undefined;
  if (id && !current) return { error: "This skill no longer exists." };

  let icon;
  try {
    icon = await resolveFile(formData, "icon", "skills", IMAGE_TYPES, current?.iconKey ?? null);
  } catch (error) {
    return uploadErrorState(error);
  }

  const values = { ...parsed.data, iconKey: icon.key };
  try {
    if (id) {
      await db.update(skills).set(values).where(eq(skills.id, id));
    } else {
      await db.insert(skills).values(values);
    }
  } catch (error) {
    await deleteFiles(icon.uploaded);
    if (isUniqueViolation(error)) {
      return { error: "Please fix the highlighted fields.", fieldErrors: { name: "A skill with this name already exists." } };
    }
    throw error;
  }

  after(() => deleteFiles(icon.staleKey));
  updateTag(PORTFOLIO_TAG);
  redirect("/admin/skills");
}

/** Quick add: many skill names at once (comma or newline separated), all in one category */
export async function addSkills(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const category = z.enum(skillCategory.enumValues).safeParse(formData.get("category"));
  if (!category.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: { category: "Pick a category." } };
  }
  const names = splitList(formData.get("names"), /[,\n]/);
  if (names.length === 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors: { names: "Enter at least one skill." } };
  }
  if (names.length > 100 || names.some((name) => name.length > 60)) {
    return { error: "Please fix the highlighted fields.", fieldErrors: { names: "Up to 100 skills, each at most 60 characters." } };
  }

  // Skip names that already exist, ignoring case ("react" = "React")
  const existing = new Set((await db.select({ name: skills.name }).from(skills)).map((row) => row.name.toLowerCase()));
  const toAdd: string[] = [];
  const skipped: string[] = [];
  for (const name of names) {
    const key = name.toLowerCase();
    if (existing.has(key)) {
      skipped.push(name);
    } else {
      existing.add(key);
      toAdd.push(name);
    }
  }

  if (toAdd.length > 0) {
    await db
      .insert(skills)
      .values(toAdd.map((name) => ({ name, category: category.data })))
      .onConflictDoNothing({ target: skills.name });
    updateTag(PORTFOLIO_TAG);
    refresh();
  }

  const added = `Added ${toAdd.length} skill${toAdd.length === 1 ? "" : "s"}.`;
  return { message: skipped.length > 0 ? `${added} Skipped (already added): ${skipped.join(", ")}.` : added };
}

export async function toggleSkill(id: number) {
  await requireAdmin();
  await db.update(skills).set({ isVisible: not(skills.isVisible) }).where(eq(skills.id, id));
  updateTag(PORTFOLIO_TAG);
  refresh();
}

export async function deleteSkill(id: number) {
  await requireAdmin();
  // Links in project_skills / experience_skills are removed by ON DELETE CASCADE
  const [deleted] = await db.delete(skills).where(eq(skills.id, id)).returning({ iconKey: skills.iconKey });
  after(() => deleteFiles(deleted?.iconKey));
  updateTag(PORTFOLIO_TAG);
  refresh();
}
