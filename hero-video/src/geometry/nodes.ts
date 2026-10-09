import { NODES, type NetNode } from "../data/network";
import { TAU, hash, osc } from "../loop";

export const NODE_BY_ID: Record<string, NetNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));

/** Vertical float of the hex icons. */
export const hexFloat = (id: string, phase: number) => 1.5 * osc(phase, 1, hash(id.length, id.charCodeAt(2)) * TAU);

/** Animated position of a node: a small closed Lissajous drift. */
export const nodePos = (id: string, phase: number): [number, number] => {
  const n = NODE_BY_ID[id];
  if (!n) throw new Error(`Unknown node ${id}`);
  if (n.id.startsWith("e")) return [n.x, n.y];
  if (n.id.startsWith("hx")) return [n.x, n.y + hexFloat(id, phase)];
  const h1 = hash(n.x, n.y);
  const h2 = hash(n.y, n.x, 7);
  const amp = n.r > 3 ? 1.4 : 2;
  return [
    n.x + amp * osc(phase, 1, h1 * TAU),
    n.y + amp * osc(phase, h2 > 0.5 ? 2 : 1, h2 * TAU),
  ];
};
