import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth/dal";
import { ProjectForm } from "../project-form";

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New project" backHref="/admin/projects" />
      <ProjectForm />
    </>
  );
}
