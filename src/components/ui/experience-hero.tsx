"use client";

import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaQuery } from '../../lib/useMediaQuery';
// Seamless 20s loop rendered from /hero-video (Remotion). Frame 0 doubles as the poster.
import heroWideMp4 from '../../assets/hero/hero-wide.mp4';
import heroWideWebm from '../../assets/hero/hero-wide.webm';
import heroWidePoster from '../../assets/hero/hero-wide-poster.webp';
import heroMobileMp4 from '../../assets/hero/hero-mobile.mp4';
import heroMobileWebm from '../../assets/hero/hero-mobile.webm';
import heroMobilePoster from '../../assets/hero/hero-mobile-poster.webp';

const HERO_MEDIA = {
  wide: { mp4: heroWideMp4, webm: heroWideWebm, poster: heroWidePoster },
  mobile: { mp4: heroMobileMp4, webm: heroMobileWebm, poster: heroMobilePoster },
};

/** Looping hero video over its frame-0 poster. The poster stays visible under
 *  reduced motion, before playback starts, or if autoplay is blocked. */
const HeroVideo = ({ variant }: { variant: keyof typeof HERO_MEDIA }) => {
  const media = HERO_MEDIA[variant];
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Pause the loop while the hero is scrolled out of view.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion, variant]);

  return (
    <>
      <img
        src={media.poster}
        alt=""
        aria-hidden
        fetchPriority="high"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {!reducedMotion && (
        <video
          key={variant}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${playing ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={media.webm} type="video/webm" />
          <source src={media.mp4} type="video/mp4" />
        </video>
      )}
    </>
  );
};

const fadeTop = (stop: string) => ({
  maskImage: `linear-gradient(to bottom, transparent, black ${stop})`,
  WebkitMaskImage: `linear-gradient(to bottom, transparent, black ${stop})`,
});

// Jagged bottom edge: a flat row of 60px half-diamond teeth. The hero is masked to the teeth
// and the projects lattice slides up underneath by TOOTH_H (matched by ProjectsSection's
// -mt/pt), filling the gaps between them.
const TOOTH_W = 60;
const TOOTH_H = 15;
const toothSvg = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='${TOOTH_W}' height='${TOOTH_H}'><path d='M0 0H${TOOTH_W}L${TOOTH_W / 2} ${TOOTH_H}Z'/></svg>`
)}")`;
const toothMask = {
  // Solid above the teeth band (1px overlap avoids a seam), then the teeth repeated across it.
  maskImage: `linear-gradient(#000, #000), ${toothSvg}`,
  maskSize: `100% calc(100% - ${TOOTH_H - 1}px), ${TOOTH_W}px ${TOOTH_H}px`,
  maskPosition: 'top, 50% 100%',
  maskRepeat: 'no-repeat, repeat-x',
  WebkitMaskImage: `linear-gradient(#000, #000), ${toothSvg}`,
  WebkitMaskSize: `100% calc(100% - ${TOOTH_H - 1}px), ${TOOTH_W}px ${TOOTH_H}px`,
  WebkitMaskPosition: 'top, 50% 100%',
  WebkitMaskRepeat: 'no-repeat, repeat-x',
};

gsap.registerPlugin(ScrollTrigger);

