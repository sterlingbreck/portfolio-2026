/** Scene background: the site's sand (--color-sand in ../src/index.css), so the video blends into the page. */
export const BG = "#f3d4a7";

/** Draw the orange-and-black wave. Off, the scene is just the labels and network on BG. */
export const SHOW_WAVE = false;

/** Marks that sit over the wave are white on it; without the wave they use the network's orange. */
export const ON_WAVE = SHOW_WAVE ? "#ffffff" : "#f26b1d";

/** Darkest tone of the wave's black edges; the halo ramps blend from BG to this. */
export const DARK = "#1b1b1b";

const rgb = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));

/** `t` of the way from `a` to `b` (0 = a, 1 = b), as a hex colour. */
export const mix = (a: string, b: string, t: number) => {
  const [ca, cb] = [rgb(a), rgb(b)];
  return `#${ca.map((v, k) => Math.round(v + (cb[k] - v) * t).toString(16).padStart(2, "0")).join("")}`;
};
