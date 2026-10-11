import { useState } from 'react';
import { Pencil, Save, X, Plus, Trash2, Link as LinkIcon, Award, Trophy, Flag, Target, BookOpen, User } from 'lucide-react';
import { useData } from '@/store';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { Modal } from './Modal';
import type { AboutData } from '@/types';

const emptyAbout: AboutData = {
  introduction: '', goals: '', certificates: '', ctfs: '', achievements: '', milestones: '', links: [],
};

export function About() {
  const { data, updateAbout } = useData();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<AboutData>(data.about);
  const [linkDraft, setLinkDraft] = useState({ label: '', url: '' });

  const startEdit = () => {
    setDraft({ ...data.about, links: [...data.about.links] });
    setEditing(true);
  };

  const save = () => {
    updateAbout(draft);
    setEditing(false);
  };

  const addLink = () => {
    if (!linkDraft.label.trim() || !linkDraft.url.trim()) return;
    setDraft({ ...draft, links: [...draft.links, { label: linkDraft.label, url: linkDraft.url }] });
    setLinkDraft({ label: '', url: '' });
  };

  const removeLink = (i: number) => {
    setDraft({ ...draft, links: draft.links.filter((_, j) => j !== i) });
  };

  const a = data.about;

  const sections = [
    { icon: User, label: 'Introduction', value: a.introduction, empty: 'No introduction yet.' },
    { icon: Target, label: 'My Goals', value: a.goals, empty: 'No goals set yet.' },
    { icon: Award, label: 'Certificates', value: a.certificates, empty: 'No certificates yet. Add them as you earn them.' },
    { icon: Trophy, label: 'CTF Competitions', value: a.ctfs, empty: 'No CTF competitions yet. Add them as you participate.' },
    { icon: Flag, label: 'Achievements', value: a.achievements, empty: 'No achievements yet. Add them as you accomplish them.' },
    { icon: BookOpen, label: 'Learning Milestones', value: a.milestones, empty: 'No milestones yet.' },
  ];

  return (
    <section id="about" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionHeading
            index="06"
            title="About & Achievements"
            subtitle="My introduction, goals, certificates, and milestones. I edit this as I progress — nothing here is invented for me."
          >
            <button
              onClick={startEdit}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-white font-semibold hover:border-neon-500/30 transition-all text-sm"
            >
              <Pencil size={16} /> Edit About
            </button>
          </SectionHeading>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.label} delay={i * 60}>
                <div className="card-base p-6 h-full">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-neon-500/10 flex items-center justify-center text-neon-500">
                      <Icon size={16} />
                    </div>
                    <h3 className="font-semibold text-white text-sm">{s.label}</h3>
                  </div>
                  {s.value ? (
                    <p className="text-sm text-ink-500 leading-relaxed whitespace-pre-wrap">{s.value}</p>
                  ) : (
                    <p className="text-sm text-ink-600 italic">{s.empty}</p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Profile links */}
        <Reveal>
          <div className="card-base p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-neon-500/10 flex items-center justify-center text-neon-500">
                <LinkIcon size={16} />
              </div>
              <h3 className="font-semibold text-white text-sm">Professional Profile Links</h3>
            </div>
            {a.links.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {a.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm text-ink-500 hover:text-neon-500 hover:border-neon-500/30 transition-all"
                  >
                    <LinkIcon size={13} /> {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-600 italic">No profile links yet. Add your GitHub, LinkedIn, or other profiles.</p>
            )}
          </div>
        </Reveal>
      </div>

      {/* Edit Modal */}
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit About Section">
        <div className="space-y-4">
          <EditField label="Introduction" value={draft.introduction} onChange={v => setDraft({ ...draft, introduction: v })} placeholder="Tell people who you are..." />
          <EditField label="My Goals" value={draft.goals} onChange={v => setDraft({ ...draft, goals: v })} placeholder="What are you working toward?" />
          <EditField label="Certificates" value={draft.certificates} onChange={v => setDraft({ ...draft, certificates: v })} placeholder="List certificates you have earned..." />
          <EditField label="CTF Competitions" value={draft.ctfs} onChange={v => setDraft({ ...draft, ctfs: v })} placeholder="CTF competitions you have participated in..." />
          <EditField label="Achievements" value={draft.achievements} onChange={v => setDraft({ ...draft, achievements: v })} placeholder="Your achievements..." />
          <EditField label="Learning Milestones" value={draft.milestones} onChange={v => setDraft({ ...draft, milestones: v })} placeholder="Key milestones in your journey..." />

          {/* Links editor */}
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Profile Links</label>
            <div className="space-y-2 mb-2">
              {draft.links.map((link, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 text-sm text-white truncate">{link.label}</span>
                  <span className="flex-1 text-xs text-ink-500 truncate">{link.url}</span>
                  <button onClick={() => removeLink(i)} className="text-ink-500 hover:text-red-400 p-1 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={linkDraft.label} onChange={e => setLinkDraft({ ...linkDraft, label: e.target.value })} className="flex-1 bg-ink-900/80 border border-white/8 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-neon-500/40 transition-colors" placeholder="Label (e.g. GitHub)" />
              <input value={linkDraft.url} onChange={e => setLinkDraft({ ...linkDraft, url: e.target.value })} className="flex-1 bg-ink-900/80 border border-white/8 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-neon-500/40 transition-colors" placeholder="URL" />
              <button onClick={addLink} className="px-3 py-2 rounded-xl bg-white/5 text-ink-500 hover:text-white transition-colors">
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={save} className="flex-1 inline-flex items-center justify-center gap-2 bg-neon-500 text-ink-950 font-semibold py-2.5 rounded-xl hover:bg-neon-400 transition-all text-sm">
              <Save size={16} /> Save
            </button>
            <button onClick={() => setEditing(false)} className="flex-1 inline-flex items-center justify-center gap-2 bg-white/5 text-white py-2.5 rounded-xl border border-white/8 hover:bg-white/8 transition-all text-sm">
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

function EditField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors min-h-[60px] resize-y" placeholder={placeholder} />
    </div>
  );
}
