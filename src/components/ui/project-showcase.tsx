import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { projects } from '../../data/projects';
import { useMediaQuery } from '../../lib/useMediaQuery';
import { clamp01, easeInCubic, easeInOutCubic, easeOutQuart, faceStyle, noise, tileGrid, waveDelay } from '../../lib/tileFlip';
import humTalk from '../../assets/projects/projects-hum-1.png';
import obl from '../../assets/projects/projects-ooga-2.png';
import bvm from '../../assets/projects/projects-bvm-0.png';
import withoutRulers from '../../assets/projects/projects-wor-3.png';
import rumbleKing from '../../assets/projects/projects-rk-1.png';
import akamai from '../../assets/projects/projects-akamai-2.png';
import nissan from '../../assets/projects/projects-nissan-2.png';
import gorman from '../../assets/projects/projects-gorman-2.png';

/*
 * Project reel: a 20s seamless loop rendered live in the DOM (no video).
 * Every visual is a pure function of loop time t ∈ [0, LOOP), so t = LOOP is
 * pixel-identical to t = 0:
 *  - the mosaic tiles make one 180° turn per project and the turn directions
 *    sum to zero, so each tile ends on its starting face and angle;
 *  - the index odometer and progress marker roll onto a duplicate of the first
 *    entry, which is indistinguishable from the start;
 *  - ambient drift only uses whole cycles of the loop.
 */

// One image per project, plus a focal point for the wide crop.
const REEL = [
  { id: 'project-1', image: humTalk, focus: '50% 40%' },
  { id: 'project-2', image: obl, focus: '50% 55%' },
  { id: 'project-3', image: bvm, focus: '50% 28%' },
  { id: 'project-5', image: withoutRulers, focus: '50% 32%' },
  { id: 'project-8', image: rumbleKing, focus: '50% 72%' },
  { id: 'project-11', image: akamai, focus: '50% 18%' },
  { id: 'project-14', image: nissan, focus: '50% 52%' },
  { id: 'project-16', image: gorman, focus: '50% 45%' },
].map((entry) => {
  const project = projects.find((p) => p.id === entry.id);
  if (!project) throw new Error(`Showcase project not found: ${entry.id}`);
  // Title split into words of letters, with each letter's index across the whole title.
  let offset = 0;
  const words = project.title.split(' ').map((word) => {
    const start = offset;
    offset += word.length;
    return [...word].map((ch, j) => ({ ch, index: start + j }));
  });
  return { ...entry, project, words, bg: `url("${entry.image}")` };
});

const LOOP = 20;
const N = REEL.length;
const SEG = LOOP / N; // 2.5s per project
const FLIP_AT = 1.05; // segment time the first tile starts turning
const FLIP_DUR = 0.8; // per-tile turn
const SPREAD = 0.55; // stagger spread across the grid; FLIP_AT + SPREAD + FLIP_DUR ≤ SEG
const TITLE_OUT = FLIP_AT + 0.05;
const TITLE_IN = FLIP_AT + 0.3 - SEG; // relative to the incoming project's own start
// Turn direction per transition. Must have N entries summing to 0.
const DIRS = [1, -1, 1, -1, 1, -1, -1, 1];
const CUM = DIRS.map((_, k) => DIRS.slice(0, k).reduce((a, b) => a + b, 0));
const ACCENT = '#f26b1d';

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const pad = (n: number) => String(n).padStart(2, '0');

