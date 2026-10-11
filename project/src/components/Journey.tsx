import { useState } from 'react';
import { Lock, Play, Check, Pencil, Save, X } from 'lucide-react';
import { useData } from '@/store';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { Modal } from './Modal';
import type { JourneyData, YearGoal } from '@/types';

const yearKeys = ['year01', 'year02', 'year03', 'year04'] as const;
const yearTitles = ['FOUNDATION', 'EXPLORATION', 'SPECIALIZATION', 'LAUNCH'];

const statusConfig = {
  locked: { icon: Lock, label: 'Locked', color: 'text-ink-500', bg: 'bg-ink-700', border: 'border-ink-600' },
  current: { icon: Play, label: 'In Progress', color: 'text-neon-500', bg: 'bg-neon-500/10', border: 'border-neon-500/30' },
  completed: { icon: Check, label: 'Completed', color: 'text-neon-400', bg: 'bg-neon-500/15', border: 'border-neon-500/40' },
};

export function Journey() {
  const { data, updateJourney } = useData();
  const [editYear, setEditYear] = useState<number | null>(null);
  const [draft, setDraft] = useState<YearGoal | null>(null);

  const startEdit = (i: number) => {
    setEditYear(i);
    setDraft({ ...data.journey[yearKeys[i]] });
  };

  const save = () => {
    if (!draft || editYear === null) return;
    const updated = { ...data.journey, [yearKeys[editYear]]: draft } as JourneyData;
    updateJourney(updated);
    setEditYear(null);
    setDraft(null);
  };

  return (
    <section id="journey" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading
            index="01"
            title="My Journey"
            subtitle="A four-year roadmap from foundation to launch. I can edit these goals as my interests and education evolve."
          />
        </Reveal>

        <Reveal stagger>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {yearKeys.map((key, i) => {
              const year = data.journey[key];
              const cfg = statusConfig[year.status];
              const StatusIcon = cfg.icon;
              return (
                <div key={key} className={`card-base card-hover p-6 relative overflow-hidden ${cfg.border}`}>
                  {/* Year number background */}
                  <span className="absolute -top-2 -right-2 font-mono text-7xl font-bold text-white/[0.03] select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs text-neon-500 tracking-widest">
                        YEAR {String(i + 1).padStart(2, '0')}
                      </span>
                      <button
                        onClick={() => startEdit(i)}
                        className="text-ink-500 hover:text-neon-500 transition-colors p-1 rounded-lg hover:bg-white/5"
                        aria-label="Edit year"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>

                    <h3 className="font-display font-semibold text-lg text-white mb-4">{yearTitles[i]}</h3>

                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} ${cfg.border} border mb-4`}>
                      <StatusIcon size={11} />
                      {cfg.label}
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-ink-500">Progress</span>
                        <span className="font-mono text-neon-500">{year.progress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-neon-600 to-neon-400 progress-fill"
                          style={{ width: `${year.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs text-ink-500 font-mono mb-1">GOALS</p>
                        <p className="text-ink-500 leading-relaxed line-clamp-3">{year.goals}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-500 font-mono mb-1">SKILLS</p>
                        <p className="text-ink-500 leading-relaxed line-clamp-2">{year.skills}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-500 font-mono mb-1">PROJECTS</p>
                        <p className="text-ink-500 leading-relaxed line-clamp-2">{year.projects}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* Edit Modal */}
      <Modal
        open={editYear !== null}
        onClose={() => setEditYear(null)}
        title={`Edit Year ${editYear !== null ? editYear + 1 : ''}: ${editYear !== null ? yearTitles[editYear] : ''}`}
      >
        {draft && (
          <div className="space-y-4">
            <Field label="Status">
              <select
                value={draft.status}
                onChange={e => setDraft({ ...draft, status: e.target.value as YearGoal['status'] })}
                className="input-base"
              >
                <option value="locked">Locked</option>
                <option value="current">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </Field>

            <Field label={`Progress: ${draft.progress}%`}>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={draft.progress}
                onChange={e => setDraft({ ...draft, progress: parseInt(e.target.value) })}
                className="w-full accent-neon-500"
              />
            </Field>

            <Field label="Goals">
              <textarea
                value={draft.goals}
                onChange={e => setDraft({ ...draft, goals: e.target.value })}
                className="input-base min-h-[80px] resize-y"
              />
            </Field>

            <Field label="Skills to Learn">
              <textarea
                value={draft.skills}
                onChange={e => setDraft({ ...draft, skills: e.target.value })}
                className="input-base min-h-[60px] resize-y"
              />
            </Field>

            <Field label="Projects to Build">
              <textarea
                value={draft.projects}
                onChange={e => setDraft({ ...draft, projects: e.target.value })}
                className="input-base min-h-[60px] resize-y"
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <button onClick={save} className="btn-primary flex-1">
                <Save size={16} /> Save
              </button>
              <button onClick={() => setEditYear(null)} className="btn-ghost flex-1">
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .input-base {
          width: 100%;
          background: rgba(10,11,13,0.8);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 10px 14px;
          color: #e8eaed;
          font-size: 14px;
          outline: none;
          transition: border-color .2s;
        }
        .input-base:focus { border-color: rgba(34,197,94,0.4); }
        .btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          background: #22c55e; color: #050506; font-weight: 600;
          padding: 10px 18px; border-radius: 12px; transition: all .2s;
        }
        .btn-primary:hover { background: #4ade80; transform: translateY(-1px); }
        .btn-ghost {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          background: rgba(255,255,255,0.04); color: #e8eaed;
          padding: 10px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); transition: all .2s;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); }
        .btn-danger {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          background: rgba(239,68,68,0.1); color: #ef4444;
          padding: 10px 18px; border-radius: 12px; border: 1px solid rgba(239,68,68,0.2); transition: all .2s;
        }
        .btn-danger:hover { background: rgba(239,68,68,0.2); }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">{label}</label>
      {children}
    </div>
  );
}
