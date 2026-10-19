// Math for the 3D tile-flip effect in the project showcase.

export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
export const easeOutQuart = (p: number) => 1 - (1 - p) ** 4;
export const easeInCubic = (p: number) => p * p * p;

/** Deterministic per-tile noise in [0, 1). */
export const noise = (a: number, b: number, c: number) => {
  const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453;
  return x - Math.floor(x);
};

/** Normalized stagger in [0, 1] for a tile at grid position (nx, ny) on wave shape k. */
export function waveDelay(k: number, nx: number, ny: number, n: number) {
  const radial = Math.hypot(nx - 0.5, ny - 0.5) / Math.SQRT1_2;
  const shapes = [
    nx * 0.85 + ny * 0.15, // sweep left → right
    1 - radial, // close in from the edges
    (nx + ny) / 2, // diagonal from top-left
    1 - nx * 0.85 - ny * 0.15, // sweep right → left
    ny * 0.8 + nx * 0.2, // fall top → bottom
    radial, // burst from the centre
    1 - (nx + ny) / 2, // diagonal from bottom-right
    n, // scatter
  ];
  return shapes[k % shapes.length] * 0.88 + n * 0.12;
}

/** Grid that keeps tiles roughly square (about `size` px tall) at any size. */
export function tileGrid(width: number, height: number, size = 90, maxRows = 7) {
  const rows = Math.min(maxRows, Math.max(4, Math.round(height / size)));
  const cols = Math.max(4, Math.round((width / height) * rows));
  return { cols, rows };
}

export const faceStyle = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' } as const;
