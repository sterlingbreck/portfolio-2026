// Node network traced from public/banner.png (banner pixel space).

export type NodeKind =
  | "orange" // filled orange dot
  | "pale" // small, lighter orange dot
  | "black" // filled charcoal dot
  | "white" // filled white dot (sits on the orange wave)
  | "ring" // hollow orange circle
  | "ringDark" // hollow charcoal circle
  | "square" // hollow orange square
  | "cross" // thin crosshair
  | "ghost"; // invisible endpoint for edges that leave the frame

export type NetNode = {
  id: string;
  x: number;
  y: number;
  kind: NodeKind;
  r: number;
  color?: string;
};

export const NODES: NetNode[] = [
  // Globe network (left)
  { id: "n1", x: 25.7, y: 135, kind: "black", r: 1.6 },
  { id: "n2", x: 11.7, y: 151.7, kind: "pale", r: 1.4 },
  { id: "n3", x: 68, y: 82, kind: "square", r: 3.5 },
  { id: "n4", x: 111, y: 114, kind: "pale", r: 2.4 },
  { id: "n5", x: 142, y: 81, kind: "pale", r: 1.5 },
  { id: "n6", x: 265, y: 65, kind: "pale", r: 1 },
  { id: "n7", x: 350.7, y: 94, kind: "pale", r: 1.5 },
  { id: "n8", x: 219, y: 95.7, kind: "pale", r: 0.9 },
  { id: "n9", x: 250, y: 128, kind: "orange", r: 1.8 },
  { id: "n10", x: 194, y: 128, kind: "pale", r: 1.5 },
  { id: "n11", x: 151, y: 138, kind: "ring", r: 1.6 },
  { id: "n12", x: 181.7, y: 151, kind: "ring", r: 1.6 },
  { id: "n13", x: 277.7, y: 143, kind: "orange", r: 1.3 },
  { id: "n14", x: 294, y: 138.7, kind: "pale", r: 1.4 },
  { id: "n15", x: 302, y: 161, kind: "pale", r: 1.6 },
  { id: "n16", x: 126.7, y: 174, kind: "orange", r: 1.8 },
  { id: "n17", x: 62.7, y: 187, kind: "orange", r: 1.8 },
  { id: "n18", x: 238, y: 193, kind: "orange", r: 2.6 },
  { id: "n19", x: 362, y: 185.7, kind: "pale", r: 1.6 },
  { id: "n20", x: 343, y: 195, kind: "ring", r: 1.5 },
  { id: "n21", x: 116, y: 207.7, kind: "ring", r: 2 },
  { id: "n22", x: 203, y: 229.7, kind: "orange", r: 2.9 },
  { id: "n23", x: 387, y: 222.7, kind: "orange", r: 1.5 },
  { id: "n24", x: 404, y: 215, kind: "ringDark", r: 2 },
  { id: "n25", x: 450, y: 210, kind: "orange", r: 1.6 },
  { id: "n26", x: 494.7, y: 202, kind: "ring", r: 3.4 },
  { id: "n27", x: 596.3, y: 192, kind: "black", r: 2.2 },
  { id: "n28", x: 552.7, y: 233, kind: "orange", r: 2.2, color: "#f04a0a" },
  { id: "n29", x: 536, y: 110.7, kind: "ring", r: 2.6 },
  { id: "n30", x: 175, y: 259, kind: "ring", r: 1 },
  { id: "n31", x: 103.7, y: 274, kind: "orange", r: 3.3 },
  { id: "n32", x: 35.3, y: 258, kind: "pale", r: 1.7 },
  { id: "n33", x: 11, y: 260, kind: "pale", r: 1.3 },
  { id: "n34", x: 73, y: 307, kind: "cross", r: 5 },
  { id: "n35", x: 402, y: 189, kind: "pale", r: 0.9 },
  { id: "n36", x: 312, y: 133, kind: "pale", r: 0.8 },

  // Middle + right network
  { id: "n40", x: 635.6, y: 171, kind: "ring", r: 2.6 },
  { id: "n41", x: 706, y: 210, kind: "black", r: 2.2 },
  { id: "n42", x: 728, y: 268, kind: "orange", r: 2.8 },
  { id: "n43", x: 821.6, y: 143, kind: "ring", r: 2.6 },
  { id: "n44", x: 918.6, y: 84, kind: "orange", r: 2.6, color: "#f05a0a" },
  { id: "n45", x: 1006, y: 66.5, kind: "orange", r: 1.9, color: "#f05a0a" },
  { id: "n46", x: 1027, y: 111, kind: "orange", r: 3.8, color: "#f05a0a" },
  { id: "n47", x: 1094.7, y: 114, kind: "orange", r: 1.6 },
  { id: "n48", x: 944.7, y: 142, kind: "ring", r: 1.7 },
  { id: "n49", x: 990, y: 144, kind: "orange", r: 2, color: "#f04a0a" },
  { id: "n50", x: 906, y: 182.6, kind: "orange", r: 3.8, color: "#f7931e" },
  { id: "n51", x: 966, y: 189.6, kind: "orange", r: 1.6 },
  { id: "n52", x: 843.7, y: 228, kind: "ring", r: 2 },
  { id: "n53", x: 1032, y: 287, kind: "white", r: 2.4 },
  { id: "n54", x: 1150, y: 262, kind: "white", r: 1.8 },
  { id: "n55", x: 1118.6, y: 337.4, kind: "orange", r: 3.8, color: "#f26b1d" },
  { id: "n56", x: 1033, y: 357, kind: "black", r: 3.8 },
  { id: "n57", x: 1154, y: 46.6, kind: "cross", r: 5 },
  { id: "n58", x: 893, y: 318, kind: "white", r: 1.8 },
  { id: "n59", x: 405, y: 306, kind: "white", r: 1.8 },

  // Hex icon centres (drawn by HexIcons, used as label anchors / edge ends)
  { id: "hx1", x: 808.7, y: 203.6, kind: "ghost", r: 29 },
  { id: "hx2", x: 867.5, y: 190.7, kind: "ghost", r: 19 },
  { id: "hx3", x: 1067.5, y: 247.7, kind: "ghost", r: 29 },
  { id: "hx4", x: 685, y: 287, kind: "ghost", r: 43 },

  // Off-frame endpoints
  { id: "e1", x: 860, y: 404, kind: "ghost", r: 0 },
  { id: "e2", x: 1204, y: 318, kind: "ghost", r: 0 },
  { id: "e3", x: 1204, y: 392, kind: "ghost", r: 0 },
  { id: "e4", x: 700, y: 404, kind: "ghost", r: 0 },
];

