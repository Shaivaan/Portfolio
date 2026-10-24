import Image from "next/image";
import { formatMonth, projectTypeLabels, skillCategoryLabels, socialPlatformLabels } from "@/lib/labels";
import type { Portfolio } from "@/lib/portfolio";
import { skillCategory } from "@/db/schema";
import { ThemeToggle } from "./theme-toggle";

type Profile = NonNullable<Portfolio["profile"]>;

const linkButton =
  "inline-flex items-center rounded-lg border border-border px-4 py-2.5 text-sm transition-colors hover:border-muted";

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="reveal scroll-mt-20 border-t border-border py-12">
      <h2 id={`${id}-title`} className="mb-8 text-sm font-semibold tracking-wider text-muted uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

type Chip = { name: string; iconUrl: string | null };

/** Skill pills; a skill's icon shows in front of its name when one was uploaded */
function Chips({ items, small = false }: { items: Chip[]; small?: boolean }) {
  if (items.length === 0) return null;
  const iconSize = small ? 12 : 16;
  return (
    <ul className={`flex flex-wrap ${small ? "gap-1.5" : "gap-2"}`}>
      {items.map((item) => (
        <li
          key={item.name}
          className={`inline-flex items-center rounded-full border border-border bg-chip ${small ? "gap-1 px-2.5 py-0.5 text-xs text-muted" : "gap-1.5 px-3 py-1.5 text-sm"}`}
        >
          {item.iconUrl && (
            // unoptimized: icons are tiny and often SVG, which the image optimizer doesn't process
            <Image src={item.iconUrl} alt="" width={iconSize} height={iconSize} unoptimized className="object-contain" />
          )}
          {item.name}
        </li>
      ))}
    </ul>
  );
}

/** Company logo, or the company's first letter in the same-sized box when there is none */
function CompanyLogo({ name, url }: { name: string; url: string | null }) {
  const box = "size-10 shrink-0 rounded-lg border border-border bg-chip";
  if (url) {
    return <Image src={url} alt="" width={40} height={40} unoptimized className={`${box} object-contain p-1`} />;
  }
  return (
    <span aria-hidden="true" className={`${box} flex items-center justify-center text-sm font-semibold text-muted`}>
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

function ExternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  );
}

