import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth/dal";
import { EducationForm } from "../education-form";

export default async function NewEducationPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New education" backHref="/admin/education" />
      <EducationForm />
    </>
  );
}
