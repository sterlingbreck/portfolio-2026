import { useState, useEffect, useCallback, useRef } from 'react';

const imageModules = import.meta.glob<{ default: string }>(
  '../assets/gallery/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);
const galleryImages = Object.keys(imageModules)
  .sort()
  .map((key) => imageModules[key].default);

export default function Gallery() {
  const total = galleryImages.length;

  if (total === 0) return null;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const goTo = useCallback((index: number) => {
    setIsTransitioning(true);
    setActiveIndex(index);
  }, []);

  // Auto-advance every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setActiveIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // When we land on the clone (index === total), snap back to 0 without animation
  useEffect(() => {
    if (activeIndex === total) {
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setActiveIndex(0);
      }, 700); // wait for slide transition to finish
    }
    return () => clearTimeout(timeoutRef.current);
  }, [activeIndex, total]);

  const displayIndex = activeIndex >= total ? 0 : activeIndex;

  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
      <div
        className={`flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${activeIndex * 100}vw)` }}
      >
        {/* All images + clone of first for seamless loop */}
        {[...galleryImages, galleryImages[0]].map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="w-screen h-[clamp(260px,38vw,560px)] object-cover shrink-0"
          />
        ))}
      </div>

      {/* Vignette overlay — fades to black on all inner edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.45)',
        }}
      />

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {galleryImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
              i === displayIndex ? 'bg-accent' : 'bg-black/20'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
