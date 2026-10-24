import { asc } from "drizzle-orm";
import { HiddenBadge, ListTable, PageHeader } from "@/components/admin/page-header";
import { RowActions } from "@/components/admin/row-actions";
import { db } from "@/db";
import { socialLinks } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { socialPlatformLabels } from "@/lib/labels";
import { deleteSocialLink, toggleSocialLink } from "./actions";

export default async function SocialLinksPage() {
  await requireAdmin();
  const rows = await db.select().from(socialLinks).orderBy(asc(socialLinks.sortOrder), asc(socialLinks.id));

  return (
    <>
      <PageHeader
        title="Social links"
        description="GitHub, LinkedIn, LeetCode and other profiles."
        newHref="/admin/social-links/new"
      />
      <ListTable columns={["Platform", "URL", "Order"]} empty={rows.length === 0}>
        {rows.map((link) => {
          const platform = socialPlatformLabels[link.platform] ?? link.platform;
          return (
            <tr key={link.id}>
              <td className="px-4 py-3 font-medium">
                {platform}
                <HiddenBadge visible={link.isVisible} />
              </td>
              <td className="max-w-xs truncate px-4 py-3">
                <a href={link.url} target="_blank" rel="noreferrer" className="hover:underline">
                  {link.url}
                </a>
              </td>
              <td className="px-4 py-3">{link.sortOrder}</td>
              <td className="px-4 py-3">
                <RowActions
                  editHref={`/admin/social-links/${link.id}`}
                  label={platform}
                  isVisible={link.isVisible}
                  onToggleVisible={toggleSocialLink.bind(null, link.id)}
                  onDelete={deleteSocialLink.bind(null, link.id)}
                />
              </td>
            </tr>
          );
        })}
      </ListTable>
    </>
  );
}
