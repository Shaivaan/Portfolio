import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { parseId } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/auth/dal";
import { SkillForm } from "../skill-form";

export default async function EditSkillPage({ params }: PageProps<"/admin/skills/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  const skill = id ? await db.query.skills.findFirst({ where: eq(skills.id, id) }) : undefined;
  if (!skill) notFound();

  return (
    <>
      <PageHeader title={`Edit ${skill.name}`} backHref="/admin/skills" />
      <SkillForm skill={skill} />
    </>
  );
}
