"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ArrowGlyph } from "@/components/ui/Button";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { nav } from "@/lib/site";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet whenever the route changes — including back/forward
  // navigation. Adjusting state during render beats an effect here: it avoids
  // painting the open sheet over the new page for a frame.
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  // Lock scroll + wire Escape while the mobile sheet is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:bg-elevated focus:px-4 focus:py-2 focus:text-sm focus:text-chalk"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "border-b border-white/8 bg-void/72 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8"
        >
          <Link
            href="/"
            className="group shrink-0 rounded-lg"
            aria-label={`${nav[0].label} — Synctech Limited`}
          >
            <Logo className="transition-opacity duration-300 group-hover:opacity-85" />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-lg px-3.5 py-2 text-sm transition-colors duration-300 ${
                      active ? "text-chalk" : "text-mist hover:text-chalk"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`pointer-events-none absolute inset-x-3.5 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-glow to-transparent transition-opacity duration-300 ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:block">
            <Link href="/contact" className="btn btn-primary group text-sm">
              Start a Project
              <ArrowGlyph />
            </Link>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-60 grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-chalk backdrop-blur-md transition-colors duration-300 hover:border-white/25 md:hidden"
          >
            {open ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 md:hidden ${open ? "" : "pointer-events-none"}`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-void/70 backdrop-blur-xl transition-opacity duration-400 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`absolute inset-x-0 top-0 origin-top border-b border-white/8 bg-abyss/95 px-5 pt-24 pb-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-1.5">
            {nav.map((item, i) => (
              <li
                key={item.href}
                style={{
                  transitionDelay: open ? `${120 + i * 55}ms` : "0ms",
                }}
                className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                <Link
                  href={item.href}
                  className={`flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-5 py-4 text-lg font-medium transition-colors duration-300 active:bg-white/8 ${
                    isActive(item.href) ? "text-chalk" : "text-mist"
                  }`}
                >
                  {item.label}
                  <span className="font-mono text-xs text-slate-dim">
                    0{i + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div
            style={{ transitionDelay: open ? "360ms" : "0ms" }}
            className={`mt-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <Link href="/contact" className="btn btn-primary group w-full py-4 text-base">
              Start a Project
              <ArrowGlyph />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
