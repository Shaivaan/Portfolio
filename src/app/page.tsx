import type { Metadata } from "next";
import {
  About,
  Contact,
  Education,
  Experience,
  Hero,
  Projects,
  SiteHeader,
  Skills,
} from "@/components/site/sections";
import { getPortfolio } from "@/lib/portfolio";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolio();
  if (!profile) return { title: "Portfolio" };
  return {
    title: `${profile.name} — ${profile.headline}`,
    description: profile.bio ?? profile.headline,
    openGraph: { title: profile.name, description: profile.headline, type: "profile" },
  };
}

export default async function HomePage() {
  const portfolio = await getPortfolio();
  const { profile } = portfolio;

  if (!profile) {
    return (
      <main className="flex flex-1 items-center justify-center p-6 text-center text-muted">
        <p>This portfolio is being set up. Check back soon.</p>
      </main>
    );
  }

  // Only link to sections that have something in them
  const sections = [
    { id: "about", label: "About", show: !!profile.bio },
    { id: "experience", label: "Experience", show: portfolio.experiences.length > 0 },
    { id: "projects", label: "Projects", show: portfolio.projects.length > 0 },
    { id: "skills", label: "Skills", show: portfolio.skills.length > 0 },
    { id: "education", label: "Education", show: portfolio.education.length > 0 },
    { id: "contact", label: "Contact", show: true },
  ].filter((section) => section.show);

  return (
    <>
      <SiteHeader name={profile.name} sections={sections.filter((section) => section.id !== "about")} />
      <main className="mx-auto w-full max-w-3xl px-6">
        <Hero profile={profile} socialLinks={portfolio.socialLinks} />
        {profile.bio && <About bio={profile.bio} />}
        {portfolio.experiences.length > 0 && <Experience items={portfolio.experiences} />}
        {portfolio.projects.length > 0 && <Projects items={portfolio.projects} />}
        {portfolio.skills.length > 0 && <Skills items={portfolio.skills} />}
        {portfolio.education.length > 0 && <Education items={portfolio.education} />}
        <Contact email={profile.email} name={profile.name} />
      </main>
    </>
  );
}
