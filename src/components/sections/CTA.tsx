import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowGlyph } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="relative px-5 pb-24 sm:px-8 lg:pb-32">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/9 bg-abyss px-6 py-16 text-center sm:px-12 sm:py-20 lg:py-28">
            {/* Backdrop: grid + converging light */}
            <div aria-hidden="true" className="dot-fade absolute inset-0" />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 -top-1/2 h-full bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,rgba(75,124,255,0.32),transparent_70%)]"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.28),transparent_65%)] blur-3xl"
            />
            {/* Top hairline */}
            <div
              aria-hidden="true"
              className="absolute inset-x-[20%] top-0 h-px bg-gradient-to-r from-transparent via-cyan-glow/70 to-transparent"
            />

            <div className="relative mx-auto max-w-3xl">
              <h2 className="text-[clamp(2rem,6vw,3.75rem)] leading-[1.05] font-semibold text-chalk">
                Have a project in mind?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-mist sm:text-lg">
                Let&apos;s turn your idea into a reliable digital solution. Tell
                us what you are trying to build and we will come back with a
                clear view of scope, approach and cost.
              </p>

              <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="btn btn-primary group w-full px-6 py-3.5 text-base sm:w-auto"
                >
                  Start Your Project
                  <ArrowGlyph />
                </Link>
                <Link
                  href="/services"
                  className="btn btn-ghost group w-full px-6 py-3.5 text-base sm:w-auto"
                >
                  Explore Services
                  <ArrowGlyph />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
