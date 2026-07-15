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
    }, listRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="work"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      style={{ paddingTop: 'clamp(3rem, 8vw, 6rem)', paddingBottom: 'clamp(3rem, 8vw, 6rem)' }}
    >
      <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-accent tracking-tight mb-4">
        My Work
      </h2>
      
      <p className="font-body text-text-muted text-base sm:text-lg mb-12 lg:mb-16 max-w-xl">
        A collection of projects spanning development, CDN performance/security, brand identity, print and digital design, CMS integrations, customer success, and technical project management.
      </p>
      
      <div ref={listRef} className="space-y-8 lg:space-y-12">
        {projects.map((project, index) => (
          <ProjectTile
            key={project.id}
            project={project}
            reversed={index % 2 !== 0}
          />
        ))}
      </div>
    </section>
  );
}
