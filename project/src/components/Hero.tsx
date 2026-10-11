import { useEffect, useRef } from 'react';
import { ArrowDown, FolderGit2, Route } from 'lucide-react';

export function Hero() {
  const orbRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const orb = orbRef.current;
      const glow = glowRef.current;
      if (!orb || !glow) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        orb.style.transform = `translate(${x}px, ${y}px)`;
        glow.style.transform = `translate(${x * 1.8}px, ${y * 1.8}px)`;
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  const go = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center px-5 sm:px-8 overflow-hidden">
      {/* Orb visual */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={glowRef}
          className="absolute w-[600px] h-[600px] rounded-full bg-neon-500/10 blur-[130px] animate-pulse-glow will-change-transform"
        />
        <div
          ref={orbRef}
          className="relative will-change-transform"
        >
          {/* Orbit rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] rounded-full border border-neon-500/15 animate-float-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-full border border-neon-500/10" style={{ animationDelay: '1.5s' }} />

          {/* Core */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-400 to-neon-600 animate-pulse-glow" />
            <div className="absolute inset-2 rounded-full bg-ink-950" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-neon-500/40 to-neon-700/30 blur-md" />
            <div className="absolute inset-0 rounded-full border border-neon-500/30 animate-pulse-glow" />
            {/* Terminal prompt in orb */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-neon-500 text-xs sm:text-sm font-semibold tracking-wider">SYS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto pt-20">
        <div className="reveal in-view" style={{ transitionDelay: '100ms' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6">
            <span className="w-2 h-2 rounded-full bg-neon-500 status-dot text-neon-500" />
            <span className="font-mono text-xs text-ink-500 tracking-wider">SYSTEM ONLINE</span>
          </div>
        </div>

        <h1 className="reveal in-view font-display font-bold text-5xl sm:text-7xl lg:text-8xl tracking-tight mb-4" style={{ transitionDelay: '200ms' }}>
          <span className="text-white">SURAJ</span>
          <span className="neon-text">.EXE</span>
        </h1>

        <p className="reveal in-view font-mono text-sm sm:text-lg text-neon-500 tracking-[0.3em] sm:tracking-[0.5em] mb-8" style={{ transitionDelay: '350ms' }}>
          BUILD. LEARN. CREATE.
        </p>

        <p className="reveal in-view text-lg sm:text-xl text-ink-500 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ transitionDelay: '500ms' }}>
          I am building my future one project, one skill, and one experiment at a time.
        </p>

        <div className="reveal in-view flex flex-col sm:flex-row items-center justify-center gap-4" style={{ transitionDelay: '650ms' }}>
          <button
            onClick={() => go('#journey')}
            className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-neon-500 text-ink-950 font-semibold hover:bg-neon-400 transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-neon-500/30 w-full sm:w-auto justify-center"
          >
            <Route size={18} />
            Explore My Journey
          </button>
          <button
            onClick={() => go('#tracker')}
            className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl glass text-white font-semibold hover:border-neon-500/30 transition-all hover:scale-[1.03] w-full sm:w-auto justify-center"
          >
            <FolderGit2 size={18} />
            View My Projects
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => go('#journey')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ink-500 hover:text-neon-500 transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ArrowDown size={24} />
      </button>
    </section>
  );
}
