"use server";

import { eq, not } from "drizzle-orm";
import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { projectSkills, projects, projectType } from "@/db/schema";
import {
  checkbox,
  deleteFiles,
  type FormState,
  ids,
  isUniqueViolation,
  optionalText,
  optionalUrl,
  requiredText,
  resolveFile,
  slugify,
  sortOrder,
  uploadErrorState,
  validationError,
} from "@/lib/admin/form";
import { requireAdmin } from "@/lib/auth/dal";
import { PORTFOLIO_TAG } from "@/lib/cache";
import { IMAGE_TYPES } from "@/lib/storage";

const schema = z.object({
  name: requiredText("Name", 100),
  slug: z
    .string()
    .trim()
    .nullish()
    .refine((value) => !value || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value), "Use lowercase letters, numbers and dashes."),
  shortDescription: requiredText("Short description", 200),
  description: optionalText(5000),
  type: z.enum(projectType.enumValues, { error: "Pick a type." }),
  liveUrl: optionalUrl,
  githubUrl: optionalUrl,
  featured: checkbox,
  sortOrder,
  isVisible: checkbox,
});

export async function saveProject(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);
  const slug = parsed.data.slug || slugify(parsed.data.name);
  if (!slug) {
    return { error: "Please fix the highlighted fields.", fieldErrors: { slug: "Enter a slug, e.g. chat-app." } };
  }
  const skillIds = ids(formData, "skillIds");

  const current = id ? await db.query.projects.findFirst({ where: eq(projects.id, id) }) : undefined;
  if (id && !current) return { error: "This project no longer exists." };

  let image;
  try {
    image = await resolveFile(formData, "image", "projects", IMAGE_TYPES, current?.imageKey ?? null);
  } catch (error) {
    return uploadErrorState(error);
  }

  const values = { ...parsed.data, slug, imageKey: image.key };
  try {
    // Project row and its tech stack are saved together or not at all
    await db.transaction(async (tx) => {
      if (id) {
        await tx.update(projects).set(values).where(eq(projects.id, id));
        await tx.delete(projectSkills).where(eq(projectSkills.projectId, id));
      }
      const projectId =
        id ?? (await tx.insert(projects).values(values).returning({ id: projects.id }))[0].id;
      if (skillIds.length > 0) {
        await tx.insert(projectSkills).values(skillIds.map((skillId) => ({ projectId, skillId })));
      }
    });
  } catch (error) {
    await deleteFiles(image.uploaded);
    if (isUniqueViolation(error)) {
      return { error: "Please fix the highlighted fields.", fieldErrors: { slug: "Another project already uses this slug." } };
    }
    throw error;
  }

  after(() => deleteFiles(image.staleKey));
  updateTag(PORTFOLIO_TAG);
  redirect("/admin/projects");
}

export async function toggleProject(id: number) {
  await requireAdmin();
  await db.update(projects).set({ isVisible: not(projects.isVisible) }).where(eq(projects.id, id));
  updateTag(PORTFOLIO_TAG);
  refresh();
}

export async function deleteProject(id: number) {
  await requireAdmin();
  const [deleted] = await db.delete(projects).where(eq(projects.id, id)).returning({ imageKey: projects.imageKey });
  after(() => deleteFiles(deleted?.imageKey));
  updateTag(PORTFOLIO_TAG);
  refresh();
}
