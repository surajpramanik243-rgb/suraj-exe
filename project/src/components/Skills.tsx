import { useState } from 'react';
import { Plus, Pencil, Trash2, Clock, CircleDot, CheckCircle2, Cpu, Code, Network, Terminal, Globe, Wrench, Sparkles } from 'lucide-react';
import { useData } from '@/store';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { Modal } from './Modal';
import type { Skill, SkillStatus } from '@/types';

const categories = [
  { name: 'Cybersecurity', icon: Cpu },
  { name: 'Programming', icon: Code },
  { name: 'Networking', icon: Network },
  { name: 'Linux', icon: Terminal },
  { name: 'Web Development', icon: Globe },
  { name: 'Tools and Technologies', icon: Wrench },
  { name: 'Future Interests', icon: Sparkles },
];

const statusConfig: Record<SkillStatus, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  'pending': { label: 'Pending', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  'learning': { label: 'Learning', icon: CircleDot, color: 'text-neon-500', bg: 'bg-neon-500/10' },
  'completed': { label: 'Completed', icon: CheckCircle2, color: 'text-neon-400', bg: 'bg-neon-400/10' },
};

const nextStatus: Record<SkillStatus, SkillStatus> = {
  'pending': 'learning',
  'learning': 'completed',
  'completed': 'pending',
};

export function Skills() {
  const { data, addSkill, updateSkill, deleteSkill } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', category: 'Cybersecurity', status: 'pending' as SkillStatus });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const openAdd = (category?: string) => {
    setEditingId(null);
    setForm({ name: '', category: category || 'Cybersecurity', status: 'pending' });
    setModalOpen(true);
  };

  const openEdit = (s: Skill) => {
    setEditingId(s.id);
    setForm({ name: s.name, category: s.category, status: s.status });
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      updateSkill(editingId, form);
    } else {
      addSkill(form);
    }
    setModalOpen(false);
  };

  return (
    <section id="skills" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading
            index="03"
            title="Skills & Learning"
            subtitle="Tracking every skill I am learning and want to learn. Nothing is auto-completed — I mark skills as I truly learn them."
          >
            <button
              onClick={() => openAdd()}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-500 text-ink-950 font-semibold hover:bg-neon-400 transition-all hover:scale-[1.02] text-sm"
            >
              <Plus size={16} /> Add Skill
            </button>
          </SectionHeading>
        </Reveal>

        <div className="space-y-6">
          {categories.map((cat, ci) => {
            const skills = data.skills.filter(s => s.category === cat.name);
            const Icon = cat.icon;
            const learningCount = skills.filter(s => s.status === 'learning').length;
            const completedCount = skills.filter(s => s.status === 'completed').length;
            return (
              <Reveal key={cat.name} delay={ci * 50}>
                <div className="card-base p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neon-500/10 flex items-center justify-center text-neon-500">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{cat.name}</h3>
                        <p className="text-xs text-ink-500">
                          {skills.length} skill{skills.length !== 1 ? 's' : ''}
                          {learningCount > 0 && <span className="text-neon-500"> · {learningCount} learning</span>}
                          {completedCount > 0 && <span className="text-neon-400"> · {completedCount} done</span>}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => openAdd(cat.name)}
                      className="text-ink-500 hover:text-neon-500 p-2 rounded-lg hover:bg-white/5 transition-colors"
                      aria-label="Add skill to this category"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {skills.length === 0 ? (
                    <p className="text-sm text-ink-600 py-3 text-center">No skills in this category yet.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {skills.map(s => {
                        const cfg = statusConfig[s.status];
                        const StatusIcon = cfg.icon;
                        return (
                          <div
                            key={s.id}
                            className="group flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-neon-500/20 transition-all"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <button
                                onClick={() => updateSkill(s.id, { status: nextStatus[s.status] })}
                                className={`w-7 h-7 rounded-lg ${cfg.bg} ${cfg.color} flex items-center justify-center flex-shrink-0 transition-all hover:scale-110`}
                                title={`Click to change: ${cfg.label} → ${statusConfig[nextStatus[s.status]].label}`}
                                aria-label="Cycle status"
                              >
                                <StatusIcon size={13} />
                              </button>
                              <span className="text-sm text-white truncate">{s.name}</span>
                              {s.isSample && <span className="text-[9px] font-mono text-amber-400/50 flex-shrink-0">S</span>}
                            </div>
                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEdit(s)} className="text-ink-500 hover:text-neon-500 p-1 transition-colors" aria-label="Edit">
                                <Pencil size={12} />
                              </button>
                              <button onClick={() => setConfirmDelete(s.id)} className="text-ink-500 hover:text-red-400 p-1 transition-colors" aria-label="Delete">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Skill' : 'Add Skill'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Skill Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors" placeholder="e.g. Python" />
          </div>
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors">
              {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as SkillStatus })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors">
              <option value="pending">Pending</option>
              <option value="learning">Learning</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={submit} disabled={!form.name.trim()} className="flex-1 inline-flex items-center justify-center gap-2 bg-neon-500 text-ink-950 font-semibold py-2.5 rounded-xl hover:bg-neon-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm">
              {editingId ? 'Save' : 'Add Skill'}
            </button>
            <button onClick={() => setModalOpen(false)} className="flex-1 inline-flex items-center justify-center bg-white/5 text-white py-2.5 rounded-xl border border-white/8 hover:bg-white/8 transition-all text-sm">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Delete Skill?">
        <p className="text-ink-500 mb-5 text-sm">Remove this skill from your list?</p>
        <div className="flex gap-3">
          <button onClick={() => { if (confirmDelete) deleteSkill(confirmDelete); setConfirmDelete(null); }} className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500/15 text-red-400 border border-red-500/25 py-2.5 rounded-xl hover:bg-red-500/25 transition-all text-sm font-medium">
            <Trash2 size={15} /> Delete
          </button>
          <button onClick={() => setConfirmDelete(null)} className="flex-1 inline-flex items-center justify-center bg-white/5 text-white py-2.5 rounded-xl border border-white/8 hover:bg-white/8 transition-all text-sm">
            Cancel
          </button>
        </div>
      </Modal>
    </section>
  );
}
