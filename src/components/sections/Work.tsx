import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowGlyph } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ProjectCard";
import { publishedProjects } from "@/lib/projects";

/**
 * Homepage teaser. Renders nothing at all until at least one project is
 * published, so an empty portfolio never shows up as a hollow section.
 */
export function Work() {
  if (publishedProjects.length === 0) return null;

  const featured = publishedProjects.slice(0, 3);

  return (
    <Section id="work" className="border-t border-white/6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Selected work"
          title={
            <>
              Systems we&apos;ve built,{" "}
              <span className="text-gradient-accent">and still run.</span>
            </>
          }
          lead="A look at what we've delivered — the problem, what we built, and the stack behind it."
        />

        {publishedProjects.length > featured.length ? (
          <Reveal delay={180}>
            <Link href="/work" className="btn btn-ghost group">
              See all work
              <ArrowGlyph />
            </Link>
          </Reveal>
        ) : null}
      </div>

      <div
        className={`mt-14 grid gap-5 lg:mt-20 ${
          featured.length === 1
            ? "lg:grid-cols-1"
            : featured.length === 2
              ? "lg:grid-cols-2"
              : "lg:grid-cols-3"
        }`}
      >
        {featured.map((project, i) => (
          <Reveal key={project.slug} delay={i * 90}>
            <ProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
