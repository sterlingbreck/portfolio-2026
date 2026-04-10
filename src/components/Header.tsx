export default function Header() {
  return (
    <header className="bg-accent px-6 lg:px-10 py-6 lg:py-8">
      <div className="max-w-7xl mx-auto flex items-baseline justify-between">
        <a href="/" className="no-underline">
          <h1 className="font-display text-3xl lg:text-4xl text-white/90 tracking-tight leading-none m-0">
            Sterling Breckenridge
          </h1>
        </a>
        <nav className="hidden sm:flex gap-8 text-sm font-body tracking-wide uppercase text-white/50">
          <a href="#work" className="hover:text-white transition-colors duration-200 no-underline">
            Work
          </a>
          <a href="#contact" className="hover:text-white transition-colors duration-200 no-underline">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
