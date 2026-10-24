"use server";

import { eq, not } from "drizzle-orm";
import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { employmentType, experiences, experienceSkills } from "@/db/schema";
import {
  checkbox,
  deleteFiles,
  type FormState,
  ids,
  optionalMonth,
  optionalText,
  optionalUrl,
  requiredMonth,
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

const schema = z
  .object({
    companyName: requiredText("Company", 100),
    role: requiredText("Role", 100),
    employmentType: z.enum(employmentType.enumValues, { error: "Pick a type." }),
    location: optionalText(100),
    startDate: requiredMonth("Start month"),
    endDate: optionalMonth,
    companyUrl: optionalUrl,
    sortOrder,
    isVisible: checkbox,
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    path: ["endDate"],
    message: "End month can't be before the start month.",
  });

export async function saveExperience(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);
  // One bullet point per line
  const highlights = splitList(formData.get("highlights"), /\r?\n/).map((line) => line.replace(/^[-•*]\s*/, ""));
  const skillIds = ids(formData, "skillIds");

  const current = id ? await db.query.experiences.findFirst({ where: eq(experiences.id, id) }) : undefined;
  if (id && !current) return { error: "This experience no longer exists." };

  let logo;
  try {
    logo = await resolveFile(formData, "companyLogo", "companies", IMAGE_TYPES, current?.companyLogoKey ?? null);
  } catch (error) {
    return uploadErrorState(error);
  }

  const values = { ...parsed.data, highlights, companyLogoKey: logo.key };
  try {
    await db.transaction(async (tx) => {
      if (id) {
        await tx.update(experiences).set(values).where(eq(experiences.id, id));
        await tx.delete(experienceSkills).where(eq(experienceSkills.experienceId, id));
      }
      const experienceId =
        id ?? (await tx.insert(experiences).values(values).returning({ id: experiences.id }))[0].id;
      if (skillIds.length > 0) {
        await tx.insert(experienceSkills).values(skillIds.map((skillId) => ({ experienceId, skillId })));
      }
    });
  } catch (error) {
    await deleteFiles(logo.uploaded);
    throw error;
  }

  after(() => deleteFiles(logo.staleKey));
  updateTag(PORTFOLIO_TAG);
  redirect("/admin/experience");
}

export async function toggleExperience(id: number) {
  await requireAdmin();
  await db.update(experiences).set({ isVisible: not(experiences.isVisible) }).where(eq(experiences.id, id));
  updateTag(PORTFOLIO_TAG);
  refresh();
}

export async function deleteExperience(id: number) {
  await requireAdmin();
  const [deleted] = await db
    .delete(experiences)
    .where(eq(experiences.id, id))
    .returning({ companyLogoKey: experiences.companyLogoKey });
  after(() => deleteFiles(deleted?.companyLogoKey));
  updateTag(PORTFOLIO_TAG);
  refresh();
}
