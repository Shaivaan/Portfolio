import { asc, desc } from "drizzle-orm";
import { HiddenBadge, ListTable, PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { projectTypeLabels } from "@/lib/labels";
import { deleteProject, toggleProject } from "./actions";

export default async function ProjectsPage() {
  await requireAdmin();
  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder), desc(projects.createdAt));

  return (
    <>
      <PageHeader title="Projects" newHref="/admin/projects/new" />
      <ListTable columns={["Name", "Type", "Order"]} empty={rows.length === 0}>
        {rows.map((project) => (
          <tr key={project.id}>
            <td className="px-4 py-3">
              <span className="font-medium">{project.name}</span>
              {project.featured && <span className="ml-2 text-xs text-amber-600">★ featured</span>}
              <HiddenBadge visible={project.isVisible} />
              <p className="text-xs text-neutral-500">{project.shortDescription}</p>
            </td>
            <td className="px-4 py-3">{projectTypeLabels[project.type]}</td>
            <td className="px-4 py-3">{project.sortOrder}</td>
            <td className="px-4 py-3">
              <RowActions
                editHref={`/admin/projects/${project.id}`}
                label={project.name}
                isVisible={project.isVisible}
                onToggleVisible={toggleProject.bind(null, project.id)}
                onDelete={deleteProject.bind(null, project.id)}
              />
            </td>
          </tr>
        ))}
      </ListTable>
    </>
  );
}
