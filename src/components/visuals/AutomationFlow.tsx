const inputs = [
  { y: 58, label: "Documents" },
  { y: 120, label: "Messages" },
  { y: 182, label: "Requests" },
];

const outputs = [
  { y: 58, label: "Classified" },
  { y: 120, label: "Answered" },
  { y: 182, label: "Recorded" },
];

/**
 * "Work in → decision → work done" pipeline for the AI service card.
 * Flow is drawn with animated dash offsets so nothing needs to be scripted.
 */
export function AutomationFlow({ className = "" }: { className?: string }) {
  return (
    <svg
      // Padded on both sides of the 0–480 geometry: the end/start-anchored
      // labels overhang it, and a tight viewBox clipped them.
      viewBox="-52 0 584 240"
      className={`w-full ${className}`}
      role="img"
      aria-label="Automation pipeline: incoming documents, messages and requests pass through an AI decision layer and come out classified, answered and recorded."
    >
      <defs>
        <linearGradient id="af-in" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity=".05" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity=".8" />
        </linearGradient>
        <linearGradient id="af-out" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity=".8" />
          <stop offset="100%" stopColor="#34d399" stopOpacity=".05" />
        </linearGradient>
        <linearGradient id="af-core" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a98cff" />
          <stop offset="100%" stopColor="#7ef0ff" />
        </linearGradient>
      </defs>

      {inputs.map((node, i) => (
        <g key={`in-${node.label}`}>
          <path
            d={`M78 ${node.y} C 140 ${node.y}, 160 120, 206 120`}
            fill="none"
            stroke="rgba(148,172,255,0.15)"
            strokeWidth="1"
          />
          <path
            d={`M78 ${node.y} C 140 ${node.y}, 160 120, 206 120`}
            fill="none"
            stroke="url(#af-in)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="3 15"
            style={{
              animation: `sy-dash ${4.2 + i * 0.5}s linear infinite`,
              animationDelay: `${i * -0.7}s`,
            }}
          />
          <circle cx="72" cy={node.y} r="4" fill="#22d3ee" opacity=".85" />
          <text
            x="62"
            y={node.y + 4}
            textAnchor="end"
            className="fill-mist font-mono text-[13px]"
          >
            {node.label}
          </text>
        </g>
      ))}

      {outputs.map((node, i) => (
        <g key={`out-${node.label}`}>
          <path
            d={`M274 120 C 320 120, 340 ${node.y}, 402 ${node.y}`}
            fill="none"
            stroke="rgba(148,172,255,0.15)"
            strokeWidth="1"
          />
          <path
            d={`M274 120 C 320 120, 340 ${node.y}, 402 ${node.y}`}
            fill="none"
            stroke="url(#af-out)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="3 15"
            style={{
              animation: `sy-dash ${4.6 + i * 0.5}s linear infinite`,
              animationDelay: `${i * -1.1}s`,
            }}
          />
          <circle cx="408" cy={node.y} r="4" fill="#34d399" opacity=".85" />
          <text
            x="418"
            y={node.y + 4}
            className="fill-mist font-mono text-[13px]"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Decision layer */}
      <circle
        cx="240"
        cy="120"
        r="36"
        fill="rgba(139,92,246,0.12)"
        style={{
          transformOrigin: "240px 120px",
          animation: "sy-pulse-ring 3.6s ease-out infinite",
        }}
      />
      <rect
        x="206"
        y="86"
        width="68"
        height="68"
        rx="21"
        fill="#0b1020"
        stroke="url(#af-core)"
        strokeWidth="1.4"
      />
      <g
        transform="translate(240 120) scale(1.15) translate(-12 -12)"
        fill="none"
        stroke="url(#af-core)"
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="2.4" />
        <circle cx="4.5" cy="6" r="1.7" />
        <circle cx="4.5" cy="18" r="1.7" />
        <circle cx="19.5" cy="6" r="1.7" />
        <circle cx="19.5" cy="18" r="1.7" />
        <path d="m6 6.9 4.2 3.6M6 17.1l4.2-3.6M18 6.9l-4.2 3.6M18 17.1l-4.2-3.6" />
      </g>
      <text
        x="240"
        y="180"
        textAnchor="middle"
        className="fill-slate-dim font-mono text-[11px] tracking-[0.14em]"
      >
        AI LAYER
      </text>
    </svg>
  );
}
