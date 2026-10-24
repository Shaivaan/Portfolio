import { asc, desc } from "drizzle-orm";
import { HiddenBadge, ListTable, PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { db } from "@/db";
import { education } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { formatMonth } from "@/lib/labels";
import { deleteEducation, toggleEducation } from "./actions";

export default async function EducationPage() {
  await requireAdmin();
  const rows = await db.select().from(education).orderBy(asc(education.sortOrder), desc(education.startDate));

  return (
    <>
      <PageHeader title="Education" newHref="/admin/education/new" />
      <ListTable columns={["Degree", "Dates", "Order"]} empty={rows.length === 0}>
        {rows.map((entry) => (
          <tr key={entry.id}>
            <td className="px-4 py-3">
              <span className="font-medium">
                {entry.degree}
                {entry.fieldOfStudy && `, ${entry.fieldOfStudy}`}
              </span>
              <HiddenBadge visible={entry.isVisible} />
              <p className="text-xs text-neutral-500">{entry.institution}</p>
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
              {formatMonth(entry.startDate)} – {formatMonth(entry.endDate)}
            </td>
            <td className="px-4 py-3">{entry.sortOrder}</td>
            <td className="px-4 py-3">
              <RowActions
                editHref={`/admin/education/${entry.id}`}
                label={`${entry.degree} at ${entry.institution}`}
                isVisible={entry.isVisible}
                onToggleVisible={toggleEducation.bind(null, entry.id)}
                onDelete={deleteEducation.bind(null, entry.id)}
              />
            </td>
          </tr>
        ))}
      </ListTable>
    </>
  );
}
