import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function Section({
  children,
  className = "",
  id,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  id?: string;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      id={id}
      className={`relative px-5 py-24 sm:px-8 sm:py-28 lg:py-36 ${className}`}
      {...rest}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`eyebrow ${className}`}>
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-glow opacity-75 [animation:sy-pulse-ring_2.6s_ease-out_infinite]" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-glow" />
      </span>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={`${centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}
    >
      {eyebrow ? (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      ) : null}
      <Reveal delay={70}>
        <h2 className="mt-6 text-[clamp(1.9rem,5vw,3.25rem)] leading-[1.08] font-semibold text-chalk">
          {title}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal delay={140}>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-mist sm:text-lg">
            {lead}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}

/** Thin gradient rule used to separate major sections. */
export function Divider() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto h-px w-full max-w-7xl bg-gradient-to-r from-transparent via-hair-strong to-transparent"
    />
  );
}
