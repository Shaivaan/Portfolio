"use server";

import { eq, not } from "drizzle-orm";
import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { socialLinks } from "@/db/schema";
import { checkbox, type FormState, sortOrder, validationError } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/auth/dal";
import { PORTFOLIO_TAG } from "@/lib/cache";
import { socialPlatformLabels } from "@/lib/labels";

const schema = z.object({
  platform: z.string().refine((value) => value in socialPlatformLabels, "Pick a platform."),
  url: z
    .string({ error: "URL is required." })
    .trim()
    .regex(/^https?:\/\/\S+$/, "Enter a full URL starting with https://")
    .max(500),
  sortOrder,
  isVisible: checkbox,
});

export async function saveSocialLink(id: number | null, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationError(parsed.error);

  if (id) {
    const updated = await db
      .update(socialLinks)
      .set(parsed.data)
      .where(eq(socialLinks.id, id))
      .returning({ id: socialLinks.id });
    if (updated.length === 0) return { error: "This link no longer exists." };
  } else {
    await db.insert(socialLinks).values(parsed.data);
  }

  updateTag(PORTFOLIO_TAG);
  redirect("/admin/social-links");
}

export async function toggleSocialLink(id: number) {
  await requireAdmin();
  await db.update(socialLinks).set({ isVisible: not(socialLinks.isVisible) }).where(eq(socialLinks.id, id));
  updateTag(PORTFOLIO_TAG);
  refresh();
}

export async function deleteSocialLink(id: number) {
  await requireAdmin();
  await db.delete(socialLinks).where(eq(socialLinks.id, id));
  updateTag(PORTFOLIO_TAG);
  refresh();
}
