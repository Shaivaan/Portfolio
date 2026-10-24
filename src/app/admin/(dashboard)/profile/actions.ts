"use server";

import { eq } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { after } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { profile } from "@/db/schema";
import {
  checkbox,
  deleteFiles,
  type FormState,
  optionalText,
  requiredText,
  resolveFile,
  splitList,
  uploadErrorState,
  validationError,
} from "@/lib/admin/form";
import { requireAdmin } from "@/lib/auth/dal";
import { PORTFOLIO_TAG } from "@/lib/cache";
import { IMAGE_TYPES, PDF_TYPES } from "@/lib/storage";

const schema = z.object({
  name: requiredText("Name", 100),
  headline: requiredText("Headline", 160),
  bio: optionalText(3000),
  email: z.email({ error: "Enter a valid email address." }),
  location: optionalText(100),
  openToWork: checkbox,
});

export async function saveProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  const focusAreas = splitList(formData.get("focusAreas"), /[,\n]/);
  if (focusAreas.length > 12 || focusAreas.some((area) => area.length > 40)) {
    return { error: "Please fix the highlighted fields.", fieldErrors: { focusAreas: "Use up to 12 short areas." } };
  }

  const [current] = await db.select().from(profile).limit(1);

  let photo, resume;
  try {
    photo = await resolveFile(formData, "photo", "profile", IMAGE_TYPES, current?.photoKey ?? null);
    resume = await resolveFile(formData, "resume", "resume", PDF_TYPES, current?.resumeKey ?? null);
  } catch (error) {
    await deleteFiles(photo?.uploaded);
    return uploadErrorState(error);
  }

  const values = { ...parsed.data, focusAreas, photoKey: photo.key, resumeKey: resume.key };
  try {
    if (current) {
      await db.update(profile).set(values).where(eq(profile.id, current.id));
    } else {
      await db.insert(profile).values(values);
    }
  } catch (error) {
    await deleteFiles(photo.uploaded, resume.uploaded);
    throw error;
  }

  // Old files are removed after the response is sent, so saving doesn't wait on storage
  after(() => deleteFiles(photo.staleKey, resume.staleKey));
  updateTag(PORTFOLIO_TAG);
  refresh();
  return { message: "Profile saved." };
}
