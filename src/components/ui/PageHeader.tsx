import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./Section";

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden px-5 pt-32 pb-16 sm:px-8 sm:pt-40 lg:pt-44 lg:pb-20">
      <div aria-hidden="true" className="grid-fade absolute inset-0 -z-10" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-void to-transparent"
      />

      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-7 text-[clamp(2.25rem,6.5vw,4rem)] leading-[1.05] font-semibold text-chalk">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-mist sm:text-lg">
              {lead}
            </p>
          </Reveal>
          {children ? <Reveal delay={240}>{children}</Reveal> : null}
        </div>
      </div>
    </section>
  );
}
