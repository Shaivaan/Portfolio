import { asc } from "drizzle-orm";
import { ActionForm } from "@/components/admin/action-form";
import { SelectField, TextAreaField } from "@/components/admin/fields";
import { HiddenBadge, ListTable, PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { skillCategoryLabels, toOptions } from "@/lib/labels";
import { addSkills, deleteSkill, toggleSkill } from "./actions";

export default async function SkillsPage() {
  await requireAdmin();
  const rows = await db.select().from(skills).orderBy(asc(skills.category), asc(skills.sortOrder), asc(skills.name));

  return (
    <>
      <PageHeader
        title="Skills"
        description="Shown in the Skills section and used as the tech stack of projects and experience."
        newHref="/admin/skills/new"
      />
      <section className="mb-8 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
        <h2 className="mb-3 font-medium">Quick add</h2>
        <ActionForm action={addSkills} submitLabel="Add skills" pendingLabel="Adding…" resetOnSuccess className="">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_200px]">
            <TextAreaField
              name="names"
              label="Skills"
              rows={3}
              placeholder="React, Next.js, TypeScript, Tailwind CSS"
              hint="Separate with commas or new lines. Ones you already added are skipped."
            />
            <SelectField name="category" label="Category" options={toOptions(skillCategoryLabels)} defaultValue="frontend" />
          </div>
        </ActionForm>
        <p className="mt-3 text-xs text-neutral-500">Use Edit on a skill to add an icon or change its order.</p>
      </section>
      <ListTable columns={["Name", "Category", "Order"]} empty={rows.length === 0}>
        {rows.map((skill) => (
          <tr key={skill.id}>
            <td className="px-4 py-3 font-medium">
              {skill.name}
              <HiddenBadge visible={skill.isVisible} />
            </td>
            <td className="px-4 py-3">{skillCategoryLabels[skill.category]}</td>
            <td className="px-4 py-3">{skill.sortOrder}</td>
            <td className="px-4 py-3">
              <RowActions
                editHref={`/admin/skills/${skill.id}`}
                label={skill.name}
                isVisible={skill.isVisible}
                onToggleVisible={toggleSkill.bind(null, skill.id)}
                onDelete={deleteSkill.bind(null, skill.id)}
              />
            </td>
          </tr>
        ))}
      </ListTable>
    </>
  );
}
