"use client";

import { useState } from "react";
import { ProjectDetail } from "@/components/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceIcon } from "@/components/icons";
import { services } from "@/lib/services";
import type { Project } from "@/lib/projects";
import type { ServiceId } from "@/lib/services";

/**
 * Filterable list of projects. With a dozen full-width case studies the page is
 * long enough that a visitor looking for one capability shouldn't have to scroll
 * past all the others.
 *
 * Everything is rendered server-side first and merely hidden by the filter, so
 * the full set is still in the HTML for search engines and for anyone without JS.
 */
export function WorkGallery({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ServiceId | "all">("all");

  // Only offer filters that actually match something.
  const available = services.filter((service) =>
    projects.some((project) => project.services.includes(service.id)),
  );

  const isVisible = (project: Project) =>
    filter === "all" || project.services.includes(filter);

  const visibleCount = projects.filter(isVisible).length;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label={`All work (${projects.length})`}
        />
        {available.map((service) => {
          const count = projects.filter((p) =>
            p.services.includes(service.id),
          ).length;
          return (
            <FilterChip
              key={service.id}
              active={filter === service.id}
              onClick={() => setFilter(service.id)}
              label={`${service.label} (${count})`}
              icon={
                <ServiceIcon
                  id={service.id}
                  className="h-3.5 w-3.5"
                  style={{ color: service.accent.from }}
                />
              }
            />
          );
        })}
      </div>

      {/*
        Every project stays mounted; filtering only toggles `hidden`.
        Remounting on filter change left some scroll-reveal observers never
        firing, so cards could end up permanently invisible. Keeping the nodes
        alive also means the full set is always in the HTML for search engines.
        Numbering is by position in the full list, so a project keeps the same
        number whichever filter is applied.
      */}
      <div className="mt-10 flex flex-col gap-5">
        {projects.map((project, i) => (
          <div key={project.slug} className={isVisible(project) ? "" : "hidden"}>
            <Reveal>
              <ProjectDetail project={project} index={i} />
            </Reveal>
          </div>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {visibleCount} of {projects.length} projects.
      </p>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[0.8125rem] transition-all duration-300 ${
        active
          ? "border-white/25 bg-white/[0.08] text-chalk"
          : "border-white/9 bg-white/[0.03] text-mist hover:border-white/18 hover:text-chalk"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
