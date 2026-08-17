import type { ServiceId } from "@/lib/services";

/**
 * Abstract artifact for a project card.
 *
 * Deliberately not a screenshot mock-up: we don't have real screenshots, and a
 * fake one would misrepresent the work. This reads as "a system of this shape"
 * without claiming to show anything specific.
 */
export function ProjectFrame({
  kind,
  accent,
  className = "",
}: {
  kind: ServiceId;
  accent: { from: string; to: string };
  className?: string;
}) {
  const id = `pf-${kind}-${accent.from.replace("#", "")}`;

  return (
    <svg
      viewBox="0 0 400 250"
      className={`w-full ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <linearGradient id={`${id}-a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent.from} />
          <stop offset="100%" stopColor={accent.to} />
        </linearGradient>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent.from} stopOpacity=".35" />
          <stop offset="100%" stopColor={accent.from} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Shared surface */}
      <rect
        x="18"
        y="16"
        width="364"
        height="218"
        rx="16"
        fill="#0a0f1c"
        stroke="rgba(255,255,255,0.08)"
      />
      <path
        d="M18 32a16 16 0 0 1 16-16h332a16 16 0 0 1 16 16v14H18Z"
        fill="rgba(255,255,255,0.03)"
      />
      <circle cx="38" cy="31" r="3.5" fill={accent.from} opacity=".7" />
      <circle cx="50" cy="31" r="3.5" fill="rgba(255,255,255,0.16)" />
      <circle cx="62" cy="31" r="3.5" fill="rgba(255,255,255,0.16)" />

      {kind === "mobile" ? <MobileBody id={id} accent={accent} /> : null}
      {kind === "ai" ? <PipelineBody id={id} accent={accent} /> : null}
      {kind === "security" ? <SecurityBody id={id} accent={accent} /> : null}
      {kind === "cloud" ? <InfraBody id={id} accent={accent} /> : null}
      {kind === "web" || kind === "maintenance" ? (
        <DashboardBody id={id} accent={accent} />
      ) : null}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

function DashboardBody({
  id,
  accent,
}: {
  id: string;
  accent: { from: string; to: string };
}) {
  const bars = [38, 62, 46, 78, 54, 88, 66];
  return (
    <>
      {/* Sidebar */}
      <rect x="30" y="60" width="66" height="162" rx="9" fill="rgba(255,255,255,0.03)" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x="40"
          y={74 + i * 20}
          width={i === 0 ? 42 : 34}
          height="6"
          rx="3"
          fill={i === 0 ? `url(#${id}-a)` : "rgba(255,255,255,0.14)"}
        />
      ))}

      {/* Chart */}
      <rect x="108" y="60" width="262" height="104" rx="9" fill="rgba(255,255,255,0.02)" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={126 + i * 34}
          y={150 - h}
          width="16"
          height={h}
          rx="4"
          fill={`url(#${id}-a)`}
          opacity={0.35 + i * 0.09}
        />
      ))}

      {/* Table rows */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x="108"
            y={176 + i * 17}
            width="180"
            height="6"
            rx="3"
            fill="rgba(255,255,255,0.11)"
          />
          <rect
            x="300"
            y={176 + i * 17}
            width="70"
            height="6"
            rx="3"
            fill={accent.from}
            opacity=".3"
          />
        </g>
      ))}
    </>
  );
}

function MobileBody({
  id,
  accent,
}: {
  id: string;
  accent: { from: string; to: string };
}) {
  return (
    <>
      <rect x="152" y="62" width="96" height="158" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      <rect x="184" y="70" width="32" height="4" rx="2" fill="rgba(255,255,255,0.2)" />
      <rect x="164" y="86" width="72" height="34" rx="8" fill={`url(#${id}-a)`} opacity=".55" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx="172" cy={136 + i * 20} r="5" fill={accent.from} opacity=".55" />
          <rect x="183" y={133 + i * 20} width={44 - i * 4} height="5" rx="2.5" fill="rgba(255,255,255,0.14)" />
        </g>
      ))}
      {/* Peripheral cards */}
      <rect x="42" y="86" width="86" height="52" rx="10" fill="rgba(255,255,255,0.03)" />
      <rect x="54" y="102" width="46" height="5" rx="2.5" fill="rgba(255,255,255,0.16)" />
      <rect x="54" y="114" width="30" height="5" rx="2.5" fill={accent.from} opacity=".5" />
      <rect x="272" y="112" width="86" height="52" rx="10" fill="rgba(255,255,255,0.03)" />
      <rect x="284" y="128" width="46" height="5" rx="2.5" fill="rgba(255,255,255,0.16)" />
      <rect x="284" y="140" width="34" height="5" rx="2.5" fill={accent.to} opacity=".5" />
    </>
  );
}

