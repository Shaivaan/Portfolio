import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth/dal";
import { SkillForm } from "../skill-form";

export default async function NewSkillPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New skill" backHref="/admin/skills" />
      <SkillForm />
    </>
  );
}
