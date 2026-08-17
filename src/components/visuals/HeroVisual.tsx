import { ServiceIcon } from "@/components/icons";
import { services } from "@/lib/services";

const CENTER = 260;
const RADIUS = 182;

/** Six service nodes evenly distributed around the core. */
const nodes = services.map((service, i) => {
  const angle = (-90 + i * 60) * (Math.PI / 180);
  return {
    service,
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
});

/**
 * Pure CSS/SVG system diagram: a core with six service nodes and data flowing
 * along the connectors. No JS and no canvas — one paint, and the animation runs
 * on transform/stroke only.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
      {/* Ambient bloom behind the diagram */}
      <div
        aria-hidden="true"
        className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(75,124,255,0.28),rgba(34,211,238,0.09)_45%,transparent_70%)] blur-2xl"
      />

      <svg
        viewBox="0 0 520 520"
        className="relative h-full w-full"
        role="img"
        aria-label="Diagram of Synctech's six connected capabilities — web, mobile, AI, cloud, security and maintenance — linked to a central platform core."
      >
        <defs>
          <linearGradient id="hv-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity=".75" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity=".3" />
          </linearGradient>
          <linearGradient id="hv-core" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7ef0ff" />
            <stop offset="50%" stopColor="#6ea6ff" />
            <stop offset="100%" stopColor="#a98cff" />
          </linearGradient>
          <radialGradient id="hv-node">
            <stop offset="0%" stopColor="#141c30" />
            <stop offset="100%" stopColor="#080c18" />
          </radialGradient>
        </defs>

        {/* Orbit rings */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="rgba(148,172,255,0.15)"
          strokeWidth="1"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS + 44}
          fill="none"
          stroke="rgba(148,172,255,0.10)"
          strokeWidth="1"
          strokeDasharray="2 10"
          className="anim-spin-slow"
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS - 76}
          fill="none"
          stroke="rgba(148,172,255,0.10)"
          strokeWidth="1"
          strokeDasharray="1 7"
        />

        {/* Connectors, with data flowing outward from the core */}
        {nodes.map(({ service, x, y }, i) => (
          <g key={`link-${service.id}`}>
            <line
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="rgba(148,172,255,0.16)"
              strokeWidth="1"
            />
            <line
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              stroke="url(#hv-line)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="3 15"
              style={{
                animation: `sy-dash ${5 + i * 0.7}s linear infinite`,
                animationDelay: `${i * -0.9}s`,
              }}
            />
          </g>
        ))}

        {/* Core */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r="52"
          fill="rgba(34,211,238,0.09)"
          style={{
            transformOrigin: `${CENTER}px ${CENTER}px`,
            animation: "sy-pulse-ring 4.5s ease-out infinite",
          }}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r="52"
          fill="rgba(139,92,246,0.09)"
          style={{
            transformOrigin: `${CENTER}px ${CENTER}px`,
            animation: "sy-pulse-ring 4.5s ease-out infinite",
            animationDelay: "2.25s",
          }}
        />
        <rect
          x={CENTER - 47}
          y={CENTER - 47}
          width="94"
          height="94"
          rx="29"
          fill="#0b1020"
          stroke="url(#hv-core)"
          strokeWidth="1.5"
        />
        <g transform={`translate(${CENTER} ${CENTER}) scale(1.35) translate(-20 -20)`}>
          <path
            d="M27 13.5c-2.1-2.2-5.3-2.9-8-1.7-3.5 1.6-4.6 5.9-2.3 8.9 2.3 3 1.2 7.3-2.3 8.9-2.7 1.2-5.9.5-8-1.7"
            stroke="url(#hv-core)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
            transform="translate(2.5 -1)"
          />
          <circle cx="29.5" cy="12.5" r="3" fill="url(#hv-core)" />
          <circle cx="10.5" cy="27.5" r="3" fill="url(#hv-core)" opacity=".55" />
        </g>

        {/* Service nodes */}
        {nodes.map(({ service, x, y }, i) => (
          <g
            key={service.id}
            style={{
              animation: `sy-float ${6.5 + i * 0.6}s ease-in-out infinite`,
              animationDelay: `${i * -1.1}s`,
            }}
          >
            <circle
              cx={x}
              cy={y}
              r="31"
              fill="url(#hv-node)"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="1"
            />
            <circle
              cx={x}
              cy={y}
              r="31"
              fill="none"
              stroke={service.accent.from}
              strokeOpacity=".45"
              strokeWidth="1.2"
              strokeDasharray="30 130"
              style={{
                transformOrigin: `${x}px ${y}px`,
                animation: `sy-spin-slow ${9 + i}s linear infinite`,
              }}
            />
            <ServiceIcon
              id={service.id}
              x={x - 11}
              y={y - 11}
              width={22}
              height={22}
              style={{ color: service.accent.from }}
            />
          </g>
        ))}
      </svg>

      {/* Floating capability chips — real capabilities, never invented metrics */}
      <FloatingChip
        className="anim-float top-[15%] -left-[2%]"
        label="AI & Automation"
        sub="Workflows that run themselves"
      />
      <FloatingChip
        className="anim-float-slow top-[46%] -right-[3%]"
        label="Cloud Infrastructure"
        sub="Deploy · scale · monitor"
        delay="-3s"
      />
      <FloatingChip
        className="anim-float bottom-[8%] left-[4%]"
        label="Security Reviews"
        sub="Find it before someone else does"
        delay="-1.8s"
      />
    </div>
  );
}

function FloatingChip({
  label,
  sub,
  className = "",
  delay,
}: {
  label: string;
  sub: string;
  className?: string;
  delay?: string;
}) {
  return (
    <div
      aria-hidden="true"
      style={delay ? { animationDelay: delay } : undefined}
      className={`absolute hidden rounded-2xl border border-white/10 bg-abyss/80 px-3.5 py-2.5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:block ${className}`}
    >
      <p className="text-[0.8125rem] font-medium whitespace-nowrap text-chalk">
        {label}
      </p>
      <p className="mt-0.5 text-[0.6875rem] whitespace-nowrap text-slate-dim">{sub}</p>
    </div>
  );
}
