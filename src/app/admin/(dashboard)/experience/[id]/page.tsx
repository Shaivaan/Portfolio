import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { experiences } from "@/db/schema";
import { parseId } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/auth/dal";
import { ExperienceForm } from "../experience-form";

export default async function EditExperiencePage({ params }: PageProps<"/admin/experience/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  const experience = id
    ? await db.query.experiences.findFirst({ where: eq(experiences.id, id), with: { experienceSkills: true } })
    : undefined;
  if (!experience) notFound();

  const { experienceSkills, ...fields } = experience;
  return (
    <>
      <PageHeader title={`Edit ${experience.role} at ${experience.companyName}`} backHref="/admin/experience" />
      <ExperienceForm experience={fields} skillIds={experienceSkills.map((link) => link.skillId)} />
    </>
  );
}
