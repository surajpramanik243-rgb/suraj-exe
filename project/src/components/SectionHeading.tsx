import type { ReactNode } from 'react';

interface SectionHeadingProps {
  index: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function SectionHeading({ index, title, subtitle, children }: SectionHeadingProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-mono text-xs text-neon-500 tracking-widest">{index}</span>
        <div className="h-px flex-1 max-w-[60px] bg-neon-500/30" />
      </div>
      <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-3">
        {title}
      </h2>
      {subtitle && <p className="text-ink-500 text-base sm:text-lg max-w-2xl">{subtitle}</p>}
      {children}
    </div>
  );
}
