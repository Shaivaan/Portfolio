// Display labels for DB enum values, shared by the admin forms and the public portfolio

import { employmentType, projectType, skillCategory } from "@/db/schema";

export const skillCategoryLabels: Record<(typeof skillCategory.enumValues)[number], string> = {
  frontend: "Frontend",
  backend: "Backend",
  ai: "AI",
  database: "Database",
  devops: "DevOps / Cloud",
  tools: "Tools",
  other: "Other",
};

export const projectTypeLabels: Record<(typeof projectType.enumValues)[number], string> = {
  personal: "Personal",
  company: "Company / in-house",
  freelance: "Freelance",
};

export const employmentTypeLabels: Record<(typeof employmentType.enumValues)[number], string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  internship: "Internship",
  freelance: "Freelance",
  contract: "Contract",
};

// Social platforms offered in the admin; the key is stored in social_links.platform
export const socialPlatformLabels: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  leetcode: "LeetCode",
  x: "X (Twitter)",
  medium: "Medium",
  devto: "DEV",
  hashnode: "Hashnode",
  stackoverflow: "Stack Overflow",
  codeforces: "Codeforces",
  codechef: "CodeChef",
  geeksforgeeks: "GeeksforGeeks",
  hackerrank: "HackerRank",
  youtube: "YouTube",
  instagram: "Instagram",
  website: "Website",
};

export function toOptions(labels: Record<string, string>) {
  return Object.entries(labels).map(([value, label]) => ({ value, label }));
}

/** "2024-03-01" -> "Mar 2024" */
export function formatMonth(date: string | null) {
  if (!date) return "Present";
  const [year, month] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