export default function ProjectShowcase() {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const sectionRef = useRef<HTMLElement>(null);
  const mosaicRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const odometerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const faceRefs = useRef<(HTMLDivElement | null)[]>([]); // [front, back] per tile
  const shadeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[][]>(REEL.map(() => []));
  const metaRefs = useRef<(HTMLElement | null)[][]>(REEL.map(() => []));
  const timeRef = useRef(0);
  const readyRef = useRef(false);

  const [grid, setGrid] = useState({ cols: 9, rows: 5 });
  const { cols, rows } = grid;
  const count = cols * rows;

  // Size the grid so tiles stay roughly square at any stage size.
  useLayoutEffect(() => {
    const el = mosaicRef.current;
    if (!el) return;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      const next = tileGrid(width, height);
      setGrid((g) => (g.cols === next.cols && g.rows === next.rows ? g : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const delays = useMemo(
    () =>
      DIRS.map((_, k) =>
        Array.from({ length: count }, (_, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          return waveDelay(k, cols > 1 ? c / (cols - 1) : 0.5, rows > 1 ? r / (rows - 1) : 0.5, noise(c, r, k)) * SPREAD;
        }),
      ),
    [cols, rows, count],
  );

  // Decode every image up front so face swaps never flash.
  useEffect(() => {
    let cancelled = false;
    const imgs = REEL.map(({ image }) => {
      const img = new Image();
      img.src = image;
      return img.decode().catch(() => {});
    });
    Promise.all(imgs).then(() => {
      if (!cancelled) readyRef.current = true;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useLayoutEffect(() => {
    const faceBg = new Int8Array(count * 2).fill(-1);
    const tileCache: string[] = [];
    const shadeCache: string[] = [];
    const groupShown: (boolean | null)[] = REEL.map(() => null);
    let restBg = -1;

    const setFace = (idx: number, project: number) => {
      if (faceBg[idx] === project) return;
      faceBg[idx] = project;
      const el = faceRefs.current[idx];
      if (!el) return;
      el.style.backgroundImage = REEL[project].bg;
      el.style.backgroundPosition = REEL[project].focus;
    };

    const render = (t: number) => {
      const seg = Math.floor(t / SEG) % N;
      const st = t - seg * SEG;
      const swing = (2 * Math.PI * t) / LOOP;

      const plane = planeRef.current;
      if (plane) {
        plane.style.transform = `scale(1.07) rotateX(${(Math.sin(swing * 2) * 1.6).toFixed(3)}deg) rotateY(${(Math.cos(swing) * 2.6).toFixed(3)}deg)`;
      }

      // Mosaic tiles
      let started = 0;
      let settled = 0;
      for (let i = 0; i < count; i++) {
        const start = FLIP_AT + delays[seg][i];
        const begun = st >= start;
        const p = clamp01((st - start) / FLIP_DUR);
        if (begun) started++;
        if (p >= 1) settled++;

        const lift = Math.sin(Math.PI * p);
        const angle = 180 * (CUM[seg] + DIRS[seg] * easeInOutCubic(p));
        const transform = `translateZ(${(lift * 110).toFixed(2)}px) rotateY(${angle.toFixed(2)}deg) scale(${(1 - lift * 0.1).toFixed(4)})`;
        if (tileCache[i] !== transform) {
          tileCache[i] = transform;
          const tile = tileRefs.current[i];
          if (tile) tile.style.transform = transform;
        }

        // The face turned toward the viewer shows the latest project; the
        // hidden face holds the outgoing one mid-turn, then preloads the next.
        const flips = seg + (begun ? 1 : 0);
        const shown = flips % N;
        const other = (begun && p < 1 ? flips - 1 + N : flips + 1) % N;
        setFace(i * 2, flips % 2 === 0 ? shown : other);
        setFace(i * 2 + 1, flips % 2 === 0 ? other : shown);

        const shade = (lift * 0.65).toFixed(3);
        if (shadeCache[i] !== shade) {
          shadeCache[i] = shade;
          const front = shadeRefs.current[i * 2];
          const back = shadeRefs.current[i * 2 + 1];
          if (front) front.style.opacity = shade;
          if (back) back.style.opacity = shade;
        }
      }

      // A single seamless image covers the tile seams whenever the grid is at rest.
      const rest = restRef.current;
      if (rest) {
        const atRest = started === 0 || settled === count;
        const project = started === 0 ? seg : (seg + 1) % N;
        if (atRest && restBg !== project) {
          restBg = project;
          rest.style.backgroundImage = REEL[project].bg;
          rest.style.backgroundPosition = REEL[project].focus;
        }
        rest.style.visibility = atRest ? 'visible' : 'hidden';
      }

      // Index odometer + progress marker
      const pos = seg + easeInOutCubic(clamp01((st - FLIP_AT - 0.15) / 0.9));
      if (odometerRef.current) {
        odometerRef.current.style.transform = `translateY(${((-pos / (N + 1)) * 100).toFixed(4)}%)`;
      }
      markerRefs.current.forEach((el, copy) => {
        if (el) el.style.transform = `translateX(${((pos - copy * N) * 100).toFixed(3)}%)`;
      });

      // Titles and metadata, timed against each project's own start.
      for (let p = 0; p < N; p++) {
        let s = (((t - p * SEG) % LOOP) + LOOP) % LOOP;
        if (s >= LOOP / 2) s -= LOOP;
        const active = s > TITLE_IN - 0.05 && s < TITLE_OUT + 1.2;
        if (groupShown[p] !== active) {
          groupShown[p] = active;
          const group = groupRefs.current[p];
          if (group) group.style.visibility = active ? 'visible' : 'hidden';
        }
        if (!active) continue;

        const letters = letterRefs.current[p];
        const stagger = Math.min(0.035, 0.45 / letters.length);
        letters.forEach((el, j) => {
          if (!el) return;
          const pin = easeOutQuart(clamp01((s - TITLE_IN - j * stagger) / 0.75));
          const pout = easeInCubic(clamp01((s - TITLE_OUT - j * stagger * 0.5) / 0.45));
          const y = (1 - pin) * 112 - pout * 112;
          const rot = (1 - pin) * 7 - pout * 3;
          el.style.transform = `translateY(${y.toFixed(2)}%) rotate(${rot.toFixed(2)}deg)`;
        });

        metaRefs.current[p].forEach((el, j) => {
          if (!el) return;
          const pin = easeOutQuart(clamp01((s - TITLE_IN - 0.3 - j * 0.1) / 0.6));
          const pout = easeInCubic(clamp01((s - TITLE_OUT + 0.05 - j * 0.05) / 0.35));
          el.style.opacity = (pin * (1 - pout)).toFixed(3);
          el.style.transform = `translateY(${((1 - pin) * 10 - pout * 8).toFixed(2)}px)`;
        });
      }
    };

    if (reducedMotion) {
      render(0.5);
      return;
    }

    render(timeRef.current);

    let visible = false;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    if (sectionRef.current) observer.observe(sectionRef.current);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Clamp so a backgrounded tab resumes in place instead of skipping ahead.
      const dt = Math.min((now - last) / 1000, 1 / 15);
      last = now;
      if (visible && readyRef.current) {
        timeRef.current = (timeRef.current + dt) % LOOP;
        render(timeRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [count, delays, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Selected work"
      className="relative w-full aspect-[4/3] md:aspect-[3/1] bg-[#141414] text-[#f6f3f1] overflow-hidden select-none"
    >
      <p className="sr-only">Selected work: {REEL.map(({ project }) => project.title).join(', ')}.</p>

      <div aria-hidden className="absolute inset-0">
        {/* Mosaic */}
        <div ref={mosaicRef} className="absolute inset-0 md:left-[38%] overflow-hidden" style={{ perspective: '1600px' }}>
          <div ref={planeRef} className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {Array.from({ length: count }, (_, i) => {
              const c = i % cols;
              const r = Math.floor(i / cols);
              return (
                <div
                  key={`${cols}x${rows}-${i}`}
                  ref={(el) => {
                    tileRefs.current[i] = el;
                  }}
                  className="absolute will-change-transform"
                  style={{
                    left: `${(c / cols) * 100}%`,
                    top: `${(r / rows) * 100}%`,
                    width: `${100 / cols}%`,
                    height: `${100 / rows}%`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {[0, 1].map((side) => (
                    <div
                      key={side}
                      className="absolute inset-0 overflow-hidden bg-[#1b1b1b]"
                      style={{ ...faceStyle, transform: side ? 'rotateY(180deg)' : undefined }}
                    >
                      <div
                        ref={(el) => {
                          faceRefs.current[i * 2 + side] = el;
                        }}
                        className="absolute bg-cover"
                        style={{
                          width: `${cols * 100}%`,
                          height: `${rows * 100}%`,
                          left: `${-c * 100}%`,
                          top: `${-r * 100}%`,
                        }}
                      />
                      <div
                        ref={(el) => {
                          shadeRefs.current[i * 2 + side] = el;
                        }}
                        className="absolute inset-0 bg-black opacity-0"
                      />
                    </div>
                  ))}
                </div>
              );
            })}
            <div ref={restRef} className="absolute inset-0 bg-cover" style={{ transform: 'translateZ(1px)' }} />
          </div>

          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(120% 95% at 55% 50%, transparent 55%, rgba(10,10,10,0.6))' }}
          />
          <div className="absolute inset-0 opacity-[0.09] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
          {(['top-3 left-3 border-t border-l', 'top-3 right-3 border-t border-r', 'bottom-3 left-3 border-b border-l', 'bottom-3 right-3 border-b border-r'] as const).map(
            (pos) => (
              <span key={pos} className={`absolute w-3 h-3 md:w-4 md:h-4 border-white/60 ${pos}`} />
            ),
          )}
        </div>

        {/* Mobile scrim so the type reads over the image */}
        <div className="absolute inset-0 md:hidden bg-gradient-to-t from-[#141414] from-15% via-[#141414]/75 to-[#141414]/20" />

        {/* Type panel */}
        <div className="absolute inset-0 md:right-[62%] flex flex-col justify-between p-5 sm:p-7 md:p-[clamp(1.25rem,2.4vw,3rem)]">
          <div className="flex items-center justify-between font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/55">
            <span>Selected Work</span>
            <span className="hidden md:inline">{pad(N)} Projects</span>
          </div>

          <div>
            <div className="flex items-end gap-3 font-black tracking-tighter leading-none text-[clamp(2rem,4.2vw,5rem)]" style={{ color: ACCENT }}>
              <div className="h-[1em] overflow-hidden">
                <div ref={odometerRef} className="will-change-transform">
                  {[...REEL, REEL[0]].map((_, k) => (
                    <div key={k} className="h-[1em]">
                      {pad((k % N) + 1)}
                    </div>
                  ))}
                </div>
              </div>
              <span className="font-mono font-normal tracking-[0.2em] text-[10px] md:text-[11px] text-white/45 pb-[0.4em]">/ {pad(N)}</span>
            </div>

            {/* Title stack: every title is laid out once and animated in place */}
            <div className="relative mt-2 md:mt-3 h-[2.1em] font-display italic leading-[1.02] tracking-tight text-[clamp(1.6rem,7vw,2.75rem)] md:text-[clamp(1.6rem,3.5vw,4.6rem)]">
              {REEL.map(({ project, words }, p) => (
                  <div
                    key={project.id}
                    ref={(el) => {
                      groupRefs.current[p] = el;
                    }}
                    className="absolute inset-x-0 bottom-0 invisible"
                  >
                    {words.map((letters, w) => (
                      <span key={w}>
                        {w > 0 && ' '}
                        <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em] pr-[0.06em] -mr-[0.06em]">
                          {letters.map(({ ch, index }) => (
                            <span
                              key={index}
                              ref={(el) => {
                                letterRefs.current[p][index] = el;
                              }}
                              className="inline-block origin-bottom-left will-change-transform"
                              style={{ transform: 'translateY(112%)' }}
                            >
                              {ch}
                            </span>
                          ))}
                        </span>
                      </span>
                    ))}
                  </div>
              ))}
            </div>

            {/* Role + tags */}
            <div className="relative hidden sm:block mt-3 md:mt-4 h-[3.2em] lg:h-[6.2em] font-mono text-[9px] md:text-[10px] lg:text-[11px] uppercase tracking-[0.22em] leading-[1.6]">
              {REEL.map(({ project }, p) => (
                <div key={project.id} className="absolute inset-0">
                  <p
                    ref={(el) => {
                      metaRefs.current[p][0] = el;
                    }}
                    className="text-white/60 line-clamp-2 max-w-[34em] opacity-0"
                  >
                    {project.year}
                  </p>
                  <div
                    ref={(el) => {
                      metaRefs.current[p][1] = el;
                    }}
                    className="hidden lg:flex flex-wrap gap-1.5 mt-2.5 max-h-[2.1em] overflow-hidden opacity-0"
                  >
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="border border-white/20 rounded-full px-2.5 py-0.5 tracking-[0.12em] text-white/75 whitespace-nowrap">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress: the marker wraps from the last segment back into the first */}
            <div className="relative mt-4 md:mt-5 h-[2px] overflow-hidden">
              <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
                {REEL.map(({ id }) => (
                  <div key={id} className="pr-1">
                    <div className="h-full bg-white/15" />
                  </div>
                ))}
              </div>
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  ref={(el) => {
                    markerRefs.current[copy] = el;
                  }}
                  className="absolute inset-y-0 left-0 pr-1 will-change-transform"
                  style={{ width: `${100 / N}%` }}
                >
                  <div className="h-full" style={{ background: ACCENT }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
