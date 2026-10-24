import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { parseId } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/auth/dal";
import { ProjectForm } from "../project-form";

export default async function EditProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  const project = id
    ? await db.query.projects.findFirst({ where: eq(projects.id, id), with: { projectSkills: true } })
    : undefined;
  if (!project) notFound();

  const { projectSkills, ...fields } = project;
  return (
    <>
      <PageHeader title={`Edit ${project.name}`} backHref="/admin/projects" />
      <ProjectForm project={fields} skillIds={projectSkills.map((link) => link.skillId)} />
    </>
  );
}
