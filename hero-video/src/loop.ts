// Every animated value in the scene is built from these helpers so that the
// video is exactly periodic: frame LOOP renders identically to frame 0.
//
// Rules: only integer frequencies `k` per loop, no raw frame math, no
// unseeded randomness, no CSS animations.

import { useCurrentFrame } from "remotion";

export const FPS = 30;
export const LOOP = 600; // 20 s
export const TAU = Math.PI * 2;

export const frac = (v: number) => v - Math.floor(v);

/** Loop phase in [0, 1) — deliberately NOT wrapped, so frame 600 tests periodicity. */
export const usePhase = () => useCurrentFrame() / LOOP;

/** sin with an integer number of cycles per loop. */
export const osc = (phase: number, k: number, offset = 0) =>
  Math.sin(TAU * k * phase + offset);

/** Sawtooth 0→1 with an integer number of cycles per loop. */
export const saw = (phase: number, k: number, offset = 0) => frac(k * phase + offset);

/** Deterministic hash → [0, 1). */
export const hash = (...n: number[]) => {
  let h = 2166136261;
  for (const v of n) {
    h ^= Math.floor(v * 1000) | 0;
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
};

export const strHash = (s: string) => hash(...Array.from(s, (c) => c.charCodeAt(0)));

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** easeOutCubic / easeInOutCubic for chapter transitions. */
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeInOut = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export const r2 = (v: number) => Math.round(v * 100) / 100;
