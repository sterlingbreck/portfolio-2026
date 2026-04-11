import { Component as ExperienceHero } from './components/ui/experience-hero';
import ProjectsSection from './components/ProjectsSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text font-body overflow-x-hidden">
      <main>
        <ExperienceHero />
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
}
