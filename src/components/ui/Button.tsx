import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

const sizes: Record<Size, string> = {
  md: "",
  lg: "px-6 py-3.5 text-base",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

function classes({ variant = "primary", size = "md", className = "" }: CommonProps) {
  return `btn btn-${variant} ${sizes[size]} ${className}`.trim();
}

export function ButtonLink({
  href,
  children,
  variant,
  size,
  className,
  ...rest
}: CommonProps & { href: string } & Omit<
    React.ComponentPropsWithoutRef<"a">,
    "href" | "className" | "children"
  >) {
  const external = href.startsWith("http") || href.startsWith("mailto:");

  if (external) {
    return (
      <a
        href={href}
        className={classes({ children, variant, size, className })}
        rel="noreferrer noopener"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes({ children, variant, size, className })} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  children,
  variant,
  size,
  className,
  ...rest
}: CommonProps & Omit<React.ComponentPropsWithoutRef<"button">, "className" | "children">) {
  return (
    <button className={classes({ children, variant, size, className })} {...rest}>
      {children}
    </button>
  );
}

/**
 * Arrow that nudges right on hover of the closest `.group` ancestor.
 * Kept here so every CTA uses the identical motion.
 */
export function ArrowGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 ${className}`}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
