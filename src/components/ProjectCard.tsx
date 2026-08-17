import Link from "next/link";
import { ServiceIcon } from "@/components/icons";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ProjectFrame } from "@/components/visuals/ProjectFrame";
import { services } from "@/lib/services";
import type { Project } from "@/lib/projects";

/** A project inherits the accent of whichever service it leads with. */
export function accentFor(project: Project) {
  const lead = services.find((s) => s.id === project.services[0]);
  return lead?.accent ?? { from: "#4b7cff", to: "#22d3ee" };
}

function ServiceTags({ project }: { project: Project }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {project.services.map((id) => {
        const service = services.find((s) => s.id === id);
        if (!service) return null;
        return (
          <li
            key={id}
            className="inline-flex items-center gap-1.5 text-[0.8125rem] text-mist"
          >
            <ServiceIcon
              id={id}
              className="h-3.5 w-3.5"
              style={{ color: service.accent.from }}
            />
            {service.label}
          </li>
        );
      })}
    </ul>
  );
}

/** Renders nothing when the stack hasn't been filled in yet. */
function StackChips({ stack }: { stack?: string[] }) {
  if (!stack || stack.length === 0) return null;

  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {stack.map((tech) => (
        <li
          key={tech}
          className="rounded-lg border border-white/7 bg-white/[0.025] px-2.5 py-1 font-mono text-[0.7188rem] text-mist"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

/** Compact card for the homepage teaser. */
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const accent = accentFor(project);

  return (
    <SpotlightCard accent={accent.from} className="h-full">
      {/* The teaser links through to the full case study on /work. */}
      <Link
        href={`/work#${project.slug}`}
        className="flex h-full flex-col p-7 sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-slate-dim uppercase">
              {project.client}
              {project.year ? ` · ${project.year}` : ""}
            </p>
            <h3 className="mt-2.5 text-xl font-semibold text-chalk">
              {project.title}
            </h3>
          </div>
          <span className="font-mono text-[1.75rem] leading-none font-semibold text-white/8">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="my-7">
          <ProjectFrame kind={project.services[0]} accent={accent} />
        </div>

        <p className="text-[0.9375rem] leading-relaxed text-mist">
          {project.build}
        </p>

        <div className="mt-auto">
          <StackChips stack={project.stack} />
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-mist transition-colors duration-300 group-hover:text-chalk">
            Read the case study
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </Link>
    </SpotlightCard>
  );
}

/** Full-width treatment used on /work, alternating sides for rhythm. */
export function ProjectDetail({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const accent = accentFor(project);
  const flipped = index % 2 === 1;

  return (
    <article
      id={project.slug}
      className="panel group relative scroll-mt-28 overflow-hidden p-7 sm:p-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 h-72 w-72 rounded-full opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
        style={{
          background: `radial-gradient(circle, ${accent.from}, transparent 70%)`,
        }}
      />

      <div className="relative grid gap-9 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className={flipped ? "lg:order-2" : ""}>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm tracking-[0.16em] text-slate-dim">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="h-px w-8 bg-white/15" />
            <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-slate-dim uppercase">
              {project.client}
              {project.year ? ` · ${project.year}` : ""}
            </p>
          </div>

          <h2 className="mt-5 text-2xl font-semibold text-chalk sm:text-[2rem]">
            {project.title}
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <h3 className="font-mono text-[0.6875rem] tracking-[0.18em] text-slate-dim uppercase">
                The problem
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-mist">
                {project.problem}
              </p>
            </div>
            <div>
              <h3 className="font-mono text-[0.6875rem] tracking-[0.18em] text-slate-dim uppercase">
                What we built
              </h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-mist">
                {project.build}
              </p>
            </div>
            {/* Only rendered when a real, defensible outcome exists. */}
            {project.outcome ? (
              <div>
                <h3 className="font-mono text-[0.6875rem] tracking-[0.18em] text-slate-dim uppercase">
                  Outcome
                </h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-chalk">
                  {project.outcome}
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-7">
            <ServiceTags project={project} />
            <StackChips stack={project.stack} />
          </div>

          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-ghost group/link mt-8"
            >
              Visit the live site
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              >
                <path d="M7 17 17 7M8.5 7H17v8.5" />
              </svg>
            </a>
          ) : null}
        </div>

        <div className={flipped ? "lg:order-1" : ""}>
          <ProjectFrame kind={project.services[0]} accent={accent} />
        </div>
      </div>
    </article>
  );
}
