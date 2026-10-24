import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { socialLinks } from "@/db/schema";
import { parseId } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/auth/dal";
import { socialPlatformLabels } from "@/lib/labels";
import { SocialLinkForm } from "../social-link-form";

export default async function EditSocialLinkPage({ params }: PageProps<"/admin/social-links/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  const link = id ? await db.query.socialLinks.findFirst({ where: eq(socialLinks.id, id) }) : undefined;
  if (!link) notFound();

  return (
    <>
      <PageHeader title={`Edit ${socialPlatformLabels[link.platform] ?? link.platform}`} backHref="/admin/social-links" />
      <SocialLinkForm link={link} />
    </>
  );
}
