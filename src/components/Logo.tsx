import { site } from "@/lib/site";

/**
 * Abstract "sync" mark: two offset nodes joined by a returning path —
 * systems talking to each other. Gradient ids are suffixed so the mark can
 * appear more than once per page without id collisions.
 */
export function LogoMark({
  className = "h-9 w-9",
  id = "brand",
}: {
  className?: string;
  id?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#7ef0ff" />
          <stop offset="52%" stopColor="#6ea6ff" />
          <stop offset="100%" stopColor="#a98cff" />
        </linearGradient>
        <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#ffffff" stopOpacity=".45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity=".05" />
        </linearGradient>
      </defs>

      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="11"
        fill="#0b1020"
        stroke={`url(#${id}-edge)`}
        strokeWidth="1.5"
      />
      <path
        d="M27 13.5c-2.1-2.2-5.3-2.9-8-1.7-3.5 1.6-4.6 5.9-2.3 8.9 2.3 3 1.2 7.3-2.3 8.9-2.7 1.2-5.9.5-8-1.7"
        stroke={`url(#${id}-fill)`}
        strokeWidth="2.6"
        strokeLinecap="round"
        transform="translate(2.5 -1)"
      />
      <circle cx="29.5" cy="12.5" r="3" fill={`url(#${id}-fill)`} />
      <circle cx="10.5" cy="27.5" r="3" fill={`url(#${id}-fill)`} opacity=".55" />
    </svg>
  );
}

export function Logo({
  className = "",
  markId = "brand",
}: {
  className?: string;
  markId?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark id={markId} className="h-9 w-9 shrink-0" />
      <span className="text-[1.0625rem] font-semibold tracking-[0.16em] text-chalk">
        {site.shortName}
      </span>
    </span>
  );
}
