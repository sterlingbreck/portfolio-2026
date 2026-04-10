import Header from './components/Header';
import Gallery from './components/Gallery';
import ProjectsSection from './components/ProjectsSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text font-body overflow-x-hidden">
      <Header />
      <main>
        <Gallery />
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
}
