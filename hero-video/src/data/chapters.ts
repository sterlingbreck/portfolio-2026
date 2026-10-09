// Skills shown in the hero, grouped by the 4 most recent projects in
// ../../src/data/projects.ts. `sources` lists the exact tag strings each label
// stands for; `npm run check` fails if a project's tags or order drift.
//
// Each tag lives in one fixed slot (see layouts.ts) so a tag shared by
// consecutive chapters stays put instead of re-animating. Tags that never
// appear in the same chapter can share a slot.

export type TagKey = keyof typeof TAGS;

export const TAGS = {
  // Core: on screen for the whole loop, anchored to the hex icons.
  claude: { label: "Claude Code", sources: ["Claude Code"] },
  workers: { label: "Cloudflare Workers", sources: ["Cloudflare Workers"] },
  wrangler: { label: "Wrangler CLI", sources: ["Cloudflare Wrangler CLI", "Wrangler CLI"] },

  d1: { label: "Cloudflare D1", sources: ["Cloudflare D1 SQLite", "Cloudflare D1", "Cloudflare D1 + R2"] },
  durable: { label: "Durable Objects", sources: ["Cloudflare Durable Objects"] },
  typescript: { label: "TypeScript", sources: ["TypeScript"] },
  rtVideo: { label: "Realtime Video", sources: ["Realtime Video"] },
  rtAudio: { label: "Realtime Audio", sources: ["Realtime Audio"] },
  captions: { label: "Live Captions", sources: ["Live Captions"] },
  three: { label: "Three.js", sources: ["Three.js"] },
  webgl: { label: "WebGL2", sources: ["WebGL2"] },
  graphql: { label: "GraphQL", sources: ["GraphQL"] },
  streaming: { label: "Streaming Audio", sources: ["Streaming Audio"] },
  cron: { label: "CRON Jobs", sources: ["CRON Jobs"] },
  nextjs: { label: "NextJS", sources: ["NextJS"] },
  r2: { label: "R2 Storage", sources: ["Cloudflare D1 + R2", "Cloudflare R2 Storage"] },
  aiWorkers: { label: "AI Workers", sources: ["Cloudflare AI Workers"] },
  automation: { label: "Automation", sources: ["Automation"] },
  aiImage: { label: "AI Image Generation", sources: ["AI Image Generation"] },
  aiGateway: { label: "AI Gateway", sources: ["Cloudflare AI Gateway"] },
  turnstile: { label: "Turnstile", sources: ["Cloudflare Turnstile"] },
} as const;

export const CORE: TagKey[] = ["claude", "workers", "wrangler"];

export type SlotId = "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7";

export type Chapter = {
  /** Must match `title` in projects.ts. */
  project: string;
  /** Short display name. */
  title: string;
  tags: Partial<Record<SlotId, TagKey>>;
};

// Order = order in projects.ts (most recent first).
export const CHAPTERS: Chapter[] = [
  {
    project: "HumTalk",
    title: "HumTalk",
    tags: { s1: "d1", s2: "durable", s3: "typescript", s4: "rtVideo", s5: "rtAudio", s6: "captions" },
  },
  {
    project: "OBL",
    title: "OBL",
    tags: { s1: "d1", s2: "durable", s3: "three", s4: "cron", s5: "webgl", s6: "graphql", s7: "streaming" },
  },
  {
    project: "Bitcoin Video Magazine",
    title: "Bitcoin Video Magazine",
    tags: { s1: "d1", s2: "automation", s3: "typescript", s4: "cron", s5: "nextjs", s6: "r2", s7: "aiWorkers" },
  },
  {
    project: "AI Product Try-On Generator",
    title: "AI Product Try-On",
    tags: { s1: "aiImage", s2: "aiGateway", s3: "typescript", s4: "turnstile", s5: "nextjs", s6: "r2", s7: "aiWorkers" },
  },
];
