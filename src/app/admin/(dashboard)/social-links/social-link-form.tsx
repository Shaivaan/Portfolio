import { ActionForm } from "@/components/admin/action-form";
import { CheckboxField, SelectField, TextField } from "@/components/admin/fields";
import type { socialLinks } from "@/db/schema";
import { socialPlatformLabels, toOptions } from "@/lib/labels";
import { saveSocialLink } from "./actions";

export function SocialLinkForm({ link }: { link?: typeof socialLinks.$inferSelect }) {
  return (
    <ActionForm action={saveSocialLink.bind(null, link?.id ?? null)} cancelHref="/admin/social-links">
      <SelectField
        name="platform"
        label="Platform"
        options={toOptions(socialPlatformLabels)}
        defaultValue={link?.platform ?? "github"}
      />
      <TextField
        name="url"
        label="URL"
        type="url"
        required
        defaultValue={link?.url}
        placeholder="https://github.com/your-username"
      />
      <TextField
        name="sortOrder"
        label="Order"
        type="number"
        defaultValue={link?.sortOrder ?? 0}
        hint="Lower numbers come first."
      />
      <CheckboxField name="isVisible" label="Visible on the portfolio" defaultChecked={link?.isVisible ?? true} />
    </ActionForm>
  );
}