export function SiteHeader({ name, sections }: { name: string; sections: { id: string; label: string }[] }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
        <a href="#top" className="font-semibold">
          {name}
        </a>
        <nav aria-label="Sections" className="flex items-center gap-6 text-sm">
          <ul className="hidden gap-6 sm:flex">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-muted transition-colors hover:text-foreground">
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export function Hero({ profile, socialLinks }: { profile: Profile; socialLinks: Portfolio["socialLinks"] }) {
  const meta = [profile.focusAreas.join(" · "), profile.location].filter(Boolean).join(" — ");
  return (
    <section id="top" className="fade-in flex flex-col gap-5 pt-16 pb-14 sm:pt-20">
      {profile.photoUrl && (
        <Image
          src={profile.photoUrl}
          alt={profile.name}
          width={88}
          height={88}
          priority
          className="size-22 rounded-full border border-border object-cover"
        />
      )}
      {profile.openToWork && (
        <p className="inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
          <span aria-hidden="true" className="size-2 rounded-full bg-green-500" />
          Open to opportunities
        </p>
      )}
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
      <p className="max-w-xl text-xl text-muted">{profile.headline}</p>
      {meta && <p className="text-sm text-muted">{meta}</p>}
      <div className="mt-2 flex flex-wrap gap-3">
        {profile.resumeUrl && (
          <ExternalLink
            href={profile.resumeUrl}
            className="inline-flex items-center rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90"
          >
            Resume
          </ExternalLink>
        )}
        {socialLinks.map((link) => (
          <ExternalLink key={link.id} href={link.url} className={linkButton}>
            {socialPlatformLabels[link.platform] ?? link.platform}
          </ExternalLink>
        ))}
      </div>
    </section>
  );
}

export function About({ bio }: { bio: string }) {
  return (
    <Section id="about" title="About">
      <div className="flex max-w-2xl flex-col gap-4 text-lg leading-relaxed">
        {bio.split(/\n+/).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}

export function Experience({ items }: { items: Portfolio["experiences"] }) {
  return (
    <Section id="experience" title="Experience">
      <ol className="flex flex-col gap-10">
        {items.map((item) => (
          <li key={item.id} className="grid gap-2 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6">
            <p className="text-sm text-muted sm:pt-0.5">
              {formatMonth(item.startDate)} — {formatMonth(item.endDate)}
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <CompanyLogo name={item.companyName} url={item.companyLogoUrl} />
                <div>
                  <h3 className="font-semibold">
                    {item.role} ·{" "}
                    {item.companyUrl ? (
                      <ExternalLink href={item.companyUrl} className="text-accent hover:text-accent-hover">
                        {item.companyName}
                      </ExternalLink>
                    ) : (
                      item.companyName
                    )}
                  </h3>
                  {item.location && <p className="text-sm text-muted">{item.location}</p>}
                </div>
              </div>
              {item.highlights.length > 0 && (
                <ul className="mt-1 list-disc space-y-1 pl-5 text-[15px] leading-relaxed marker:text-muted">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
              <div className="mt-2">
                <Chips items={item.stack} small />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** A description with several lines becomes a bullet list; a single paragraph stays a paragraph */
function Description({ text }: { text: string }) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1) {
    return (
      <ul className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed marker:text-muted">
        {lines.map((line) => (
          <li key={line}>{line.replace(/^[-•*]\s*/, "")}</li>
        ))}
      </ul>
    );
  }
  return (
    <div className="flex flex-col gap-2 text-[15px] leading-relaxed">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

export function Projects({ items }: { items: Portfolio["projects"] }) {
  return (
    <Section id="projects" title="Projects">
      <ul className="flex flex-col gap-6">
        {items.map((project) => (
          <li key={project.id} className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-muted/40">
            <article className="flex flex-col sm:flex-row">
              {project.imageUrl && (
                <div className="relative aspect-[16/10] sm:aspect-auto sm:w-64 sm:shrink-0">
                  <Image
                    src={project.imageUrl}
                    alt={`Screenshot of ${project.name}`}
                    fill
                    sizes="(min-width: 640px) 256px, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  {project.type !== "personal" && (
                    <span className="text-xs text-muted">{projectTypeLabels[project.type]}</span>
                  )}
                </div>
                <p className="text-muted">{project.shortDescription}</p>
                {project.description && <Description text={project.description} />}
                <Chips items={project.stack} small />
                {(project.liveUrl || project.githubUrl) && (
                  <div className="flex gap-4 text-sm font-medium">
                    {project.liveUrl && (
                      <ExternalLink href={project.liveUrl} className="text-accent hover:text-accent-hover">
                        Live ↗
                      </ExternalLink>
                    )}
                    {project.githubUrl && (
                      <ExternalLink href={project.githubUrl} className="text-accent hover:text-accent-hover">
                        Code ↗
                      </ExternalLink>
                    )}
                  </div>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Skills({ items }: { items: Portfolio["skills"] }) {
  const groups = skillCategory.enumValues
    .map((category) => ({
      category,
      chips: items.filter((skill) => skill.category === category),
    }))
    .filter((group) => group.chips.length > 0);

  return (
    <Section id="skills" title="Skills">
      <dl className="flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.category} className="grid gap-2 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6">
            <dt className="text-sm text-muted sm:pt-1.5">{skillCategoryLabels[group.category]}</dt>
            <dd>
              <Chips items={group.chips} />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

export function Education({ items }: { items: Portfolio["education"] }) {
  return (
    <Section id="education" title="Education">
      <ol className="flex flex-col gap-8">
        {items.map((entry) => (
          <li key={entry.id} className="grid gap-2 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-6">
            <p className="text-sm text-muted sm:pt-0.5">
              {formatMonth(entry.startDate)} — {formatMonth(entry.endDate)}
            </p>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">
                {entry.degree}
                {entry.fieldOfStudy && `, ${entry.fieldOfStudy}`}
              </h3>
              <p className="text-muted">
                {[entry.institution, entry.location].filter(Boolean).join(" · ")}
              </p>
              {entry.grade && <p className="text-sm text-muted">Grade: {entry.grade}</p>}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Contact({ email, name }: { email: string; name: string }) {
  return (
    <section id="contact" className="reveal scroll-mt-20 border-t border-border pt-12 pb-24">
      <h2 className="text-3xl font-bold tracking-tight">Let&apos;s work together</h2>
      <p className="mt-3 text-muted">Have a role or a project in mind? My inbox is open.</p>
      <a href={`mailto:${email}`} className="mt-4 inline-block text-lg font-medium text-accent hover:text-accent-hover">
        {email}
      </a>
      <p className="mt-16 text-sm text-muted">© {name}</p>
    </section>
  );
}
