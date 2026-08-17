import Link from "next/link";
import { ArrowGlyph } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden px-5 py-32 sm:px-8">
      <div aria-hidden="true" className="grid-fade absolute inset-0 -z-10" />

      <div className="mx-auto w-full max-w-xl text-center">
        <p className="font-mono text-sm tracking-[0.2em] text-cyan-glow">404</p>
        <h1 className="mt-6 text-[clamp(2rem,6vw,3rem)] leading-tight font-semibold text-chalk">
          This page doesn&apos;t exist.
        </h1>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-mist">
          The link may be out of date, or the page may have moved. Everything
          else is still where you left it.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary group">
            Back to home
            <ArrowGlyph />
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Start a project
          </Link>
        </div>
      </div>
    </section>
  );
}
