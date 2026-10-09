// Composition layouts. Everything is authored in banner pixel space
// (1188×396, the reference PNG); a layout picks the visible window (viewBox)
// and where labels sit inside it.
//
// Wide label zones avoid the site's HTML headline, measured at 1024–2560px
// viewports: H1 reaches x 832 / y 135 at 1280px, the tagline + CTA row
// x 731 / y 166 at 1024×768, x 585 / y 245 at 1280×720.

import type { SlotId, TagKey } from "./data/chapters";

export type Align = "start" | "middle" | "end";
export type Tone = "dark" | "light";

export type LabelSlot = {
  /** Network node id the label hangs off. */
  node: string;
  /** Point on the node where the leader line starts (defaults to node centre). */
  from?: readonly [number, number];
  /** Text baseline anchor. */
  at: readonly [number, number];
  align: Align;
  tone: Tone;
};

export type Layout = {
  viewBox: readonly [number, number, number, number];
  fontSize: number;
  core: Record<Extract<TagKey, "claude" | "workers" | "wrangler">, LabelSlot>;
  slots: Record<SlotId, LabelSlot>;
  title: { at: readonly [number, number]; align: Align; ruleWidth: number };
  /** Debug overlay only: where the site's HTML headline/tagline/CTA sit. */
  safeZones: readonly (readonly [number, number, number, number])[];
};

export const WIDE: Layout = {
  viewBox: [0, 0, 1188, 396],
  fontSize: 8.6,
  core: {
    claude: { node: "hx1", from: [808.7, 232.6], at: [808.7, 248], align: "middle", tone: "dark" },
    workers: { node: "hx2", from: [867.5, 171.7], at: [867.5, 165], align: "middle", tone: "dark" },
    wrangler: { node: "hx3", from: [1067.5, 218.7], at: [1067.5, 209], align: "middle", tone: "light" },
  },
  slots: {
    s1: { node: "n44", at: [931, 80], align: "start", tone: "dark" },
    s2: { node: "n40", at: [646, 165], align: "start", tone: "dark" },
    s3: { node: "n48", at: [955, 136], align: "start", tone: "dark" },
    s4: { node: "n43", at: [820, 128], align: "middle", tone: "dark" },
    s5: { node: "n41", at: [697, 221], align: "end", tone: "dark" },
    s6: { node: "n53", at: [1042, 291], align: "start", tone: "light" },
    s7: { node: "n58", at: [903, 315], align: "start", tone: "light" },
  },
  title: { at: [1176, 375], align: "end", ruleWidth: 132 },
  safeZones: [
    [0, 0, 745, 160], // H1 at 1280–1920px
    [0, 160, 600, 95], // tagline + CTA row
  ],
};

// Mobile (<768px): the video sits in page flow *below* the headline, so the
// whole frame is free. A 4:3 window onto the right two thirds of the banner.
export const MOBILE: Layout = {
  viewBox: [440, -70, 748, 561],
  fontSize: 17,
  core: {
    claude: { node: "hx1", from: [808.7, 232.6], at: [808.7, 256], align: "middle", tone: "dark" },
    workers: { node: "hx2", from: [867.5, 171.7], at: [867.5, 165], align: "middle", tone: "dark" },
    wrangler: { node: "hx3", from: [1067.5, 218.7], at: [1067.5, 208], align: "middle", tone: "light" },
  },
  slots: {
    s1: { node: "n44", at: [905, 30], align: "end", tone: "dark" },
    s2: { node: "n45", at: [1050, 2], align: "middle", tone: "dark" },
    s3: { node: "n48", at: [932, 128], align: "end", tone: "dark" },
    s4: { node: "n29", at: [548, 106], align: "start", tone: "dark" },
    s5: { node: "n28", at: [565, 240], align: "start", tone: "dark" },
    s6: { node: "n53", at: [1020, 300], align: "end", tone: "light" },
    s7: { node: "n58", at: [880, 360], align: "end", tone: "light" },
  },
  title: { at: [462, -36], align: "start", ruleWidth: 200 },
  safeZones: [],
};