/** [from, to, tone] — tone "w" draws white (over the orange wave). */
export type NetEdge = readonly [string, string, ("o" | "w" | "f")?];

export const EDGES: NetEdge[] = [
  // globe
  ["n17", "n16"], ["n17", "n21"], ["n17", "n31"], ["n17", "n11"], ["n16", "n11"],
  ["n16", "n31"], ["n11", "n10"], ["n10", "n9"], ["n12", "n9"], ["n12", "n21"],
  ["n9", "n18"], ["n9", "n13"], ["n13", "n15"], ["n14", "n15"], ["n9", "n14"],
  ["n12", "n18"], ["n18", "n22"], ["n18", "n20"], ["n21", "n22"], ["n22", "n31"],
  ["n20", "n19"], ["n19", "n23"], ["n24", "n25"], ["n25", "n26"], ["n26", "n28"],
  ["n32", "n17"], ["n33", "n32"], ["n4", "n16"], ["n2", "n17"], ["n10", "n12"],
  ["n5", "n4", "f"], ["n7", "n15", "f"], ["n36", "n14", "f"], ["n35", "n19", "f"],
  ["n31", "n30", "f"], ["n24", "n23"],
  // middle
  ["n26", "n27", "f"], ["n27", "n40"], ["n40", "n41"], ["n41", "n42"], ["n41", "hx1"],
  ["n42", "hx1"], ["n27", "n28"], ["n29", "n40", "f"], ["n42", "hx4", "f"],
  // right
  ["n43", "n48"], ["n44", "n50"], ["n44", "n48"], ["n48", "n51"], ["n50", "n48"],
  ["n50", "n51"], ["n45", "n46"], ["n46", "n47"], ["n46", "n48"], ["n48", "n49"],
  ["n49", "n46"], ["n44", "n45", "f"], ["n45", "n47", "f"], ["n50", "hx2"],
  ["hx2", "hx1"], ["n52", "hx1"], ["n43", "hx1", "f"],
  // on / below the wave
  ["n53", "n55", "w"], ["n54", "n55", "w"], ["n56", "n55"], ["n56", "e1"],
  ["n55", "e2"], ["n56", "e3", "f"], ["n53", "e4", "w"], ["n58", "n53", "w"],
  ["n53", "hx3", "w"], ["n59", "n58", "w"],
];

/** Travelling "data packets". [from, to, cyclesPerLoop, phaseOffset] */
export const PACKETS: [string, string, number, number][] = [
  ["n17", "n31", 3, 0.1], ["n10", "n9", 2, 0.55], ["n18", "n22", 3, 0.3],
  ["n25", "n26", 2, 0.8], ["n27", "n40", 3, 0.2], ["n40", "n41", 2, 0.65],
  ["n41", "hx1", 3, 0.45], ["n44", "n50", 2, 0.05], ["n46", "n48", 3, 0.7],
  ["n50", "hx2", 2, 0.35], ["n53", "n55", 3, 0.9], ["n56", "n55", 2, 0.15],
  ["n58", "n53", 2, 0.5], ["n45", "n46", 3, 0.25],
];

/** Faint long arcs that sweep behind the network. Quadratic Béziers. */
export const SWEEPS: [number, number, number, number, number, number][] = [
  [380, 232, 610, 150, 832, 140],
  [450, 212, 720, 176, 944, 140],
  [820, 143, 960, 40, 1110, 112],
  [560, 236, 780, 200, 990, 146],
];
