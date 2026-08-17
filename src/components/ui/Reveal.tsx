"use client";

import { useCallback, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger in milliseconds. */
  delay?: number;
  className?: string;
  as?: ElementType;
  /** Anchor target, so revealed blocks can also be jump-link destinations. */
  id?: string;
};

/**
 * Scroll-triggered fade + rise.
 *
 * The observer is wired up in a ref callback rather than an effect, so it
 * attaches the moment the node exists and tears itself down when it leaves.
 * Motion is pure CSS (`.reveal` in globals.css) — this only flips a flag, and
 * `prefers-reduced-motion` is handled there too, not here.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  id,
}: RevealProps) {
  const [shown, setShown] = useState(false);

  const attach = useCallback((node: HTMLElement | null) => {
    if (!node || shown) return;

    // No observer support (very old browsers) — show the content rather than
    // leaving it permanently transparent.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      // Any sliver counts, minus a small bottom inset so the animation starts
      // just after the element clears the fold rather than exactly on it.
      { threshold: 0, rootMargin: "0px 0px -64px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <Tag
      ref={attach}
      id={id}
      className={`reveal ${className}`}
      data-shown={shown}
      style={
        delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined
      }
    >
      {children}
    </Tag>
  );
}
