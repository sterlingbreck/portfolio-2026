import { Component as ExperienceHero } from './components/ui/experience-hero';
// import ProjectShowcase from './components/ui/project-showcase';
import ProjectsSection from './components/ProjectsSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text font-body overflow-x-hidden">
      <main>
        <ExperienceHero />
        {/* <ProjectShowcase /> */}
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
}
