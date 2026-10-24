import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { education } from "@/db/schema";
import { parseId } from "@/lib/admin/form";
import { requireAdmin } from "@/lib/auth/dal";
import { EducationForm } from "../education-form";

export default async function EditEducationPage({ params }: PageProps<"/admin/education/[id]">) {
  await requireAdmin();
  const id = parseId((await params).id);
  const entry = id ? await db.query.education.findFirst({ where: eq(education.id, id) }) : undefined;
  if (!entry) notFound();

  return (
    <>
      <PageHeader title={`Edit ${entry.degree}`} backHref="/admin/education" />
      <EducationForm entry={entry} />
    </>
  );
}
