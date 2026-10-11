import { useEffect, useState } from 'react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950" />

      {/* Animated grid */}
      <div className="absolute inset-0 grid-bg animate-grid-shift opacity-60" />

      {/* Ambient green glows */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-neon-500/8 blur-[120px] animate-float-slow" />
      <div className="absolute top-1/3 -right-40 w-[450px] h-[450px] rounded-full bg-neon-600/6 blur-[100px] animate-float-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-neon-500/5 blur-[110px] animate-float-slow" style={{ animationDelay: '4s' }} />

      {/* Vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5,5,6,0.4) 70%, rgba(5,5,6,0.9) 100%)' }} />
    </div>
  );
}

export function LoadingScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setDone(true); return; }
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink-950 transition-opacity duration-700"
      style={{ opacity: done ? 0 : 1 }}
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-neon-500/20" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-neon-500 animate-spin" />
        <div className="absolute inset-3 rounded-full bg-neon-500/20 blur-md animate-pulse-glow" />
      </div>
      <div className="font-mono text-sm text-neon-500 tracking-[0.3em]">
        SURAJ.EXE
      </div>
      <div className="font-mono text-xs text-ink-500 mt-2 tracking-widest">
        INITIALIZING...
      </div>
    </div>
  );
}
