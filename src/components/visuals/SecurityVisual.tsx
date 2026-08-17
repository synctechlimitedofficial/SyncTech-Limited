const rings = [
  { r: 148, label: "Infrastructure" },
  { r: 104, label: "Access" },
  { r: 60, label: "Application" },
];

/** Assets sitting on the monitored perimeter, at (angle°, radius). */
const monitored = [
  { angle: -128, r: 148 },
  { angle: -52, r: 148 },
  { angle: 18, r: 104 },
  { angle: 132, r: 104 },
  { angle: -20, r: 60 },
];

const CX = 240;
const CY = 248;

function point(angle: number, r: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

/**
 * Shield containing a monitoring sweep across three concentric security layers.
 * Reads as "continuous review", not "impenetrable" — which is the honest claim.
 */
export function SecurityVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`relative mx-auto w-full max-w-[30rem] ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.20),transparent_70%)] blur-2xl"
      />

      <svg
        viewBox="0 0 480 500"
        className="relative w-full"
        role="img"
        aria-label="A shield containing three concentric security layers — infrastructure, access and application — with a monitoring sweep passing over connected assets."
      >
        <defs>
          <linearGradient id="sv-shield" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity=".9" />
            <stop offset="55%" stopColor="#22d3ee" stopOpacity=".7" />
            <stop offset="100%" stopColor="#4b7cff" stopOpacity=".5" />
          </linearGradient>
          <radialGradient id="sv-sweep" cx="0" cy="0" r="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity=".38" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
          <clipPath id="sv-clip">
            <path d="M240 34 L424 102 V262 C424 358 342 430 240 462 C138 430 56 358 56 262 V102 Z" />
          </clipPath>
        </defs>

        <g clipPath="url(#sv-clip)">
          <rect x="0" y="0" width="480" height="500" fill="#070b16" />

          {/* Layer rings */}
          {rings.map((ring) => (
            <circle
              key={ring.label}
              cx={CX}
              cy={CY}
              r={ring.r}
              fill="none"
              stroke="rgba(148,172,255,0.14)"
              strokeWidth="1"
            />
          ))}

          {/* Spokes */}
          {Array.from({ length: 12 }, (_, i) => {
            const p = point(i * 30, 148);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={p.x}
                y2={p.y}
                stroke="rgba(148,172,255,0.07)"
                strokeWidth="1"
              />
            );
          })}

          {/* Monitoring sweep */}
          <g
            style={{
              transformOrigin: `${CX}px ${CY}px`,
              animation: "sy-spin-slow 9s linear infinite",
            }}
          >
            <path
              d={`M${CX} ${CY} L${point(-90, 190).x} ${point(-90, 190).y} A190 190 0 0 1 ${point(-38, 190).x} ${point(-38, 190).y} Z`}
              fill="url(#sv-sweep)"
            />
            <line
              x1={CX}
              y1={CY}
              x2={point(-90, 190).x}
              y2={point(-90, 190).y}
              stroke="#34d399"
              strokeOpacity=".55"
              strokeWidth="1.4"
            />
          </g>

          {/* Monitored assets */}
          {monitored.map((node, i) => {
            const p = point(node.angle, node.r);
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="8"
                  fill="#34d399"
                  opacity=".18"
                  style={{
                    transformOrigin: `${p.x}px ${p.y}px`,
                    animation: "sy-pulse-ring 3.4s ease-out infinite",
                    animationDelay: `${i * -0.65}s`,
                  }}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  fill="#0b1020"
                  stroke="#34d399"
                  strokeOpacity=".8"
                  strokeWidth="1.4"
                />
              </g>
            );
          })}

          {/* Core */}
          <circle
            cx={CX}
            cy={CY}
            r="26"
            fill="#0b1020"
            stroke="url(#sv-shield)"
            strokeWidth="1.4"
          />
          <path
            d={`m${CX - 9} ${CY} 6.5 6.5L${CX + 10} ${CY - 8}`}
            fill="none"
            stroke="#34d399"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Layer labels */}
          {rings.map((ring) => (
            <text
              key={`label-${ring.label}`}
              x={CX}
              y={CY - ring.r + 15}
              textAnchor="middle"
              className="fill-slate-dim font-mono text-[11px] tracking-[0.14em]"
            >
              {ring.label.toUpperCase()}
            </text>
          ))}
        </g>

        {/* Shield edge */}
        <path
          d="M240 34 L424 102 V262 C424 358 342 430 240 462 C138 430 56 358 56 262 V102 Z"
          fill="none"
          stroke="url(#sv-shield)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
