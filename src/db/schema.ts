import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Column names are written in camelCase here and stored as snake_case
// (see `casing` in src/db/index.ts and drizzle.config.ts).
// `*Key` columns hold the object key in Neon Object Storage, e.g. "projects/3f2a.webp".
// Build the public URL with `fileUrl()` from src/lib/storage.ts.

const id = () => integer().primaryKey().generatedAlwaysAsIdentity();

// Shared by every list-type table: manual ordering, hide without deleting, timestamps
const listColumns = {
  sortOrder: integer().notNull().default(0),
  isVisible: boolean().notNull().default(true),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// Enums

export const skillCategory = pgEnum("skill_category", [
  "frontend",
  "backend",
  "ai",
  "database",
  "devops",
  "tools",
  "other",
]);

export const projectType = pgEnum("project_type", ["personal", "company", "freelance"]);

export const employmentType = pgEnum("employment_type", [
  "full_time",
  "part_time",
  "internship",
  "freelance",
  "contract",
]);

// Profile: a single row with the person's details

export const profile = pgTable("profile", {
  id: id(),
  name: text().notNull(),
  headline: text().notNull(), // e.g. "Full Stack Developer · Agentic AI"
  bio: text(),
  focusAreas: text().array().notNull().default([]), // e.g. ["Frontend", "Backend", "Agentic AI"]
  email: text().notNull(),
  location: text(), // city only, e.g. "Bengaluru, India"
  photoKey: text(),
  resumeUrl: text(), // link to the resume, e.g. a Google Drive share link
  openToWork: boolean().notNull().default(false),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// LinkedIn, GitHub, LeetCode, ... as rows so new platforms need no schema change

export const socialLinks = pgTable("social_links", {
  id: id(),
  platform: text().notNull(), // "linkedin" | "github" | "leetcode" | ...
  url: text().notNull(),
  ...listColumns,
});

// Skills: shown in the Skills section and used as the tech stack of projects/experience

export const skills = pgTable("skills", {
  id: id(),
  name: text().notNull().unique(),
  category: skillCategory().notNull().default("other"),
  iconKey: text(),
  ...listColumns,
});

export const projects = pgTable("projects", {
  id: id(),
  name: text().notNull(),
  slug: text().notNull().unique(), // used in URLs, e.g. /projects/chat-app
  shortDescription: text().notNull(), // one line for the card
  description: text(),
  type: projectType().notNull().default("personal"),
  liveUrl: text(), // empty for in-house apps
  githubUrl: text(),
  imageKey: text(),
  featured: boolean().notNull().default(false),
  ...listColumns,
});

export const experiences = pgTable("experiences", {
  id: id(),
  companyName: text().notNull(),
  role: text().notNull(),
  employmentType: employmentType().notNull().default("full_time"),
  location: text(),
  startDate: date().notNull(),
  endDate: date(), // null = current company ("Present")
  highlights: text().array().notNull().default([]), // bullet points of what you did
  companyUrl: text(),
  companyLogoKey: text(),
  ...listColumns,
});

export const education = pgTable("education", {
  id: id(),
  institution: text().notNull(),
  degree: text().notNull(), // e.g. "B.Tech"
  fieldOfStudy: text(), // e.g. "Computer Science"
  location: text(),
  startDate: date().notNull(),
  endDate: date(), // null = still studying
  grade: text(), // e.g. "8.5 CGPA"
  ...listColumns,
});

// Join tables: tech stack of each project / experience

export const projectSkills = pgTable(
  "project_skills",
  {
    projectId: integer()
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    skillId: integer()
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.projectId, t.skillId] })],
);

export const experienceSkills = pgTable(
  "experience_skills",
  {
    experienceId: integer()
      .notNull()
      .references(() => experiences.id, { onDelete: "cascade" }),
    skillId: integer()
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.experienceId, t.skillId] })],
);

// Relations (for db.query.* with `with: { ... }`)

export const skillsRelations = relations(skills, ({ many }) => ({
  projectSkills: many(projectSkills),
  experienceSkills: many(experienceSkills),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  projectSkills: many(projectSkills),
}));

export const experiencesRelations = relations(experiences, ({ many }) => ({
  experienceSkills: many(experienceSkills),
}));

export const projectSkillsRelations = relations(projectSkills, ({ one }) => ({
  project: one(projects, { fields: [projectSkills.projectId], references: [projects.id] }),
  skill: one(skills, { fields: [projectSkills.skillId], references: [skills.id] }),
}));

export const experienceSkillsRelations = relations(experienceSkills, ({ one }) => ({
  experience: one(experiences, {
    fields: [experienceSkills.experienceId],
    references: [experiences.id],
  }),
  skill: one(skills, { fields: [experienceSkills.skillId], references: [skills.id] }),
}));
