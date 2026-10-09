import { nodePos } from "../geometry/nodes";
import { osc, r2, saw, usePhase } from "../loop";

/** Pointy-top hexagon centred on 0,0. */
const hex = (r: number) => {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + 60 * i) * Math.PI) / 180;
    return `${r2(r * Math.cos(a))} ${r2(r * Math.sin(a))}`;
  });
  return `M${pts.join("L")}Z`;
};

const SHIELD =
  "M0 -9.5L7.2 -6.6L7.2 0.6C7.2 5.6 3.8 8.8 0 10.6C-3.8 8.8 -7.2 5.6 -7.2 0.6L-7.2 -6.6Z";

export const HexIcons = ({ layer }: { layer: "under" | "over" }) => {
  const phase = usePhase();
  const at = (id: string) => {
    const [x, y] = nodePos(id, phase);
    return `translate(${r2(x)} ${r2(y)})`;
  };

  if (layer === "over") {
    // Shield sits on the orange wave.
    const pulse = saw(phase, 2, 0.3);
    return (
      <g transform={at("hx3")}>
        <path d={hex(29)} fill="none" stroke="#ffffff" strokeWidth={0.8} opacity={0.85} />
        <path
          d={hex(29 * (1 + 0.32 * pulse))}
          fill="none"
          stroke="#ffffff"
          strokeWidth={0.5}
          opacity={r2(0.45 * (1 - pulse))}
        />
        <path d={SHIELD} fill="none" stroke="#ffffff" strokeWidth={0.8} opacity={0.35} />
        <path
          d={SHIELD}
          fill="none"
          stroke="#ffffff"
          strokeWidth={0.95}
          strokeLinejoin="round"
          pathLength={100}
          strokeDasharray="62 38"
          strokeDashoffset={r2(-100 * phase)}
        />
        <path d="M-3.4 0.2L0 3.2L3.4 0.2M0 3.2V-2.6" fill="none" stroke="#ffffff" strokeWidth={0.8} strokeLinecap="round" />
      </g>
    );
  }

  const gap = 4.6 + 1.1 * osc(phase, 2, 0.6);
  // Inner cube: hexagon + Y has 120° symmetry, so 120° per loop is seamless.
  const cubeRot = 120 * phase;

  return (
    <g>
      {/* Large faint hex behind the ribbon */}
      <g transform={at("hx4")}>
        <path d={hex(43)} fill="none" stroke="#d8b9a5" strokeWidth={0.5} opacity={0.75} />
      </g>

      {/* Stacked layers */}
      <g transform={at("hx1")}>
        <path d={hex(29)} fill="#f6f3f1" stroke="#f26b1d" strokeWidth={0.8} />
        <g transform={`translate(0 ${r2(-gap * 0.35)})`}>
          <path d={`M-9 ${r2(gap)}L0 ${r2(gap + 4.6)}L9 ${r2(gap)}`} fill="none" stroke="#f26b1d" strokeWidth={1.3} strokeLinejoin="round" />
          <path d={`M-9 ${r2(gap / 2)}L0 ${r2(gap / 2 + 4.6)}L9 ${r2(gap / 2)}`} fill="none" stroke="#f26b1d" strokeWidth={1.3} strokeLinejoin="round" />
          <path d="M0 -4.6L9 0L0 4.6L-9 0Z" fill="#f04a0a" />
        </g>
      </g>

      {/* Wireframe cube */}
      <g transform={at("hx2")}>
        <path d={hex(19)} fill="#f6f3f1" stroke="#eba27a" strokeWidth={0.55} />
        <g transform={`rotate(${r2(cubeRot)})`} stroke="#eb8c57" strokeWidth={0.55} fill="none">
          <path d={hex(8.5)} />
          {[90, 210, 330].map((deg) => {
            const a = (deg * Math.PI) / 180;
            return <line key={deg} x1={0} y1={0} x2={r2(8.5 * Math.cos(a))} y2={r2(8.5 * Math.sin(a))} />;
          })}
        </g>
      </g>
    </g>
  );
};
