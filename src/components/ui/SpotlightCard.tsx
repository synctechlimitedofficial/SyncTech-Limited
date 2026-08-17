"use client";

import { useRef, type ReactNode } from "react";

/**
 * Card shell with a soft light that tracks the cursor.
 * The handler only writes two CSS custom properties — no React state, so
 * pointer movement never triggers a re-render.
 */
export function SpotlightCard({
  children,
  accent,
  className = "",
}: {
  children: ReactNode;
  /** Hex colour driving the spotlight tint. */
  accent: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el || e.pointerType !== "mouse") return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        el.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }}
      style={{ "--spot": accent } as React.CSSProperties}
      className={`panel panel-interactive group relative overflow-hidden ${className}`}
    >
      <div className="spotlight" aria-hidden="true" />
      {children}
    </div>
  );
}
