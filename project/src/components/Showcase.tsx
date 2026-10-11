import { useMemo } from 'react';
import { Github, ExternalLink, CheckCircle2, CircleDot, Clock, Sparkle } from 'lucide-react';
import { useData } from '@/store';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import type { ProjectStatus } from '@/types';

const statusConfig: Record<ProjectStatus, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  'pending': { label: 'Pending', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  'in-progress': { label: 'In Progress', icon: CircleDot, color: 'text-neon-500', bg: 'bg-neon-500/10' },
  'completed': { label: 'Completed', icon: CheckCircle2, color: 'text-neon-400', bg: 'bg-neon-400/10' },
};

export function Showcase() {
  const { data } = useData();

  const showcaseProjects = useMemo(
    () => data.projects.filter(p => p.status === 'completed' || p.status === 'in-progress'),
    [data.projects]
  );

  return (
    <section id="showcase" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading
            index="04"
            title="Project Showcase"
            subtitle="Featured projects I am building or have completed. This section grows as I create more."
          />
        </Reveal>

        {showcaseProjects.length === 0 ? (
          <Reveal>
            <div className="card-base p-12 text-center">
              <Sparkle size={36} className="text-ink-600 mx-auto mb-4" />
              <p className="text-ink-500 mb-1">No showcase projects yet.</p>
              <p className="text-sm text-ink-600">Projects move here once they are in progress or completed.</p>
            </div>
          </Reveal>
        ) : (
          <Reveal stagger>
            <div className="grid sm:grid-cols-2 gap-5">
              {showcaseProjects.map(p => {
                const cfg = statusConfig[p.status];
                const StatusIcon = cfg.icon;
                return (
                  <div key={p.id} className="card-base card-hover p-6 group relative overflow-hidden">
                    {/* Glow on hover */}
                    <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(400px at 50% 0%, rgba(34,197,94,0.06), transparent)' }} />

                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                          <StatusIcon size={11} /> {cfg.label}
                        </div>
                        <span className="text-xs font-mono text-ink-500">{p.category}</span>
                      </div>

                      <h3 className="font-display font-semibold text-xl text-white mb-2 group-hover:text-neon-500 transition-colors">{p.title}</h3>
                      <p className="text-sm text-ink-500 leading-relaxed mb-4">{p.description}</p>

                      {p.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {p.technologies.map(tech => (
                            <span key={tech} className="px-2.5 py-0.5 rounded-md bg-white/5 text-xs text-ink-500 font-mono">{tech}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                        {p.githubUrl ? (
                          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-white transition-colors">
                            <Github size={16} /> GitHub
                          </a>
                        ) : (
                          <span className="flex items-center gap-1.5 text-sm text-ink-600">
                            <Github size={16} /> No repo
                          </span>
                        )}
                        {p.liveUrl && (
                          <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-neon-500 hover:text-neon-400 transition-colors ml-auto">
                            <ExternalLink size={16} /> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
