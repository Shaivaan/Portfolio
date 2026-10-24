import { asc } from "drizzle-orm";
import { ActionForm } from "@/components/admin/action-form";
import {
  CheckboxField,
  CheckboxGroup,
  FileField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/fields";
import { db } from "@/db";
import { type projects, skills } from "@/db/schema";
import { projectTypeLabels, toOptions } from "@/lib/labels";
import { fileUrl } from "@/lib/storage";
import { saveProject } from "./actions";

type Props = {
  project?: typeof projects.$inferSelect;
  skillIds?: number[];
};

export async function ProjectForm({ project, skillIds = [] }: Props) {
  const allSkills = await db
    .select({ id: skills.id, name: skills.name })
    .from(skills)
    .orderBy(asc(skills.sortOrder), asc(skills.name));

  return (
    <ActionForm action={saveProject.bind(null, project?.id ?? null)} cancelHref="/admin/projects">
      <TextField name="name" label="Name" required defaultValue={project?.name} />
      <TextField
        name="slug"
        label="Slug"
        defaultValue={project?.slug}
        placeholder="chat-app"
        hint="Used in the URL. Leave empty to generate it from the name."
      />
      <TextField
        name="shortDescription"
        label="Short description"
        required
        defaultValue={project?.shortDescription}
        hint="One line for the project card."
      />
      <TextAreaField name="description" label="Description" rows={6} defaultValue={project?.description} />
      <SelectField
        name="type"
        label="Type"
        options={toOptions(projectTypeLabels)}
        defaultValue={project?.type ?? "personal"}
      />
      <TextField
        name="liveUrl"
        label="Live URL"
        type="url"
        defaultValue={project?.liveUrl}
        placeholder="https://"
        hint="Leave empty for in-house apps."
      />
      <TextField name="githubUrl" label="GitHub URL" type="url" defaultValue={project?.githubUrl} placeholder="https://github.com/…" />
      <FileField
        name="image"
        label="Image"
        currentUrl={project?.imageKey ? fileUrl(project.imageKey) : null}
        hint="Screenshot or thumbnail, up to 4 MB."
      />
      <CheckboxGroup
        name="skillIds"
        label="Tech stack"
        options={allSkills.map((skill) => ({ value: skill.id, label: skill.name }))}
        defaultValues={skillIds}
        hint="Add skills first (Skills page) to pick them here."
      />
      <TextField
        name="sortOrder"
        label="Order"
        type="number"
        defaultValue={project?.sortOrder ?? 0}
        hint="Lower numbers come first."
      />
      <CheckboxField
        name="featured"
        label="Featured"
        hint="Highlight on the home page."
        defaultChecked={project?.featured}
      />
      <CheckboxField name="isVisible" label="Visible on the portfolio" defaultChecked={project?.isVisible ?? true} />
    </ActionForm>
  );
}
