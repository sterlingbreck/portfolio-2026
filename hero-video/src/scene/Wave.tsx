import { useMemo } from "react";
import { between, bandPath, smoothPath } from "../geometry/wave";
import { TAU, r2, usePhase } from "../loop";

// Curve-following gradients are built by stacking bands [s, 1] (or [0, s])
// back to front: every band is fully covered by the next except its own
// strip, so there are no anti-aliasing seams between strips.

type Stop = [number, [number, number, number]];

const hex = (c: string): [number, number, number] => [
  parseInt(c.slice(1, 3), 16),
  parseInt(c.slice(3, 5), 16),
  parseInt(c.slice(5, 7), 16),
];

/** Sample a colour ramp into `n` strips: [startFraction, rgb()]. */
const ramp = (stops: [number, string][], n: number): [number, string][] => {
  const parsed: Stop[] = stops.map(([s, c]) => [s, hex(c)]);
  return Array.from({ length: n }, (_, i) => {
    const s = i / n;
    const mid = (i + 0.5) / n;
    const j = Math.max(0, parsed.findIndex(([p]) => p > mid) - 1);
    const [s0, c0] = parsed[j];
    const [s1, c1] = parsed[Math.min(parsed.length - 1, j + 1)];
    const t = s1 === s0 ? 0 : Math.min(1, (mid - s0) / (s1 - s0));
    const c = c0.map((v, k) => Math.round(v + (c1[k] - v) * t));
    return [s, `rgb(${c.join(",")})`];
  });
};

const UPPER_STRIPS = ramp(
  [
    [0, "#efecea"],
    [0.08, "#d6d4d2"],
    [0.18, "#a3a2a1"],
    [0.28, "#666565"],
    [0.4, "#333333"],
    [0.6, "#232323"],
    [1, "#1b1b1b"],
  ],
  22,
);

const LOWER_STRIPS = ramp(
  [
    [0, "#1c1c1c"],
    [0.5, "#222222"],
    [0.68, "#3f3f3f"],
    [0.84, "#8f8e8d"],
    [1, "#e2e0de"],
  ],
  16,
);

const FLOW_LINES = [
  { s: 0.13, k: 1, off: 0.1, w: 0.5, dash: "620 40 240 100", glintK: 1, glintOff: 0.15, o: 0.5 },
  { s: 0.27, k: 1, off: 0.4, w: 0.4, dash: "860 140", glintK: 2, glintOff: 0.6, o: 0.38 },
  { s: 0.41, k: 1, off: 0.7, w: 0.65, dash: "1000 0", glintK: 1, glintOff: 0.45, o: 0.55 },
  { s: 0.56, k: 2, off: 0.25, w: 0.4, dash: "540 60 300 100", glintK: 1, glintOff: 0.9, o: 0.32 },
  { s: 0.71, k: 1, off: 0.55, w: 0.5, dash: "760 240", glintK: 2, glintOff: 0.3, o: 0.42 },
  { s: 0.86, k: 1, off: 0.85, w: 0.4, dash: "1000 0", glintK: 1, glintOff: 0.75, o: 0.28 },
];
const dashPeriod = (dash: string) => dash.split(" ").reduce((a, b) => a + Number(b), 0);

export const WaveDefs = () => (
  <defs>
    <linearGradient id="orangeFill" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={1188} y2={0}>
      <stop offset={0} stopColor="#1b1b1b" />
      <stop offset={0.1} stopColor="#1e1e1e" />
      <stop offset={0.15} stopColor="#4a2913" />
      <stop offset={0.19} stopColor="#b5560f" />
      <stop offset={0.23} stopColor="#e9761a" />
      <stop offset={0.42} stopColor="#f68b1f" />
      <stop offset={0.66} stopColor="#f7891c" />
      <stop offset={0.84} stopColor="#f37414" />
      <stop offset={1} stopColor="#ee5f0b" />
    </linearGradient>
    <linearGradient id="lowerFade" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={1188} y2={0}>
      <stop offset={0} stopColor="#fff" stopOpacity={1} />
      <stop offset={0.37} stopColor="#fff" stopOpacity={1} />
      <stop offset={0.52} stopColor="#fff" stopOpacity={0} />
      <stop offset={0.7} stopColor="#fff" stopOpacity={0} />
      <stop offset={0.84} stopColor="#fff" stopOpacity={0.22} />
      <stop offset={1} stopColor="#fff" stopOpacity={0.32} />
    </linearGradient>
    <mask id="lowerMask" maskUnits="userSpaceOnUse" x={-100} y={-100} width={1400} height={700}>
      <rect x={-100} y={-100} width={1400} height={700} fill="url(#lowerFade)" />
    </mask>
    <linearGradient id="flowStroke" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={1188} y2={0}>
      <stop offset={0} stopColor="#fff" stopOpacity={0.55} />
      <stop offset={0.3} stopColor="#fff" stopOpacity={0.8} />
      <stop offset={0.6} stopColor="#fff" stopOpacity={0.9} />
      <stop offset={1} stopColor="#fff" stopOpacity={0.6} />
    </linearGradient>
  </defs>
);

