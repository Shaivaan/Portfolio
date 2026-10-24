import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth/dal";
import { ExperienceForm } from "../experience-form";

export default async function NewExperiencePage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New experience" backHref="/admin/experience" />
      <ExperienceForm />
    </>
  );
}
