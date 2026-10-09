import { EDGES, NODES, PACKETS, SWEEPS, type NetNode } from "../data/network";
import { NODE_BY_ID, nodePos } from "../geometry/nodes";
import { TAU, hash, r2, saw, usePhase } from "../loop";

// Nodes/edges that sit on or below the orange wave are drawn above it.
const OVER_NODES = new Set(["n53", "n54", "n55", "n56", "n58", "n59"]);
const isOverEdge = ([a, b, tone]: (typeof EDGES)[number]) =>
  tone === "w" || OVER_NODES.has(a) || OVER_NODES.has(b);

const EDGE_STYLE = {
  o: { stroke: "#ee7036", opacity: 0.55, width: 0.45 },
  f: { stroke: "#ee7f42", opacity: 0.28, width: 0.4 },
  w: { stroke: "#ffffff", opacity: 0.6, width: 0.5 },
} as const;

const NodeMark = ({ n, x, y, phase }: { n: NetNode; x: number; y: number; phase: number }) => {
  switch (n.kind) {
    case "orange":
      return <circle cx={x} cy={y} r={n.r} fill={n.color ?? "#f26b1d"} />;
    case "pale":
      return <circle cx={x} cy={y} r={n.r} fill="#f08a52" opacity={0.85} />;
    case "black":
      return <circle cx={x} cy={y} r={n.r} fill="#1b1b1b" />;
    case "white":
      return <circle cx={x} cy={y} r={n.r} fill="#ffffff" />;
    case "ring":
      return <circle cx={x} cy={y} r={n.r} fill="#f6f3f1" stroke="#f26b1d" strokeWidth={0.7} />;
    case "ringDark":
      return <circle cx={x} cy={y} r={n.r} fill="#f6f3f1" stroke="#1b1b1b" strokeWidth={0.7} />;
    case "square": {
      // a square is 90°-symmetric, so a quarter turn per loop is seamless
      const rot = 90 * phase;
      return (
        <rect
          x={-n.r}
          y={-n.r}
          width={n.r * 2}
          height={n.r * 2}
          fill="none"
          stroke="#f08a52"
          strokeWidth={0.6}
          transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})`}
        />
      );
    }
    case "cross": {
      const rot = 90 * phase;
      return (
        <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)})`} stroke="#f08a52" strokeWidth={0.5}>
          <line x1={-n.r} x2={n.r} y1={0} y2={0} />
          <line x1={0} x2={0} y1={-n.r} y2={n.r} />
        </g>
      );
    }
    default:
      return null;
  }
};

export const Network = ({ layer }: { layer: "under" | "over" }) => {
  const phase = usePhase();
  const pos = (id: string) => nodePos(id, phase);
  const edges = EDGES.filter((e) => isOverEdge(e) === (layer === "over"));
  const nodes = NODES.filter((n) => n.kind !== "ghost" && OVER_NODES.has(n.id) === (layer === "over"));
  const packets = PACKETS.filter(([a, b]) => isOverEdge([a, b]) === (layer === "over"));

  return (
    <g>
      {layer === "under" &&
        SWEEPS.map(([x1, y1, cx, cy, x2, y2], i) => (
          <path
            key={`s${i}`}
            d={`M${x1} ${y1}Q${cx} ${cy + 6 * Math.sin(TAU * phase + i)} ${x2} ${y2}`}
            fill="none"
            stroke="#ee7f42"
            strokeWidth={0.4}
            opacity={0.26}
            pathLength={1000}
            strokeDasharray={i % 2 ? "6 10" : undefined}
            strokeDashoffset={i % 2 ? -16 * 4 * phase : undefined}
          />
        ))}

      {edges.map(([a, b, tone = "o"], i) => {
        const [x1, y1] = pos(a);
        const [x2, y2] = pos(b);
        const s = EDGE_STYLE[tone];
        return (
          <line
            key={`e${i}`}
            x1={r2(x1)}
            y1={r2(y1)}
            x2={r2(x2)}
            y2={r2(y2)}
            stroke={s.stroke}
            strokeWidth={s.width}
            opacity={s.opacity}
          />
        );
      })}

      {packets.map(([a, b, k, off], i) => {
        const t = saw(phase, k, off);
        const [x1, y1] = pos(a);
        const [x2, y2] = pos(b);
        const white = isOverEdge([a, b]);
        return (
          <circle
            key={`p${i}`}
            cx={r2(x1 + (x2 - x1) * t)}
            cy={r2(y1 + (y2 - y1) * t)}
            r={0.95}
            fill={white ? "#ffffff" : "#f05a0a"}
            opacity={r2(Math.sin(Math.PI * t) * 0.95)}
          />
        );
      })}

      {nodes.map((n) => {
        const [x, y] = pos(n.id);
        return <NodeMark key={n.id} n={n} x={r2(x)} y={r2(y)} phase={phase} />;
      })}
    </g>
  );
};

/** Expanding ring used to highlight a node that currently carries a label. */
export const PulseRing = ({ id, strength, tone }: { id: string; strength: number; tone: "dark" | "light" }) => {
  const phase = usePhase();
  if (strength <= 0) return null;
  const [x, y] = nodePos(id, phase);
  const node = NODE_BY_ID[id];
  const base = node.kind === "ghost" ? 4 : node.r + 1.5;
  const t = saw(phase, 4, hash(node.x) * 0.999);
  return (
    <circle
      cx={r2(x)}
      cy={r2(y)}
      r={r2(base + 7 * t)}
      fill="none"
      stroke={tone === "light" ? "#ffffff" : "#f26b1d"}
      strokeWidth={0.5}
      opacity={r2((1 - t) * 0.7 * strength)}
    />
  );
};