export const Wave = () => {
  const phase = usePhase();

  const shapes = useMemo(() => {
    const curve = (a: 0 | 1 | 2, b: 1 | 2 | 3, s: number) => between(a, b, s, phase);
    const upper = UPPER_STRIPS.map(([s, color]) => ({ d: bandPath(curve(0, 1, s), curve(0, 1, 1)), color }));
    const lower = LOWER_STRIPS.map(([s, color]) => ({ d: bandPath(curve(2, 3, s), curve(2, 3, 1)), color }));
    const core = bandPath(curve(1, 2, 0), curve(1, 2, 1));
    const highlight = [0.05, 0.1, 0.16, 0.24].map((s) => bandPath(curve(1, 2, 0), curve(1, 2, s)));
    const shade = [0.55, 0.68, 0.8, 0.9].map((s) => bandPath(curve(1, 2, s), curve(1, 2, 1)));
    const brushed = [0.5, 0.66, 0.8].map((s, i) =>
      smoothPath(between(0, 1, (x) => s + 0.05 * Math.sin(TAU * (x / 600 + phase) + i * 2), phase)),
    );
    const flows = FLOW_LINES.map((f, i) =>
      smoothPath(
        between(1, 2, (x) => f.s + 0.035 * Math.sin(TAU * (x / (420 + i * 70) - f.k * phase) + f.off * TAU), phase),
      ),
    );
    return { upper, lower, core, highlight, shade, brushed, flows };
  }, [phase]);

  return (
    <g>
      <g mask="url(#lowerMask)">
        {shapes.lower.map((b, i) => (
          <path key={i} d={b.d} fill={b.color} />
        ))}
      </g>

      <path d={shapes.core} fill="url(#orangeFill)" />
      {shapes.highlight.map((d, i) => (
        <path key={`h${i}`} d={d} fill="#fff4e6" opacity={0.045} />
      ))}
      {shapes.shade.map((d, i) => (
        <path key={`d${i}`} d={d} fill="#b8340a" opacity={0.07} />
      ))}

      {shapes.upper.map((b, i) => (
        <path key={`u${i}`} d={b.d} fill={b.color} />
      ))}
      {shapes.brushed.map((d, i) => (
        <path key={`b${i}`} d={d} fill="none" stroke="#5a5a5a" strokeWidth={0.5} opacity={0.35} />
      ))}

      {shapes.flows.map((d, i) => {
        const f = FLOW_LINES[i];
        const period = dashPeriod(f.dash);
        return (
          <g key={`f${i}`}>
            <path
              d={d}
              fill="none"
              stroke="url(#flowStroke)"
              strokeWidth={f.w}
              opacity={f.o}
              pathLength={1000}
              strokeDasharray={f.dash}
              strokeDashoffset={r2(-period * f.k * phase - f.off * period)}
            />
            <path
              d={d}
              fill="none"
              stroke="#ffffff"
              strokeWidth={f.w + 0.6}
              strokeLinecap="round"
              opacity={0.6}
              pathLength={1000}
              strokeDasharray="60 940"
              strokeDashoffset={r2(-1000 * f.glintK * phase - f.glintOff * 1000)}
            />
          </g>
        );
      })}
    </g>
  );
};
