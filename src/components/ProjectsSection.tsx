import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';
import ProjectTile from './ProjectTile';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectsSection() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('article').forEach((card) => {
        gsap.fromTo(
          card,
          { y: 48, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });

      // Parallax: each tile's wrapper drifts from slightly below to slightly above its spot as
      // it crosses the viewport, so the tiles float against the lattice. Alternating tiles drift
      // by different amounts for a little depth. On the wrapper so it doesn't fight the reveal's y.
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((layer, i) => {
        const drift = i % 2 ? 120 : 72;
        gsap.fromTo(
          layer,
          { y: drift },
          {
            y: -drift,
            ease: 'none',
            scrollTrigger: { trigger: layer, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    }, listRef);

    return () => ctx.revert();
  }, []);

  return (
    // Pulled up under the hero's jagged bottom edge (TOOTH_H in experience-hero), padded back so content doesn't move.
    <div className="relative isolate bg-sand -mt-[15px] pt-[15px]">
      <div aria-hidden="true" className="lattice" />
      <section
        id="work"
        className="max-w-[79.2rem] mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: 'clamp(3rem, 8vw, 6rem)', paddingBottom: 'clamp(3rem, 8vw, 6rem)' }}
      >
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-accent tracking-tight mb-4">
          My Work
        </h2>

        <p className="font-body text-text-muted text-base sm:text-lg mb-12 lg:mb-16 max-w-xl">
          A collection of projects spanning development, CDN performance/security, brand identity, print and digital design, CMS integrations, customer success, and technical project management.
        </p>

        {/* Wider than the tiles need on their own, to leave room for the status tab hanging under each. */}
        <div ref={listRef} className="space-y-14 lg:space-y-16">
          {projects.map((project, index) => (
            <div key={project.id} data-parallax>
              <ProjectTile
                project={project}
                reversed={index % 2 !== 0}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