function PipelineBody({
  id,
  accent,
}: {
  id: string;
  accent: { from: string; to: string };
}) {
  const inputs = [90, 130, 170];
  return (
    <>
      {inputs.map((y, i) => (
        <g key={i}>
          <rect x="42" y={y - 9} width="58" height="18" rx="6" fill="rgba(255,255,255,0.05)" />
          <path
            d={`M104 ${y} C 140 ${y}, 150 130, 176 130`}
            fill="none"
            stroke={`url(#${id}-a)`}
            strokeWidth="1.5"
            strokeDasharray="3 12"
            opacity=".8"
            style={{ animation: `sy-dash ${4.5 + i * 0.6}s linear infinite` }}
          />
        </g>
      ))}

      <rect x="176" y="106" width="48" height="48" rx="14" fill="#0b1020" stroke={`url(#${id}-a)`} strokeWidth="1.4" />
      <circle cx="200" cy="130" r="4" fill={accent.from} />
      <circle cx="188" cy="118" r="2.5" fill={accent.to} opacity=".8" />
      <circle cx="212" cy="118" r="2.5" fill={accent.to} opacity=".8" />
      <circle cx="188" cy="142" r="2.5" fill={accent.to} opacity=".8" />
      <circle cx="212" cy="142" r="2.5" fill={accent.to} opacity=".8" />

      {inputs.map((y, i) => (
        <g key={`o-${i}`}>
          <path
            d={`M224 130 C 250 130, 262 ${y}, 296 ${y}`}
            fill="none"
            stroke={`url(#${id}-a)`}
            strokeWidth="1.5"
            strokeDasharray="3 12"
            opacity=".8"
            style={{ animation: `sy-dash ${5 + i * 0.6}s linear infinite` }}
          />
          <rect x="300" y={y - 9} width="58" height="18" rx="6" fill="rgba(255,255,255,0.05)" />
        </g>
      ))}
    </>
  );
}

function InfraBody({
  id,
  accent,
}: {
  id: string;
  accent: { from: string; to: string };
}) {
  return (
    <>
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <rect
            x="46"
            y={70 + row * 52}
            width="308"
            height="40"
            rx="10"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.06)"
          />
          {[0, 1, 2, 3, 4, 5].map((col) => (
            <rect
              key={col}
              x={62 + col * 48}
              y={82 + row * 52}
              width="32"
              height="16"
              rx="4"
              fill={col <= row + 2 ? `url(#${id}-a)` : "rgba(255,255,255,0.08)"}
              opacity={col <= row + 2 ? 0.5 + col * 0.07 : 1}
            />
          ))}
          <circle cx="338" cy={90 + row * 52} r="4" fill={accent.from} opacity=".8" />
        </g>
      ))}
    </>
  );
}

function SecurityBody({
  id,
  accent,
}: {
  id: string;
  accent: { from: string; to: string };
}) {
  return (
    <>
      <path
        d="M200 68 L262 92 V140 C262 173 236 199 200 210 C164 199 138 173 138 140 V92 Z"
        fill="rgba(255,255,255,0.02)"
        stroke={`url(#${id}-a)`}
        strokeWidth="1.5"
      />
      <path
        d="M182 138 l13 13 26-30"
        fill="none"
        stroke={accent.from}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x="42" y={94 + i * 34} width="72" height="20" rx="6" fill="rgba(255,255,255,0.04)" />
          <circle cx="54" cy={104 + i * 34} r="3" fill={accent.from} opacity=".7" />
          <rect x="286" y={94 + i * 34} width="72" height="20" rx="6" fill="rgba(255,255,255,0.04)" />
          <circle cx="346" cy={104 + i * 34} r="3" fill={accent.to} opacity=".7" />
        </g>
      ))}
    </>
  );
}
