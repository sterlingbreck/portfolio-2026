// Wave edges traced from public/banner.png (1188×396 banner pixel space).
//
// E0 = top of the upper charcoal ribbon (incl. grey sheen)
// E1 = top of the orange band (bottom of the upper ribbon)
// E2 = bottom of the orange band (top of the lower ribbon)
// E3 = bottom of the lower ribbon
//
// Columns: x, E0, E1, E2, E3

import { TAU, r2 } from "../loop";

const TABLE: [number, number, number, number, number][] = [
  [-66, 290, 312, 412, 446],
  [-33, 296, 318, 408, 442],
  [0, 303, 325, 404, 440],
  [33, 312, 336, 402, 438],
  [66, 318, 343, 398, 432],
  [99, 319, 342, 390, 420],
  [132, 314, 336, 378, 404],
  [165, 305, 326, 366, 391],
  [198, 293, 314, 360, 383],
  [231, 280, 302, 357, 374],
  [264, 267, 291, 354, 365],
  [297, 255, 280, 345, 357],
  [330, 246, 270, 338, 350],
  [363, 239, 264, 334, 346],
  [396, 236, 260, 332, 344],
  [429, 235, 258, 333, 345],
  [462, 236, 260, 338, 350],
  [495, 240, 264, 346, 357],
  [528, 247, 272, 356, 367],
  [561, 255, 282, 370, 379],
  [594, 264, 295, 384, 392],
  [627, 272, 310, 398, 405],
  [660, 279, 322, 410, 416],
  [693, 286, 328, 418, 424],
  [726, 286, 330, 421, 427],
  [759, 283, 326, 415, 421],
  [792, 277, 318, 403, 409],
  [825, 268, 307, 390, 396],
  [858, 255, 292, 378, 384],
  [891, 238, 274, 365, 371],
  [924, 218, 254, 352, 358],
  [957, 196, 234, 341, 347],
  [990, 175, 212, 332, 338],
  [1023, 154, 192, 326, 332],
  [1056, 134, 173, 323, 330],
  [1089, 117, 156, 322, 330],
  [1122, 102, 141, 324, 333],
  [1155, 91, 130, 329, 338],
  [1188, 82, 122, 335, 345],
  [1221, 74, 113, 341, 352],
  [1254, 67, 105, 347, 358],
];

const X0 = TABLE[0][0];
const DX = 33;

/** Catmull-Rom through the traced samples. */
const baseEdge = (edge: 0 | 1 | 2 | 3, x: number) => {
  const col = edge + 1;
  const f = (x - X0) / DX;
  const i = Math.max(1, Math.min(TABLE.length - 3, Math.floor(f)));
  const t = f - i;
  const p0 = TABLE[i - 1][col];
  const p1 = TABLE[i][col];
  const p2 = TABLE[i + 1][col];
  const p3 = TABLE[i + 2][col];
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
  );
};

/** Shared swell: one long wave travelling right, one short wave travelling left. */
const swell = (x: number, phase: number) =>
  5 * Math.sin(TAU * (x / 760 - phase)) +
  2.4 * Math.sin(TAU * (x / 330 + 2 * phase) + 1.3);

/** Per-edge ripples so the ribbons breathe against each other. */
const ripple = (edge: number, x: number, phase: number) => {
  switch (edge) {
    case 0:
      return 1.8 * Math.sin(TAU * (x / 420 - phase) + 0.4);
    case 1:
      return 1.2 * Math.sin(TAU * (x / 520 - 2 * phase) + 1.9);
    case 2:
      return 2.0 * Math.sin(TAU * (x / 480 - phase) + 3.1);
    default:
      return 2.0 * Math.sin(TAU * (x / 480 - phase) + 3.1) + 1.6 * Math.sin(TAU * (x / 380 + phase) + 0.7);
  }
};

export const edgeY = (edge: 0 | 1 | 2 | 3, x: number, phase: number) =>
  baseEdge(edge, x) + swell(x, phase) + ripple(edge, x, phase);

export const staticEdgeY = (edge: 0 | 1 | 2 | 3, x: number) => baseEdge(edge, x);

export const X_START = -40;
export const X_END = 1230;
const STEP = 6;
export const SAMPLES: number[] = [];
for (let x = X_START; x <= X_END; x += STEP) SAMPLES.push(x);

/** Curve at fraction `s` between two edges (0 → a, 1 → b). */
export const between = (
  a: 0 | 1 | 2 | 3,
  b: 0 | 1 | 2 | 3,
  s: number | ((x: number) => number),
  phase: number,
) =>
  SAMPLES.map((x) => {
    const ya = edgeY(a, x, phase);
    const yb = edgeY(b, x, phase);
    const f = typeof s === "number" ? s : s(x);
    return [x, ya + (yb - ya) * f] as const;
  });

type Pt = readonly [number, number];

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
export const smoothPath = (pts: readonly Pt[], move = true) => {
  let d = move ? `M${r2(pts[0][0])} ${r2(pts[0][1])}` : `L${r2(pts[0][0])} ${r2(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(p2[0])} ${r2(p2[1])}`;
  }
  return d;
};

/** Closed band between two curves. */
export const bandPath = (top: readonly Pt[], bottom: readonly Pt[]) =>
  `${smoothPath(top)}${smoothPath([...bottom].reverse(), false)}Z`;
