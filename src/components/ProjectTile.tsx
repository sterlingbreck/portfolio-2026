import { ArrowUpRight } from 'lucide-react';
import type { Project } from '../types';

interface ProjectTileProps {
  project: Project;
  reversed?: boolean;
}

export default function ProjectTile({ project, reversed = false }: ProjectTileProps) {
  return (
    <article
      className="rounded-2xl bg-surface shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden
        flex flex-col lg:flex-row"
      style={{ flexDirection: reversed ? undefined : undefined }}
    >
      {/* Images */}
      <div className={`lg:w-1/2 bg-[#171717] p-4 grid grid-cols-2 gap-3 min-h-64 sm:min-h-72 ${reversed ? 'lg:order-2' : ''}`}>
        {project.imageUrls.slice(0, 4).map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${project.title} ${i + 1}`}
            className="w-full aspect-square object-cover border border-neutral-800 rounded-lg"
          />
        ))}
      </div>

      {/* Content */}
      <div className={`lg:w-1/2 bg-[#171717] p-6 sm:p-8 lg:p-12 flex flex-col justify-center ${reversed ? 'lg:order-1' : ''}`}>
        <span className="text-xs font-body uppercase tracking-[0.2em] text-white/40 mb-4 block">
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
              className="text-[11px] uppercase tracking-[0.15em] font-body text-white/40
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
                  text-white/80 hover:text-white transition-colors duration-200 no-underline group w-fit"
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
    </article>
  );
}
