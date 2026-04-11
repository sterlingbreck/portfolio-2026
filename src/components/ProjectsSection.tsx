import { projects } from '../data/projects';
import ProjectTile from './ProjectTile';

export default function ProjectsSection() {
  return (
    <section
      id="work"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      style={{ paddingTop: 'clamp(3rem, 8vw, 6rem)', paddingBottom: 'clamp(3rem, 8vw, 6rem)' }}
    >
      <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-accent tracking-tight mb-4">
        Projects
      </h2>
      <p className="font-body text-text-muted text-base sm:text-lg mb-12 lg:mb-16 max-w-xl">
        A curated collection of projects spanning web development, brand identity, print and digital design, CMS integrations, and project management.
      </p>

      <div className="space-y-8 lg:space-y-12">
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
