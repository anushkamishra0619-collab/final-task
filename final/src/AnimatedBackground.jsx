import { useMemo } from "react";

const STARS = [
  [120, 90], [300, 40], [520, 120], [880, 60], [1180, 90], [1420, 160], [1500, 420],
  [1380, 700], [1000, 850], [640, 800], [200, 640], [90, 380], [760, 420], [1240, 330],
];

function Station({ x, y, r = 11, fill = "#0b0b14", stroke = "#fff", ring = "#c3b2f7", delay = 0 }) {
  return (
    <g>
      <circle
        className="ab-ring" cx={x} cy={y} r={r} fill="none" stroke={ring} strokeWidth="3"
        style={{ transformOrigin: `${x}px ${y}px`, animationDelay: `${delay}s` }}
      />
      <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth="4" />
    </g>
  );
}

export default function AnimatedBackground({ children }) {
  // skip the moving pulses for people who prefer reduced motion
  const reduce = useMemo(
    () => typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
    []
  );

  return (
    <section className="ab">
      <svg className="ab-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <filter id="ab-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="ab-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* the three routes (same layout as before) */}
          <path id="ab-p1" pathLength="100" fill="none"
                d="M560 -20 L760 200 L1100 200 L1320 -20" />
          <path id="ab-p2" pathLength="100" fill="none"
                d="M290 360 L400 480 L400 720 L580 920" />
          <path id="ab-p3" pathLength="100" fill="none"
                d="M-20 860 L340 860 L500 700 L940 700 L1100 540 L1620 540" />
        </defs>

        {/* faint contour rings */}
        <g className="ab-contour" fill="none">
          <ellipse cx="980" cy="470" rx="300" ry="170" />
          <ellipse cx="980" cy="470" rx="210" ry="115" />
          <ellipse cx="980" cy="470" rx="120" ry="62" />
          <ellipse cx="300" cy="300" rx="240" ry="140" />
          <ellipse cx="1350" cy="760" rx="220" ry="120" />
        </g>

        {/* twinkling stars */}
        {STARS.map(([x, y], i) => (
          <circle key={i} className="ab-star" cx={x} cy={y} r={i % 3 === 0 ? 2.5 : 1.6}
                  style={{ animationDelay: `${(i % 7) * 0.6}s` }} />
        ))}

        {/* glow under each route */}
        <use href="#ab-p1" stroke="#f472b6" strokeWidth="14" opacity=".35" filter="url(#ab-blur)" />
        <use href="#ab-p2" stroke="#22d3ee" strokeWidth="14" opacity=".35" filter="url(#ab-blur)" />
        <use href="#ab-p3" stroke="#c3b2f7" strokeWidth="14" opacity=".3" filter="url(#ab-blur)" />

        {/* crisp routes (draw in on load) */}
        <use className="ab-draw" href="#ab-p1" stroke="#f472b6" strokeWidth="6"
             strokeLinecap="round" strokeLinejoin="round" style={{ animationDelay: "0s" }} />
        <use className="ab-draw" href="#ab-p2" stroke="#22d3ee" strokeWidth="6"
             strokeLinecap="round" strokeLinejoin="round" style={{ animationDelay: "0.4s" }} />
        <use className="ab-flow" href="#ab-p3" stroke="#c3b2f7" strokeWidth="6"
             strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 14" />

        {/* stations */}
        <Station x={760} y={200} ring="#f472b6" delay={0} />
        <Station x={1100} y={200} ring="#f472b6" delay={0.8} />
        <Station x={400} y={480} ring="#22d3ee" delay={0.4} />
        <Station x={400} y={720} ring="#22d3ee" delay={1.2} />
        <Station x={500} y={700} ring="#c3b2f7" delay={0.6} />
        <Station x={940} y={700} ring="#c3b2f7" delay={1.4} />
        <Station x={1100} y={540} r={15} fill="#c6f24e" ring="#c6f24e" delay={0.2} />
        <Station x={340} y={860} r={13} fill="#4b4b5c" stroke="#2b2b3a" ring="#4b4b5c" delay={1} />

        {/* travelling pulses */}
        {!reduce && (
          <g filter="url(#ab-glow)">
            <circle r="7" fill="#c6f24e">
              <animateMotion dur="6s" repeatCount="indefinite" begin="1s"><mpath href="#ab-p1" /></animateMotion>
            </circle>
            <circle r="7" fill="#c6f24e">
              <animateMotion dur="7s" repeatCount="indefinite" begin="2s"><mpath href="#ab-p2" /></animateMotion>
            </circle>
            <circle r="7" fill="#c6f24e">
              <animateMotion dur="10s" repeatCount="indefinite" begin="0.5s"><mpath href="#ab-p3" /></animateMotion>
            </circle>
          </g>
        )}
      </svg>

      <div className="ab-content">{children}</div>
    </section>
  );
}