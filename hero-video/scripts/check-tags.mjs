// Verifies src/data/chapters.ts still matches the 4 most recent projects in
// ../src/data/projects.ts (order, titles and every referenced tag string).
import { readFileSync } from "node:fs";
import { CHAPTERS, TAGS, CORE } from "../src/data/chapters.ts";

const src = readFileSync(new URL("../../src/data/projects.ts", import.meta.url), "utf8");
const projects = [];
const re = /title:\s*'([^']+)'[\s\S]*?tags:\s*\[([\s\S]*?)\]/g;
for (let m; (m = re.exec(src)) && projects.length < 4; ) {
  projects.push({ title: m[1], tags: [...m[2].matchAll(/'([^']+)'/g)].map((t) => t[1]) });
}

const errors = [];
CHAPTERS.forEach((ch, i) => {
  const p = projects[i];
  if (!p || p.title !== ch.project) {
    errors.push(`Chapter ${i + 1}: expected project "${ch.project}", projects.ts has "${p?.title}"`);
    return;
  }
  const keys = [...CORE, ...Object.values(ch.tags)];
  for (const key of keys) {
    const tag = TAGS[key];
    if (!tag.sources.some((s) => p.tags.includes(s)))
      errors.push(`${p.title}: "${tag.label}" — none of [${tag.sources.join(", ")}] in its tags`);
  }
});

if (errors.length) {
  console.error("Hero skills are out of sync with projects.ts:\n  " + errors.join("\n  "));
  process.exit(1);
}
console.log("✓ chapters match:", projects.map((p) => p.title).join(" → "));
