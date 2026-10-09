"use client";

import { useRef, useEffect, useState, useSyncExternalStore } from 'react';
import gsap from 'gsap';
// Seamless 20s loop rendered from /hero-video (Remotion). Frame 0 doubles as the poster.
import heroWideMp4 from '../../assets/hero/hero-wide.mp4';
import heroWideWebm from '../../assets/hero/hero-wide.webm';
import heroWidePoster from '../../assets/hero/hero-wide-poster.webp';
import heroMobileMp4 from '../../assets/hero/hero-mobile.mp4';
import heroMobileWebm from '../../assets/hero/hero-mobile.webm';
import heroMobilePoster from '../../assets/hero/hero-mobile-poster.webp';

const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );

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

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  // Desktop: 3:1 loop behind the headline. Mobile: 4:3 loop below it, so the
  // stacked text never covers the skill labels. Only one video is loaded.
  const isWide = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(revealRef.current,
        { filter: "blur(30px)", opacity: 0, scale: 1.02 },
        { filter: "blur(0px)", opacity: 1, scale: 1, duration: 2.2, ease: "expo.out" }
      );

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

  return (
    <section ref={containerRef} className="relative min-h-[33vh] md:min-h-[80vh] w-full bg-[#f6f3f1] flex flex-col selection:bg-black selection:text-white overflow-hidden">
      {isWide && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full aspect-[3/1] select-none" style={fadeTop('18%')}>
            <HeroVideo variant="wide" />
          </div>
        </div>
      )}

      <div ref={revealRef} className="relative z-10 w-full flex flex-col md:flex-row p-8 md:p-10 lg:p-12 min-h-[33vh] md:min-h-[80vh] items-center md:items-stretch gap-10">
        <div className="flex-1 min-w-0 flex flex-col justify-center pb-12 md:pb-8 w-full">

          <div className="flex items-center gap-3">
            {/*
            <div className="relative w-2.5 h-2.5 bg-white rounded-full">
                <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30" />
             </div>

              <span className="font-mono text-[11px] font-bold text-white tracking-[0.2em] uppercase">2026</span>
              */}
              </div>

          <div className="max-w-4xl pr-12">
            <h1 className="text-[clamp(1.875rem,7.125vw,8.625rem)] font-black leading-[0.87] tracking-tighter text-neutral-900 uppercase italic-none">
              STERLING <br /> <span className="text-outline">BRECKENRIDGE</span>
            </h1>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-14">
              <p className="font-mono text-sm text-neutral-900/55 uppercase tracking-[0.35em] max-w-sm leading-relaxed">
                Developer, Technical Project Manager, Creative, AI enthusiast, Scrum Master, Skill Stacker
              </p>

              <a ref={ctaRef} href="#work" className="w-fit flex items-center gap-6 group shrink-0 no-underline">
                 <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center group-hover:bg-orange-500 transition-all duration-500 overflow-hidden">
                    {/* Fixed: Professional SVG arrow replaces broken character */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90 stroke-white transition-colors duration-500">
                      <path d="M7 17L17 7M17 7H8M17 7V16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                 </div>
                 <span className="font-mono text-[11px] font-bold text-neutral-900 uppercase tracking-[0.2em]">My Work</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side Deck: Flex shrink fix for layout stability */}


      </div>

      {!isWide && (
        <div className="relative -mt-10 w-full aspect-[4/3] pointer-events-none select-none" style={fadeTop('10%')}>
          <HeroVideo variant="mobile" />
        </div>
      )}
    </section>
  );
};
