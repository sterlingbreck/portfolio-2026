import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../types';
import ImageLightbox from './ImageLightbox';

interface ProjectTileProps {
  project: Project;
  reversed?: boolean;
}

export default function ProjectTile({ project, reversed = false }: ProjectTileProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = project.imageUrls.slice(0, 4);

  return (
    <article
      className="rounded-2xl bg-surface shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden
        flex flex-col lg:flex-row"
    >
      {/* Images */}
      <div className={`lg:w-1/2 bg-[#171717] p-4 grid grid-cols-2 gap-3 min-h-64 sm:min-h-72 ${reversed ? 'lg:order-2' : ''}`}>
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxIndex(i)}
            aria-label={`View larger: ${project.title} image ${i + 1}`}
            className="block w-full h-full aspect-square cursor-zoom-in overflow-hidden rounded-lg
              border border-neutral-800 hover:border-white/30 transition-colors duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <img
              src={src}
              alt={`${project.title} ${i + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`lg:w-1/2 bg-[#171717] p-6 sm:p-8 lg:p-12 flex flex-col justify-center ${reversed ? 'lg:order-1' : ''}`}>
        <span className="text-xs font-body uppercase tracking-[0.2em] text-white/50 mb-4 block">
          {project.year}
        </span>

        <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white leading-tight mb-4">
          {project.title}
        </h3>

        <p className="font-body text-sm sm:text-base text-white/60 leading-relaxed mb-6">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] uppercase tracking-[0.15em] font-body text-white/50
                border border-white/15 rounded-full px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        {(() => {
          const label = project.projectLinkLabel ?? 'Visit';
          const variant =
            project.projectLinkVariant ?? (project.projectUrl ? 'link' : 'text');

          if (variant === 'link' && project.projectUrl) {
            return (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-body uppercase tracking-[0.15em]
                  text-orange-400/80 hover:text-white transition-colors duration-200 no-underline group w-fit"
              >
                {label}
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            );
          }

          if (variant === 'unavailable') {
            return (
              <span
                className="inline-flex items-center gap-2 text-sm font-body uppercase tracking-[0.15em]
                  text-white/30 w-fit"
              >
                {label}
                <ArrowUpRight size={16} className="opacity-60" />
              </span>
            );
          }

          return (
            <span
              className="inline-flex items-center text-sm font-body uppercase tracking-[0.15em]
                text-white/40 w-fit animate-text-glow"
            >
              {label}
            </span>
          );
        })()}
      </div>

      <ImageLightbox
        images={images}
        title={project.title}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </article>
  );
}
