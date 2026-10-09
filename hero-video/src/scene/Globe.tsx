import dots from "../data/globe-dots.json";
import { staticEdgeY } from "../geometry/wave";
import { TAU, r2, usePhase } from "../loop";

const CX = 235;
const CY = 300;
const RINGS = [
  { r: 235, dash: false, opacity: 0.38 },
  { r: 205, dash: true, opacity: 0.3 },
  { r: 172, dash: false, opacity: 0.22 },
];
const MERIDIAN_R = 158;
const MERIDIANS = 12; // spaced π/6 apart → rotating by π/6 per loop is seamless

// Dots hidden under the wave never need drawing.
const VISIBLE = (dots as [number, number, number][]).filter(([x, y]) => y < staticEdgeY(0, x) - 3);

const arc = (r: number, from = 8, to = 172) => {
  const p = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${r2(CX + r * Math.cos(a))} ${r2(CY - r * Math.sin(a))}`;
  };
  return `M${p(to)} A${r} ${r} 0 0 1 ${p(from)}`;
};

export const Globe = () => {
  const phase = usePhase();
  const spin = (Math.PI / 6) * phase;

  return (
    <g>
      {RINGS.map((ring) => (
        <path
          key={ring.r}
          d={arc(ring.r)}
          fill="none"
          stroke="#ee7f42"
          strokeWidth={0.45}
          opacity={ring.opacity}
          pathLength={1000}
          strokeDasharray={ring.dash ? "3 5" : undefined}
          strokeDashoffset={ring.dash ? -8 * 5 * phase : undefined}
        />
      ))}

      {Array.from({ length: MERIDIANS }, (_, i) => {
        const theta = (i * Math.PI) / 6 + spin;
        const sx = Math.sin(theta);
        const front = Math.cos(theta);
        const opacity = 0.05 + 0.16 * Math.min(1, Math.max(0, (front + 0.2) / 0.6));
        const pts: string[] = [];
        for (let k = 0; k <= 24; k++) {
          const phi = (k / 24) * (Math.PI / 2);
          pts.push(`${r2(CX + MERIDIAN_R * sx * Math.sin(phi))} ${r2(CY - MERIDIAN_R * Math.cos(phi))}`);
        }
        return (
          <polyline key={i} points={pts.join(" ")} fill="none" stroke="#ee7f42" strokeWidth={0.4} opacity={opacity} />
        );
      })}

      {VISIBLE.map(([x, y, d], i) => {
        const shimmer = 0.5 + 0.5 * Math.sin(TAU * (x / 190 - phase) + y / 60);
        const twinkle = 0.85 + 0.15 * Math.sin(TAU * (2 * phase) + i * 1.7);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={0.55 + 0.4 * d}
            fill="#4a4a4a"
            opacity={r2(Math.min(1, d * 2.2) * (0.45 + 0.55 * shimmer) * twinkle)}
          />
        );
      })}
    </g>
  );
};
