import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { WorkGallery } from "@/components/WorkGallery";
import { CTA } from "@/components/sections/CTA";
import { publishedProjects } from "@/lib/projects";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Work — Projects Synctech has built and supports",
  description:
    "Selected projects from Synctech Limited: the problem, what we built, and the technology behind it.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work | Synctech Limited",
    description:
      "Selected projects from Synctech Limited — the problem, what we built, and the stack behind it.",
    url: "/work",
  },
};

export default function WorkPage() {
  // No published projects means no page. Better a 404 than an empty portfolio
  // that reads as "this company has done nothing".
  if (publishedProjects.length === 0) notFound();

  // Only mention services actually represented in the published work.
  const covered = services.filter((service) =>
    publishedProjects.some((project) => project.services.includes(service.id)),
  );

  return (
    <>
      <PageHeader
        eyebrow="Work"
        title={
          <>
            What we&apos;ve built,{" "}
            <span className="text-gradient-accent">and what it took.</span>
          </>
        }
        lead="Each project below covers the same three things: what was wrong before, what we delivered, and the technology we used. No vanity metrics."
      >
        <p className="mt-8 font-mono text-[0.6875rem] tracking-[0.18em] text-slate-dim uppercase">
          {publishedProjects.length} projects across {covered.length} disciplines
        </p>
      </PageHeader>

      <Section className="pt-4!">
        <WorkGallery projects={publishedProjects} />
      </Section>

      <CTA />
    </>
  );
}
