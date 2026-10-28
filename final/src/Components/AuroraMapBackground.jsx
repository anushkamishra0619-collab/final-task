
import React from "react";
import "./AuroraMapBackground.css";

function createContour(cx, cy, radius, phase) {
  const points = [];

  for (let i = 0; i <= 72; i++) {
    const angle = (i / 72) * Math.PI * 2;
    const r =
      radius *
      (1 +
        0.14 * Math.sin(3 * angle + phase) +
        0.07 * Math.sin(5 * angle + phase * 2));

    points.push(
      `${(cx + r * Math.cos(angle) * 1.35).toFixed(1)},${(
        cy +
        r * Math.sin(angle) * 0.8
      ).toFixed(1)}`
    );
  }

  return `M ${points.join(" L ")} Z`;
}

const contourGroups = [
  { x: 900, y: 200, phase: 0 },
  { x: 250, y: 560, phase: 2 },
  { x: 650, y: 430, phase: 4 },
];

const roadLines = [
  "M-20 620 H260 L380 500 H700 L820 380 H1220",
  "M120 -20 V200 L300 380 V560 L460 720 V780",
  "M1220 120 H940 L800 260 H560 L440 140 V-20",
];

const junctions = [
  [260, 620],
  [380, 500],
  [700, 500],
  [820, 380],
  [120, 200],
  [300, 380],
  [300, 560],
  [460, 720],
  [940, 120],
  [800, 260],
  [560, 260],
  [440, 140],
];

export default function AuroraMapBackground() {
  return (
    <div className="aurora-map-background" aria-hidden="true">
      <svg
        className="aurora-map-svg"
        viewBox="0 0 1200 760"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="aurora-blur">
            <feGaussianBlur stdDeviation="75" />
          </filter>

          <filter id="aurora-road-glow">
            <feGaussianBlur stdDeviation="7" />
          </filter>

          <pattern
            id="aurora-dots"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="2"
              cy="2"
              r="1"
              fill="#a5b4fc"
              opacity="0.25"
            />
          </pattern>

          <radialGradient id="aurora-vignette">
            <stop offset="45%" stopColor="#060818" stopOpacity="0" />
            <stop offset="100%" stopColor="#060818" stopOpacity="0.9" />
          </radialGradient>

          <g
            id="aurora-road-lines"
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="#a78bfa" d={roadLines[0]} />
            <path stroke="#22d3ee" d={roadLines[1]} />
            <path stroke="#f472b6" d={roadLines[2]} />
          </g>
        </defs>

        <rect width="1200" height="760" fill="#060818" />

        {/* Soft, drifting aurora lights */}
        <g filter="url(#aurora-blur)">
          <ellipse
            cx="300"
            cy="200"
            rx="320"
            ry="200"
            fill="#6d28d9"
            opacity="0.65"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0;80 40;0 0"
              dur="16s"
              repeatCount="indefinite"
            />
          </ellipse>

          <ellipse
            cx="900"
            cy="560"
            rx="340"
            ry="200"
            fill="#0891b2"
            opacity="0.6"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0;-90 -30;0 0"
              dur="20s"
              repeatCount="indefinite"
            />
          </ellipse>

          <ellipse
            cx="700"
            cy="150"
            rx="240"
            ry="140"
            fill="#be185d"
            opacity="0.35"
          />
        </g>

        <rect width="1200" height="760" fill="url(#aurora-dots)" />

        {/* Topographic contours */}
        {contourGroups.map((group, groupIndex) =>
          Array.from({ length: 10 }, (_, i) => (
            <path
              key={`${groupIndex}-${i}`}
              d={createContour(
                group.x,
                group.y,
                30 + i * 34,
                i * 0.25 + group.phase
              )}
              fill="none"
              stroke="#a5f3fc"
              strokeWidth="1"
              opacity={0.3 - i * 0.025}
            />
          ))
        )}

        {/* Road glow */}
        <use
          href="#aurora-road-lines"
          filter="url(#aurora-road-glow)"
          opacity="0.8"
        />

        {/* Main road network */}
        <use href="#aurora-road-lines" opacity="0.95" />

        {/* Junction markers */}
        {junctions.map(([x, y], index) => (
          <g key={index}>
            <circle
              cx={x}
              cy={y}
              r="9"
              fill="#0b1040"
              stroke="#fff"
              strokeWidth="3"
            />
            <circle
              cx={x}
              cy={y}
              r="15"
              fill="none"
              stroke="#818cf8"
              opacity="0.45"
            >
              <animate
                attributeName="r"
                values="12;21;12"
                dur={`${2.5 + (index % 3)}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.45;0;0.45"
                dur={`${2.5 + (index % 3)}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* Animated travel route */}
        <path
          id="aurora-travel-route"
          d="M260 620 L380 500 H700 L820 380"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1 12"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-26"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>

        {/* Moving glowing traveler */}
        <circle r="7" fill="#fff" filter="url(#aurora-road-glow)">
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            path="M260 620 L380 500 H700 L820 380"
          />
        </circle>

        <circle r="4" fill="#fff">
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            path="M260 620 L380 500 H700 L820 380"
          />
        </circle>

        {/* Origin marker */}
        <circle
          cx="260"
          cy="620"
          r="13"
          fill="#fff"
          stroke="#6366f1"
          strokeWidth="4"
        />

        {/* Pulsing destination marker */}
        <circle cx="820" cy="380" r="9" fill="#fff" />

        <circle cx="820" cy="380" r="10" fill="#f472b6">
          <animate
            attributeName="r"
            values="10;24;10"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        <rect
          width="1200"
          height="760"
          fill="url(#aurora-vignette)"
        />
      </svg>

      {/* Additional floating particles */}
      <div className="aurora-floating-particles">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animationDelay: `${-(i % 8)}s`,
              animationDuration: `${4 + (i % 5)}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
