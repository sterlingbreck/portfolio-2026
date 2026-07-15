"use client";

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import banner from '../../assets/gallery/sterling-breck-banner.png';

export const Component = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

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
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={banner}
          alt=""
          aria-hidden
          className="absolute bottom-0 left-0 w-full h-auto select-none"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 18%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 18%)',
          }}
        />
      </div>

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
    </section>
  );
};
