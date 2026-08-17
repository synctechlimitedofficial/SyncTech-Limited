"use client";

import { useEffect, useRef, useState } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

type Layer = {
  key: string;
  label: string;
  headline: string;
  body: string;
  points: string[];
  color: string;
};

/** Ordered bottom-of-stack to top, matching the 3D plates. */
const layers: Layer[] = [
  {
    key: "software",
    label: "Software",
    headline: "The product people actually use",
    body: "Web and mobile interfaces built on typed, tested codebases — the layer your customers judge you on.",
    points: ["TypeScript", "React & Next.js", "Node.js", "Python", "REST & GraphQL"],
    color: "#4b7cff",
  },
  {
    key: "security",
    label: "Security",
    headline: "Considered at every layer, not bolted on",
    body: "Authentication, access control, secure configuration and dependency hygiene reviewed as part of the build.",
    points: [
      "Access control",
      "Secure config",
      "Dependency review",
      "Hardening",
      "Monitoring",
    ],
    color: "#34d399",
  },
  {
    key: "cloud",
    label: "Cloud",
    headline: "Infrastructure that holds up",
    body: "Environments, databases, pipelines and backups defined as code, so a deploy is routine instead of an event.",
    points: ["Linux", "Docker", "CI/CD", "PostgreSQL", "Backups & monitoring"],
    color: "#8b5cf6",
  },
  {
    key: "automation",
    label: "Automation",
    headline: "The work nobody should be doing by hand",
    body: "Systems talk to each other so your team stops copying data between them.",
    points: [
      "Workflow automation",
      "Integrations",
      "Scheduled jobs",
      "Document processing",
    ],
    color: "#22d3ee",
  },
  {
    key: "ai",
    label: "AI",
    headline: "Applied where it measurably helps",
    body: "Assistants, classification and extraction wired into the systems your business already runs on.",
    points: [
      "Chat assistants",
      "Classification",
      "Extraction",
      "Retrieval",
      "AI integrations",
    ],
    color: "#f0abfc",
  },
];

const ROTATE_MS = 4200;

export function TechnologySection() {
  const [active, setActive] = useState(layers.length - 1);
  const [paused, setPaused] = useState(false);
  const interacted = useRef(false);

  useEffect(() => {
    if (paused || interacted.current) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setInterval(
      () => setActive((i) => (i - 1 + layers.length) % layers.length),
      ROTATE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused]);

  const select = (i: number) => {
    interacted.current = true;
    setActive(i);
  };

  const current = layers[active];

  return (
    <Section id="technology" className="border-t border-white/6">
      <SectionHeading
        eyebrow="Technology"
        title={
          <>
            One stack, from the interface{" "}
            <span className="text-gradient-accent">down to the server.</span>
          </>
        }
        lead="Software, AI, automation, cloud and security are not separate projects — they are layers of the same system. We work across all of them."
        align="center"
      />

      <div
        className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-16"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Layer selector */}
        <Reveal>
          <ul className="flex flex-col gap-2">
            {[...layers].reverse().map((layer) => {
              const index = layers.indexOf(layer);
              const isActive = index === active;
              return (
                <li key={layer.key}>
                  <button
                    type="button"
                    onClick={() => select(index)}
                    onFocus={() => select(index)}
                    aria-pressed={isActive}
                    className={`relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-4 py-4 text-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-5 ${
                      isActive
                        ? "border-white/14 bg-white/[0.05]"
                        : "border-white/6 bg-white/[0.015] hover:border-white/12 hover:bg-white/[0.035]"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-[3px] transition-all duration-500"
                      style={{
                        background: layer.color,
                        opacity: isActive ? 1 : 0,
                      }}
                    />
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full transition-all duration-500"
                      style={{
                        background: layer.color,
                        boxShadow: isActive ? `0 0 12px 2px ${layer.color}66` : "none",
                        opacity: isActive ? 1 : 0.4,
                      }}
                    />
                    <span className="min-w-0">
                      <span
                        className={`block text-base font-semibold transition-colors duration-400 ${
                          isActive ? "text-chalk" : "text-mist"
                        }`}
                      >
                        {layer.label}
                      </span>
                      <span
                        className={`mt-0.5 block text-[0.8125rem] transition-colors duration-400 ${
                          isActive ? "text-mist" : "text-slate-dim"
                        }`}
                      >
                        {layer.headline}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>

        {/* 3D stack + detail */}
        <Reveal delay={120}>
          <div className="flex flex-col gap-8">
            <LayerStack active={active} onSelect={select} />

            <div
              key={current.key}
              className="anim-fade-down panel p-6 sm:p-7"
              aria-live="polite"
            >
              <p className="text-[0.9375rem] leading-relaxed text-mist">
                {current.body}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {current.points.map((point) => (
                  <li
                    key={point}
                    className="rounded-lg border px-2.5 py-1 text-[0.75rem] text-chalk"
                    style={{
                      borderColor: `${current.color}40`,
                      background: `${current.color}12`,
                    }}
                  >
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/** Five isometric plates; the active one lifts out of the stack. */
function LayerStack({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    // overflow-hidden matters here: rotating the inner container in 3D inflates
    // its bounding box, which pushed the page past the viewport on mobile.
    <div
      aria-hidden="true"
      className="relative mx-auto h-64 w-full max-w-md overflow-hidden sm:h-80"
      style={{ perspective: "1400px" }}
    >
      <div
        className="absolute inset-[7%]"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(58deg) rotateZ(-42deg)",
        }}
      >
        {layers.map((layer, i) => {
          const isActive = i === active;
          const lift = i * 30 + (isActive ? 26 : 0);
          return (
            <button
              key={layer.key}
              type="button"
              tabIndex={-1}
              onClick={() => onSelect(i)}
              className="absolute inset-x-[14%] top-[24%] h-[46%] cursor-pointer rounded-[18px] border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: `translateZ(${lift}px)`,
                borderColor: isActive ? `${layer.color}aa` : "rgba(255,255,255,0.09)",
                background: isActive
                  ? `linear-gradient(135deg, ${layer.color}30, ${layer.color}0a)`
                  : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
                boxShadow: isActive
                  ? `0 0 40px -6px ${layer.color}80, 0 0 0 1px ${layer.color}40`
                  : "0 12px 30px -20px rgba(0,0,0,0.9)",
                backdropFilter: "blur(6px)",
              }}
            />
          );
        })}
      </div>

      {/* Floor glow */}
      <div className="pointer-events-none absolute inset-x-[18%] bottom-[6%] h-16 rounded-full bg-[radial-gradient(ellipse,rgba(75,124,255,0.30),transparent_70%)] blur-2xl" />
    </div>
  );
}