const HERO_SKILLS = [
  'Founder',
  'Fullstack Developer',
  'Technical Project Manager',
  'Professional Services',
  'Open Source Maintainer',
  'AI Solutions',
  'Cloudflare Integration',
  'Scrum Master',
  'Skill Stacker',
];

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const skillsRef = useRef<HTMLUListElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const mobileSkillsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  // Desktop: 3:1 loop behind the headline. Mobile: 4:3 loop below the name, with the
  // skills laid over its top. Only one video is loaded.
  const isWide = useMediaQuery('(min-width: 768px)');

  // Mobile: size the name so BRECKENRIDGE spans the full width. Measured rather than set in CSS
  // because the fallback font's width differs by device. Re-fits on resize and once fonts load.
  useLayoutEffect(() => {
    const name = nameRef.current!;
    if (isWide) {
      name.style.fontSize = '';
      return;
    }
    const longest = name.querySelector<HTMLElement>('.text-outline')!;
    const fit = () => {
      const fontSize = parseFloat(getComputedStyle(name).fontSize);
      // 0.99 leaves room for the outline stroke.
      name.style.fontSize = `${(name.clientWidth / longest.getBoundingClientRect().width) * fontSize * 0.99}px`;
    };
    fit();
    document.fonts.ready.then(fit);
    const observer = new ResizeObserver(fit);
    observer.observe(name);
    return () => {
      observer.disconnect();
      name.style.fontSize = '';
    };
  }, [isWide]);

  // Layout effect so the from-states apply before first paint (no flash of the final layout).
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Intro: the name glides in from the left, then the skill capsules follow one by one.
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from(nameRef.current, { x: -80, autoAlpha: 0, duration: 1.2 })
          .from(skillsRef.current!.children, { x: -24, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, '-=0.6');
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!ctaRef.current) return;
        const rect = ctaRef.current.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));
        if (dist < 150) {
          gsap.to(ctaRef.current, { x: (e.clientX - (rect.left + rect.width/2)) * 0.4, y: (e.clientY - (rect.top + rect.height/2)) * 0.4, duration: 0.6 });
        } else {
          gsap.to(ctaRef.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        }
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Parallax: while the hero scrolls away, the art drifts down 30% of the hero's height and the
  // text 18%, so the art moves slowest, the text a little faster, and the projects at full speed.
  // Re-runs on the breakpoint because the wide and mobile layouts render different video nodes.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const hero = containerRef.current!;
      const scrollTrigger = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true };
      gsap.to(imageRef.current, { y: () => hero.offsetHeight * 0.3, ease: 'none', scrollTrigger });
      // The mobile skills live over the video, outside textRef, so they get the same drift to move with the name.
      const text = [textRef.current, mobileSkillsRef.current].filter(Boolean);
      gsap.to(text, { y: () => hero.offsetHeight * 0.18, ease: 'none', scrollTrigger });
    }, containerRef);
    return () => ctx.revert();
  }, [isWide]);

  // Same capsules as the project tags in ProjectTile, filled black to stand out on the light hero.
  // Rendered under the name on desktop, and over the top of the video on mobile.
  const skills = (
    <ul ref={skillsRef} aria-label="Skills" className="flex flex-wrap gap-2 max-w-xl">
      {HERO_SKILLS.map((skill) => (
        <li
          key={skill}
          className="text-[11px] uppercase tracking-[0.15em] font-body text-white/80
            bg-[#171717] border border-white/15 rounded-full px-3 py-1"
        >
          {skill}
        </li>
      ))}
    </ul>
  );

  return (
    <section ref={containerRef} style={toothMask} className="relative z-10 min-h-[30vh] md:min-h-[72vh] w-full bg-sand flex flex-col selection:bg-black selection:text-white overflow-hidden">
      {isWide && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div ref={imageRef} className="absolute bottom-0 left-0 w-full aspect-[3/1] select-none" style={fadeTop('18%')}>
            <HeroVideo variant="wide" />
          </div>
        </div>
      )}

      <div className="relative z-10 w-full flex flex-col md:flex-row p-8 md:p-10 lg:p-12 md:min-h-[72vh] items-center md:items-stretch gap-10">
        <div className="flex-1 min-w-0 flex flex-col justify-center md:pb-8 w-full">

          <div className="flex items-center gap-3">
            {/*
            <div className="relative w-2.5 h-2.5 bg-white rounded-full">
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30" />
             </div>

              <span className="font-mono text-[11px] font-bold text-white tracking-[0.2em] uppercase">2026</span>
              */}
              </div>

          <div ref={textRef} className="max-w-4xl md:pr-12">
            <h1 ref={nameRef} className="text-[clamp(1.875rem,7.125vw,8.625rem)] font-black leading-[0.87] tracking-tighter text-neutral-900 uppercase italic-none">
              STERLING <br /> <span className="text-outline">BRECKENRIDGE</span>
            </h1>
            <div className="mt-8 hidden md:flex items-center gap-14">
              {isWide && skills}

              {/* My Work CTA, hidden for now. Restore by uncommenting (ctaRef + magnet effect are still wired up).
              <a ref={ctaRef} href="#work" className="w-fit flex items-center gap-6 group shrink-0 no-underline">
                 <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center group-hover:bg-orange-500 transition-all duration-500 overflow-hidden">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90 stroke-white transition-colors duration-500">
                      <path d="M7 17L17 7M17 7H8M17 7V16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                 </div>
                 <span className="font-mono text-[11px] font-bold text-neutral-900 uppercase tracking-[0.2em]">My Work</span>
              </a>
              */}
            </div>
          </div>
        </div>

        {/* Right Side Deck: Flex shrink fix for layout stability */}


      </div>

      {!isWide && (
        <div className="relative -mt-4">
          {/* Nudged down out from under the skills; a transform, so the hero's height and edge stay put. */}
          <div className="translate-y-[20%]">
            <div ref={imageRef} className="relative w-full aspect-[4/3] pointer-events-none select-none" style={fadeTop('10%')}>
              <HeroVideo variant="mobile" />
            </div>
          </div>
          <div ref={mobileSkillsRef} className="absolute inset-x-0 top-0 z-10 px-8">{skills}</div>
        </div>
      )}
    </section>
  );
};
