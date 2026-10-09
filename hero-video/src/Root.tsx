import { loadFont } from "@remotion/fonts";
import { Composition, Folder, staticFile } from "remotion";
import { HeroScene } from "./scene/HeroScene";

loadFont({
  family: "Geist Mono",
  url: staticFile("GeistMono.woff2"),
  weight: "100 900",
});

export const RemotionRoot = () => {
  return (
    <>
      <Folder name="Hero">
        <Composition
          id="HeroWide"
          component={HeroScene}
          durationInFrames={600}
          fps={30}
          width={2400}
          height={800}
          defaultProps={{ layout: "wide" as const, debug: false }}
        />
        <Composition
          id="HeroMobile"
          component={HeroScene}
          durationInFrames={600}
          fps={30}
          width={1200}
          height={900}
          defaultProps={{ layout: "mobile" as const, debug: false }}
        />
      </Folder>
      {/* One frame longer, so frame 600 can be rendered and compared with frame 0. */}
      <Folder name="LoopCheck">
        <Composition
          id="HeroWideCheck"
          component={HeroScene}
          durationInFrames={601}
          fps={30}
          width={2400}
          height={800}
          defaultProps={{ layout: "wide" as const, debug: false }}
        />
        <Composition
          id="HeroMobileCheck"
          component={HeroScene}
          durationInFrames={601}
          fps={30}
          width={1200}
          height={900}
          defaultProps={{ layout: "mobile" as const, debug: false }}
        />
      </Folder>
    </>
  );
};
