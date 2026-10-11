import { useState, useEffect } from 'react';
import { Menu, X, Terminal } from 'lucide-react';

const links = [
  { href: '#hero', label: 'Home' },
  { href: '#journey', label: 'Journey' },
  { href: '#tracker', label: 'Projects' },
  { href: '#skills', label: 'Skills' },
  { href: '#showcase', label: 'Showcase' },
  { href: '#ideas', label: 'Ideas' },
  { href: '#about', label: 'About' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'glass py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          <button onClick={() => go('#hero')} className="flex items-center gap-2 group">
            <Terminal className="text-neon-500 group-hover:scale-110 transition-transform" size={22} />
            <span className="font-mono font-semibold text-white tracking-tight">
              SURAJ<span className="text-neon-500">.EXE</span>
            </span>
          </button>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="px-3.5 py-2 text-sm text-ink-500 hover:text-white rounded-lg hover:bg-white/5 transition-all"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/5"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-400 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-ink-950/95 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <div className="relative flex flex-col items-center justify-center h-full gap-3">
          {links.map((l, i) => (
            <button
              key={l.href}
              onClick={() => go(l.href)}
              className="text-2xl font-display font-medium text-ink-500 hover:text-neon-500 transition-colors"
              style={{
                transition: 'all 0.4s',
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: open ? `${i * 60 + 100}ms` : '0ms',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
