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
import { type experiences, skills } from "@/db/schema";
import { toMonthInput } from "@/lib/admin/form";
import { employmentTypeLabels, toOptions } from "@/lib/labels";
import { fileUrl } from "@/lib/storage";
import { saveExperience } from "./actions";

type Props = {
  experience?: typeof experiences.$inferSelect;
  skillIds?: number[];
};

export async function ExperienceForm({ experience, skillIds = [] }: Props) {
  const allSkills = await db
    .select({ id: skills.id, name: skills.name })
    .from(skills)
    .orderBy(asc(skills.sortOrder), asc(skills.name));

  return (
    <ActionForm action={saveExperience.bind(null, experience?.id ?? null)} cancelHref="/admin/experience">
      <TextField name="companyName" label="Company" required defaultValue={experience?.companyName} />
      <TextField
        name="role"
        label="Role"
        required
        defaultValue={experience?.role}
        placeholder="Software Engineer"
      />
      <SelectField
        name="employmentType"
        label="Type"
        options={toOptions(employmentTypeLabels)}
        defaultValue={experience?.employmentType ?? "full_time"}
      />
      <TextField name="location" label="Location" defaultValue={experience?.location} placeholder="Bengaluru · Hybrid" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          name="startDate"
          label="From"
          type="month"
          required
          defaultValue={toMonthInput(experience?.startDate)}
        />
        <TextField
          name="endDate"
          label="To"
          type="month"
          defaultValue={toMonthInput(experience?.endDate)}
          hint="Leave empty if you still work here."
        />
      </div>
      <TextAreaField
        name="highlights"
        label="What you did"
        rows={6}
        defaultValue={experience?.highlights.join("\n")}
        placeholder={"Built the payments API used by 50k users\nCut page load time by 40%"}
        hint="One point per line."
      />
      <CheckboxGroup
        name="skillIds"
        label="Tech stack"
        options={allSkills.map((skill) => ({ value: skill.id, label: skill.name }))}
        defaultValues={skillIds}
        hint="Add skills first (Skills page) to pick them here."
      />
      <TextField
        name="companyUrl"
        label="Company website"
        type="url"
        defaultValue={experience?.companyUrl}
        placeholder="https://"
      />
      <FileField
        name="companyLogo"
        label="Company logo"
        currentUrl={experience?.companyLogoKey ? fileUrl(experience.companyLogoKey) : null}
        hint="Optional."
      />
      <TextField
        name="sortOrder"
        label="Order"
        type="number"
        defaultValue={experience?.sortOrder ?? 0}
        hint="Lower numbers come first. Ties are shown newest first."
      />
      <CheckboxField name="isVisible" label="Visible on the portfolio" defaultChecked={experience?.isVisible ?? true} />
    </ActionForm>
  );
}
