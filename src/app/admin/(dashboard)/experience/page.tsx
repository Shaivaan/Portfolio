import { asc, desc } from "drizzle-orm";
import { HiddenBadge, ListTable, PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { db } from "@/db";
import { experiences } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { employmentTypeLabels, formatMonth } from "@/lib/labels";
import { deleteExperience, toggleExperience } from "./actions";

export default async function ExperiencePage() {
  await requireAdmin();
  const rows = await db
    .select()
    .from(experiences)
    .orderBy(asc(experiences.sortOrder), desc(experiences.startDate));

  return (
    <>
      <PageHeader title="Experience" newHref="/admin/experience/new" />
      <ListTable columns={["Role", "Dates", "Order"]} empty={rows.length === 0}>
        {rows.map((experience) => (
          <tr key={experience.id}>
            <td className="px-4 py-3">
              <span className="font-medium">{experience.role}</span>
              <HiddenBadge visible={experience.isVisible} />
              <p className="text-xs text-neutral-500">
                {experience.companyName} · {employmentTypeLabels[experience.employmentType]}
              </p>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              {formatMonth(experience.startDate)} – {formatMonth(experience.endDate)}
            </td>
            <td className="px-4 py-3">{experience.sortOrder}</td>
            <td className="px-4 py-3">
              <RowActions
                editHref={`/admin/experience/${experience.id}`}
                label={`${experience.role} at ${experience.companyName}`}
                isVisible={experience.isVisible}
                onToggleVisible={toggleExperience.bind(null, experience.id)}
                onDelete={deleteExperience.bind(null, experience.id)}
              />
            </td>
          </tr>
        ))}
      </ListTable>
    </>
  );
}
