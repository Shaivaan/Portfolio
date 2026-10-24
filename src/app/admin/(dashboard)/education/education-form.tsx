import { ActionForm } from "@/components/admin/action-form";
import { CheckboxField, TextField } from "@/components/admin/fields";
import type { education } from "@/db/schema";
import { toMonthInput } from "@/lib/admin/form";
import { saveEducation } from "./actions";

export function EducationForm({ entry }: { entry?: typeof education.$inferSelect }) {
  return (
    <ActionForm action={saveEducation.bind(null, entry?.id ?? null)} cancelHref="/admin/education">
      <TextField name="institution" label="Institution" required defaultValue={entry?.institution} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField name="degree" label="Degree" required defaultValue={entry?.degree} placeholder="B.Tech" />
        <TextField
          name="fieldOfStudy"
          label="Field of study"
          defaultValue={entry?.fieldOfStudy}
          placeholder="Computer Science"
        />
      </div>
      <TextField name="location" label="Location" defaultValue={entry?.location} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField name="startDate" label="From" type="month" required defaultValue={toMonthInput(entry?.startDate)} />
        <TextField
          name="endDate"
          label="To"
          type="month"
          defaultValue={toMonthInput(entry?.endDate)}
          hint="Leave empty if you're still studying."
        />
      </div>
      <TextField name="grade" label="Grade" defaultValue={entry?.grade} placeholder="8.5 CGPA" />
      <TextField
        name="sortOrder"
        label="Order"
        type="number"
        defaultValue={entry?.sortOrder ?? 0}
        hint="Lower numbers come first."
      />
      <CheckboxField name="isVisible" label="Visible on the portfolio" defaultChecked={entry?.isVisible ?? true} />
    </ActionForm>
  );
}
