import { AbsoluteFill, Img, staticFile } from "remotion";
import { WIDE, MOBILE } from "../layouts";
import { usePhase } from "../loop";
import { DotGrid } from "./DotGrid";
import { Globe } from "./Globe";
import { HexIcons } from "./HexIcons";
import { Network } from "./Network";
import { ProjectTitle, SkillLabels } from "./SkillLabels";
import { Wave, WaveDefs } from "./Wave";

export type HeroSceneProps = {
  readonly layout: "wide" | "mobile";
  /** Studio only: overlays the reference banner and headline safe zones. */
  readonly debug: boolean;
};

export const BG = "#f6f3f1";

export const HeroScene = ({ layout, debug }: HeroSceneProps) => {
  const phase = usePhase();
  const L = layout === "wide" ? WIDE : MOBILE;
  const [vx, vy, vw, vh] = L.viewBox;

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg
        viewBox={L.viewBox.join(" ")}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        <WaveDefs />
        <rect x={vx} y={vy} width={vw} height={vh} fill={BG} />

        <Globe />
        <DotGrid x={1058.6} y={59} cols={7} rows={4} gap={7.2} color="#ef9a6a" opacity={0.8} />
        <Network layer="under" />
        <HexIcons layer="under" />

        <Wave />

        <DotGrid x={1127} y={281} cols={8} rows={4} gap={7} color="#ffffff" opacity={0.7} />
        <Network layer="over" />
        <HexIcons layer="over" />

        <SkillLabels layout={L} phase={phase} />
        <ProjectTitle layout={L} />

        {debug && (
          <g>
            {L.safeZones.map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill="#0070f3" opacity={0.12} stroke="#0070f3" strokeWidth={0.5} />
            ))}
          </g>
        )}
      </svg>

      {debug && layout === "wide" && (
        <Img
          src={staticFile("banner.png")}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.3 }}
        />
      )}
    </AbsoluteFill>
  );
};
