import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/db";
import { education, experiences, profile, projects, skills, socialLinks } from "@/db/schema";
import { PORTFOLIO_TAG } from "@/lib/cache";
import { fileUrl } from "@/lib/storage";

type SkillLink = { skill: typeof skills.$inferSelect };

function toChip(skill: typeof skills.$inferSelect) {
  return { name: skill.name, iconUrl: skill.iconKey ? fileUrl(skill.iconKey) : null };
}

// Visible skills of a project/experience, in the same order as the Skills section
function stackOf(links: SkillLink[]) {
  return links
    .map((link) => link.skill)
    .filter((skill) => skill.isVisible)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name))
    .map(toChip);
}

/**
 * Everything the public portfolio shows. Cached and prerendered; admin actions call
 * updateTag(PORTFOLIO_TAG) so a save shows up on the next visit.
 */
export async function getPortfolio() {
  "use cache";
  cacheTag(PORTFOLIO_TAG);
  cacheLife("days");

  const [profileRows, links, skillRows, projectRows, experienceRows, educationRows] = await Promise.all([
    db.select().from(profile).limit(1),
    db.select().from(socialLinks).where(eq(socialLinks.isVisible, true)).orderBy(asc(socialLinks.sortOrder), asc(socialLinks.id)),
    db.select().from(skills).where(eq(skills.isVisible, true)).orderBy(asc(skills.sortOrder), asc(skills.name)),
    db.query.projects.findMany({
      where: eq(projects.isVisible, true),
      orderBy: [desc(projects.featured), asc(projects.sortOrder), desc(projects.createdAt)],
      with: { projectSkills: { with: { skill: true } } },
    }),
    db.query.experiences.findMany({
      where: eq(experiences.isVisible, true),
      orderBy: [asc(experiences.sortOrder), desc(experiences.startDate)],
      with: { experienceSkills: { with: { skill: true } } },
    }),
    db.select().from(education).where(eq(education.isVisible, true)).orderBy(asc(education.sortOrder), desc(education.startDate)),
  ]);

  const me = profileRows[0];

  return {
    profile: me && {
      name: me.name,
      headline: me.headline,
      bio: me.bio,
      focusAreas: me.focusAreas,
      email: me.email,
      location: me.location,
      openToWork: me.openToWork,
      photoUrl: me.photoKey ? fileUrl(me.photoKey) : null,
      resumeUrl: me.resumeUrl,
    },
    socialLinks: links.map((link) => ({ id: link.id, platform: link.platform, url: link.url })),
    skills: skillRows.map((skill) => ({ id: skill.id, category: skill.category, ...toChip(skill) })),
    projects: projectRows.map((project) => ({
      id: project.id,
      name: project.name,
      shortDescription: project.shortDescription,
      description: project.description,
      type: project.type,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      imageUrl: project.imageKey ? fileUrl(project.imageKey) : null,
      featured: project.featured,
      stack: stackOf(project.projectSkills),
    })),
    experiences: experienceRows.map((experience) => ({
      id: experience.id,
      companyName: experience.companyName,
      companyUrl: experience.companyUrl,
      companyLogoUrl: experience.companyLogoKey ? fileUrl(experience.companyLogoKey) : null,
      role: experience.role,
      employmentType: experience.employmentType,
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate,
      highlights: experience.highlights,
      stack: stackOf(experience.experienceSkills),
    })),
    education: educationRows.map((entry) => ({
      id: entry.id,
      institution: entry.institution,
      degree: entry.degree,
      fieldOfStudy: entry.fieldOfStudy,
      location: entry.location,
      startDate: entry.startDate,
      endDate: entry.endDate,
      grade: entry.grade,
    })),
  };
}

export type Portfolio = Awaited<ReturnType<typeof getPortfolio>>;
