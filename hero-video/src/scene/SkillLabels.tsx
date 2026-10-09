import { useCurrentFrame } from "remotion";
import { CHAPTERS, CORE, TAGS, type SlotId, type TagKey } from "../data/chapters";
import { nodePos } from "../geometry/nodes";
import type { Align, LabelSlot, Layout, Tone } from "../layouts";
import { LOOP, clamp01, easeInOut, easeOut, r2, strHash, hash } from "../loop";
import { PulseRing } from "./Network";

export const CHAPTER_FRAMES = LOOP / CHAPTERS.length; // 150 = 5 s
// Frame 0 lands mid-HumTalk with every label already typed in, so the
// poster (frame 0) shows a complete chapter.
const OFFSET = 45;

const ENTER_START = 4;
const ENTER_STAGGER = 4;
const ENTER_LEN = 16;
const EXIT_START = 100;
const EXIT_STAGGER = 4;
const EXIT_LEN = 22; // last exit ends at 100 + 6·4 + 22 = 146 < 150

const SLOT_ORDER: SlotId[] = ["s1", "s4", "s3", "s2", "s5", "s7", "s6"];

const mod = (a: number, n: number) => ((a % n) + n) % n;

export const chapterAt = (frame: number) => {
  const g = mod(Math.round(frame) + OFFSET, LOOP);
  const index = Math.floor(g / CHAPTER_FRAMES);
  return { index, u: g - index * CHAPTER_FRAMES };
};

const TONES: Record<Tone, { text: string; textOpacity: number; lead: string; leadOpacity: number }> = {
  dark: { text: "#171717", textOpacity: 0.66, lead: "#ef6a1f", leadOpacity: 0.8 },
  light: { text: "#ffffff", textOpacity: 0.96, lead: "#ffffff", leadOpacity: 0.8 },
};

type LabelProps = {
  slot: LabelSlot;
  text: string;
  seed: string;
  fontSize: number;
  /** 0 → hidden, 1 → fully typed */
  enter: number;
  /** 0 → intact, 1 → fully dissolved */
  exit: number;
  phase: number;
};

const ADVANCE = 0.6; // Geist Mono advance width (em)
const TRACKING = 0.14; // em

/** Per-character dissolve: each char fades at its own threshold, continuous at 0 and 1. */
const dissolveOpacity = (h: number, d: number) => clamp01((h + 0.17 - d * 1.17) * 6);

const startX = (align: Align, x: number, width: number) =>
  align === "start" ? x : align === "end" ? x - width : x - width / 2;

/** Monospace label drawn per character so it can type in and dissolve out. */
const Label = ({ slot, text, seed, fontSize, enter, exit, phase }: LabelProps) => {
  if (enter <= 0 || exit >= 1) return null;
  const tone = TONES[slot.tone];
  const chars = Array.from(text.toUpperCase());
  const step = fontSize * (ADVANCE + TRACKING);
  const width = chars.length * step - fontSize * TRACKING;
  const [ax, ay] = slot.at;
  const x0 = startX(slot.align, ax, width);

  // Leader line from the node to the label.
  const [nx, ny] = slot.from ?? nodePos(slot.node, phase);
  const midY = ay - fontSize * 0.36;
  const end: [number, number] =
    slot.align === "start"
      ? [x0 - 3, midY]
      : slot.align === "end"
        ? [x0 + width + 3, midY]
        : ny < ay
          ? [ax, ay - fontSize - 1.5]
          : [ax, ay + 2.5];
  const leadIn = easeOut(enter / 0.45);
  const leadOut = 1 - easeOut((exit - 0.35) / 0.65);
  const lead = Math.min(leadIn, leadOut);

  const typed = clamp01((enter - 0.25) / 0.75);
  const shown = Math.ceil(chars.length * typed);
  const dissolve = easeInOut(exit);
  const cursorOn = typed > 0 && typed < 1;

  return (
    <g>
      {lead > 0 && (
        <>
          <line
            x1={r2(nx)}
            y1={r2(ny)}
            x2={r2(nx + (end[0] - nx) * lead)}
            y2={r2(ny + (end[1] - ny) * lead)}
            stroke={tone.lead}
            strokeWidth={0.5}
            opacity={tone.leadOpacity}
          />
          <rect
            x={r2(end[0] - 0.9)}
            y={r2(end[1] - 0.9)}
            width={1.8}
            height={1.8}
            fill={tone.lead}
            opacity={r2(tone.leadOpacity * clamp01((lead - 0.85) / 0.15))}
          />
        </>
      )}
      {chars.slice(0, shown).map((c, i) => {
        const h = hash(strHash(seed), i);
        const o = dissolveOpacity(h, dissolve);
        if (o <= 0 || c === " ") return null;
        return (
          <text
            key={i}
            x={r2(x0 + i * step)}
            y={ay}
            fontSize={fontSize}
            fontFamily="Geist Mono"
            fontWeight={500}
            fill={tone.text}
            opacity={r2(tone.textOpacity * o)}
          >
            {c}
          </text>
        );
      })}
      {cursorOn && (
        <rect
          x={r2(x0 + shown * step)}
          y={r2(ay - fontSize * 0.74)}
          width={r2(fontSize * ADVANCE * 0.9)}
          height={r2(fontSize * 0.86)}
          fill={slot.tone === "light" ? "#ffffff" : "#ef6a1f"}
          opacity={0.85}
        />
      )}
    </g>
  );
};

