import { ActionForm } from "@/components/admin/action-form";
import { CheckboxField, FileField, SelectField, TextField } from "@/components/admin/fields";
import type { skills } from "@/db/schema";
import { skillCategoryLabels, toOptions } from "@/lib/labels";
import { fileUrl } from "@/lib/storage";
import { saveSkill } from "./actions";

export function SkillForm({ skill }: { skill?: typeof skills.$inferSelect }) {
  return (
    <ActionForm action={saveSkill.bind(null, skill?.id ?? null)} cancelHref="/admin/skills">
      <TextField name="name" label="Name" required defaultValue={skill?.name} placeholder="React" />
      <SelectField
        name="category"
        label="Category"
        options={toOptions(skillCategoryLabels)}
        defaultValue={skill?.category ?? "frontend"}
      />
      <FileField
        name="icon"
        label="Icon"
        currentUrl={skill?.iconKey ? fileUrl(skill.iconKey) : null}
        hint="Optional. SVG or PNG works best."
      />
      <TextField
        name="sortOrder"
        label="Order"
        type="number"
        defaultValue={skill?.sortOrder ?? 0}
        hint="Lower numbers come first."
      />
      <CheckboxField name="isVisible" label="Visible on the portfolio" defaultChecked={skill?.isVisible ?? true} />
    </ActionForm>
  );
}
