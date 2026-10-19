import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../types';
import ImageLightbox from './ImageLightbox';
import { isVideo } from '../lib/media';

interface ProjectTileProps {
  project: Project;
  reversed?: boolean;
}

// A tab hanging from the tile: same dark, flat top flush with the tile, rounded bottom.
// Text color is set per variant: orange links (white on hover), grey for in development.
const tabClass = `inline-flex items-center gap-2 whitespace-nowrap rounded-b-xl bg-[#171717]
  px-5 pt-1.5 pb-2 text-[11px] uppercase tracking-[0.15em] font-body`;

function ProjectStatus({ project }: { project: Project }) {
  const label = project.projectLinkLabel ?? 'Visit';
  const variant = project.projectLinkVariant ?? (project.projectUrl ? 'link' : 'text');

  if (variant === 'link' && project.projectUrl) {
    return (
      <a
        href={project.projectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${tabClass} text-orange-400 hover:text-white transition-colors duration-200 no-underline group`}
      >
        {label}
        <ArrowUpRight
          size={14}
          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    );
  }

  if (variant === 'unavailable') {
    return (
      <span className={`${tabClass} text-orange-400 opacity-50`}>
        {label}
        <ArrowUpRight size={14} className="opacity-60" />
      </span>
    );
  }

  return <span className={`${tabClass} text-white/40`}>{label}</span>;
}

const glow = 'shadow-[0_2px_6px_rgba(0,0,0,0.06),0_16px_48px_rgba(160,82,10,0.28)]';

export default function ProjectTile({ project, reversed = false }: ProjectTileProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // 'wide' stacks two full-width images at their natural aspect ratio, uncropped.
  const wide = project.imageLayout === 'wide';
  const images = project.imageUrls.slice(0, wide ? 2 : 4);
  const mediaClass = wide ? 'w-full h-auto rounded-lg' : 'w-full h-full object-cover rounded-lg';

  return (
    // The article holds the title tab, the tile body and the status tab. It isn't clipped, so the status tab can
    // hang below the body; the body clips its columns. The glow is on the tab and body, not the article's empty corner.
    <article className="relative flex flex-col">
      {/* Title tab on the top left: same dark as the body, rounded top, flat bottom flush with it. */}
      <h3
        className={`${glow} self-start max-w-[calc(100%-3rem)] ml-6 sm:ml-8 rounded-t-xl bg-[#171717] px-5 pt-3 pb-1
          font-display text-xl sm:text-2xl lg:text-3xl text-[#f6f3f1] leading-tight`}
      >
        {project.title}
        {project.titleNote && (
          <>{' '}<span className="ml-2 align-middle text-xs sm:text-sm font-body uppercase tracking-[0.15em] text-white/50">
            {project.titleNote}
          </span></>
        )}
      </h3>

      <div className={`${glow} relative rounded-2xl bg-[#171717] overflow-hidden flex flex-col lg:flex-row`}>
        {/* Images */}
        {/* 2rem wider than 6/11, taken from the text column's inner padding (see Content), so the images gain width and the text keeps its own. */}
        <div className={`lg:w-[calc(600%/11+2rem)] bg-[#171717] p-4 grid grid-cols-2 gap-3 content-center min-h-64 sm:min-h-72 ${reversed ? 'lg:order-2' : ''}`}>
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={`View larger: ${project.title} image ${i + 1}`}
              className={`block w-full ${wide ? 'col-span-2' : 'aspect-[3/2]'} cursor-zoom-in overflow-hidden rounded-lg
                border border-neutral-800 hover:border-white/30 transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40`}
            >
              {isVideo(src) ? (
                <video
                  src={src}
                  aria-label={`${project.title} ${i + 1}`}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className={mediaClass}
                />
              ) : (
                <img
                  src={src}
                  alt={`${project.title} ${i + 1}`}
                  className={mediaClass}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {/* Padding on the side facing the images is 1rem (not 3rem), keeping the gap to the images tight. */}
        {/* Tighter top on mobile, where it follows the images directly. */}
        <div className={`lg:w-[calc(500%/11-2rem)] bg-[#171717] p-6 pt-4 sm:p-8 sm:pt-6 lg:px-12 lg:py-8 flex flex-col justify-center ${reversed ? 'lg:order-1 lg:pr-4' : 'lg:pl-4'}`}>
          <p className="font-body text-sm sm:text-base text-white/60 leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
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
        </div>
      </div>

      {/* Status tab hanging below the bottom-right of the tile, clear of the rounded corner. */}
      <div className="absolute top-full right-6 sm:right-8 z-10 flex">
        <ProjectStatus project={project} />
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