export const SkillLabels = ({ layout, phase }: { layout: Layout; phase: number }) => {
  const frame = useCurrentFrame();
  const { index, u } = chapterAt(frame);
  const chapter = CHAPTERS[index];
  const prev = CHAPTERS[mod(index - 1, CHAPTERS.length)];
  const next = CHAPTERS[mod(index + 1, CHAPTERS.length)];

  const active = SLOT_ORDER.flatMap((slotId, rank) => {
    const tag = chapter.tags[slotId];
    if (!tag) return [];
    const enter = prev.tags[slotId] === tag ? 1 : clamp01((u - ENTER_START - ENTER_STAGGER * rank) / ENTER_LEN);
    const exit = next.tags[slotId] === tag ? 0 : clamp01((u - EXIT_START - EXIT_STAGGER * rank) / EXIT_LEN);
    return [{ slotId, tag, enter, exit }];
  });

  return (
    <g>
      {CORE.map((key) => {
        const slot = layout.core[key as keyof Layout["core"]];
        return (
          <g key={key}>
            <Label slot={slot} text={TAGS[key].label} seed={key} fontSize={layout.fontSize} enter={1} exit={0} phase={phase} />
          </g>
        );
      })}
      {active.map(({ slotId, tag, enter, exit }) => {
        const slot = layout.slots[slotId];
        const strength = Math.min(clamp01((enter - 0.6) / 0.4), 1 - clamp01(exit * 2));
        return (
          <g key={`${slotId}-${tag}`}>
            <PulseRing id={slot.node} strength={strength} tone={slot.tone} />
            <Label
              slot={slot}
              text={TAGS[tag as TagKey].label}
              seed={tag}
              fontSize={layout.fontSize}
              enter={enter}
              exit={exit}
              phase={phase}
            />
          </g>
        );
      })}
    </g>
  );
};

/** "01 / HUMTALK" with a progress rule that fills over the chapter. */
export const ProjectTitle = ({ layout }: { layout: Layout }) => {
  const frame = useCurrentFrame();
  const { index, u } = chapterAt(frame);
  const chapter = CHAPTERS[index];
  const text = `${String(index + 1).padStart(2, "0")} / ${chapter.title.toUpperCase()}`;
  const { at, align } = layout.title;
  const fontSize = layout.fontSize;
  const step = fontSize * (ADVANCE + TRACKING);
  const width = text.length * step - fontSize * TRACKING;
  const enter = clamp01((u - 2) / 16);
  const exit = clamp01((u - 126) / 20);
  const typed = Math.ceil(text.length * enter);
  const dissolve = easeInOut(exit);
  const x0 = startX(align, at[0], width);
  const ruleWidth = Math.max(layout.title.ruleWidth, width);
  const ruleX = startX(align, at[0], ruleWidth);
  const progress = u / CHAPTER_FRAMES;

  return (
    <g>
      {Array.from(text)
        .slice(0, typed)
        .map((c, i) => {
          const o = dissolveOpacity(hash(index, i), dissolve);
          if (o <= 0 || c === " ") return null;
          return (
            <text
              key={i}
              x={r2(x0 + i * step)}
              y={at[1]}
              fontSize={fontSize}
              fontFamily="Geist Mono"
              fontWeight={i < 2 ? 700 : 500}
              fill={i < 2 ? "#ef6a1f" : "#171717"}
              opacity={r2((i < 2 ? 0.95 : 0.7) * o)}
            >
              {c}
            </text>
          );
        })}
      <rect x={ruleX} y={at[1] + 4} width={ruleWidth} height={0.6} fill="#171717" opacity={0.14} />
      <rect x={ruleX} y={at[1] + 4} width={r2(ruleWidth * progress)} height={0.6} fill="#ef6a1f" opacity={0.9} />
      {CHAPTERS.map((_, i) => (
        <rect
          key={i}
          x={r2(align === "start" ? ruleX + ruleWidth + 6 + i * 4 : ruleX - 6 - (CHAPTERS.length - 1 - i) * 4)}
          y={at[1] + 3.2}
          width={2.2}
          height={2.2}
          fill={i === index ? "#ef6a1f" : "#171717"}
          opacity={i === index ? 0.95 : 0.2}
        />
      ))}
    </g>
  );
};
