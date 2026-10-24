import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth/dal";
import { SocialLinkForm } from "../social-link-form";

export default async function NewSocialLinkPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New social link" backHref="/admin/social-links" />
      <SocialLinkForm />
    </>
  );
}
