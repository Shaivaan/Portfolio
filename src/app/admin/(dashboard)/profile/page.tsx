import { ActionForm } from "@/components/admin/action-form";
import { CheckboxField, FileField, TextAreaField, TextField } from "@/components/admin/fields";
import { PageHeader } from "@/components/admin/page-header";
import { db } from "@/db";
import { profile } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { fileUrl } from "@/lib/storage";
import { saveProfile } from "./actions";

export default async function ProfilePage() {
  await requireAdmin();
  const [current] = await db.select().from(profile).limit(1);

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your name, intro and contact details, shown at the top of the portfolio."
      />
      <ActionForm action={saveProfile}>
        <TextField name="name" label="Name" required defaultValue={current?.name} />
        <TextField
          name="headline"
          label="Headline"
          required
          defaultValue={current?.headline}
          placeholder="Full Stack Developer · Agentic AI"
          hint="One line shown under your name."
        />
        <TextAreaField name="bio" label="About me" rows={6} defaultValue={current?.bio} />
        <TextField
          name="focusAreas"
          label="Focus areas"
          defaultValue={current?.focusAreas.join(", ")}
          placeholder="Frontend, Backend, Agentic AI"
          hint="Comma separated."
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          required
          defaultValue={current?.email}
          hint="Shown publicly so people can contact you."
        />
        <TextField name="location" label="Location" defaultValue={current?.location} placeholder="Bengaluru, India" />
        <FileField
          name="photo"
          label="Photo"
          currentUrl={current?.photoKey ? fileUrl(current.photoKey) : null}
          hint="JPG, PNG, WebP, AVIF, GIF or SVG, up to 4 MB."
        />
        <FileField
          name="resume"
          label="Resume"
          kind="pdf"
          currentUrl={current?.resumeKey ? fileUrl(current.resumeKey) : null}
          hint="PDF, up to 4 MB."
        />
        <CheckboxField
          name="openToWork"
          label="Open to work"
          hint="Shows an “Available for opportunities” badge."
          defaultChecked={current?.openToWork}
        />
      </ActionForm>
    </>
  );
}
