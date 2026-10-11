import { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowRightLeft, Lightbulb, Flag } from 'lucide-react';
import { useData } from '@/store';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { Modal } from './Modal';
import type { Idea, Idea as IdeaType } from '@/types';

const priorityConfig: Record<Idea['priority'], { label: string; color: string; bg: string }> = {
  high: { label: 'High Priority', color: 'text-red-400', bg: 'bg-red-400/10' },
  medium: { label: 'Medium Priority', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  low: { label: 'Low Priority', color: 'text-ink-500', bg: 'bg-white/5' },
};

const emptyForm: Omit<IdeaType, 'id' | 'createdAt'> = {
  title: '', description: '', priority: 'medium', nextSteps: '',
};

export function Ideas() {
  const { data, addIdea, updateIdea, deleteIdea, convertIdeaToProject } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [convertId, setConvertId] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (idea: IdeaType) => {
    setEditingId(idea.id);
    setForm({ title: idea.title, description: idea.description, priority: idea.priority, nextSteps: idea.nextSteps });
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      updateIdea(editingId, form);
    } else {
      addIdea(form);
    }
    setModalOpen(false);
  };

  const sortedIdeas = [...data.ideas].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <section id="ideas" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <SectionHeading
            index="05"
            title="Future Ideas"
            subtitle="A vault of project concepts I want to explore. I can convert any idea into a project when I am ready to start."
          >
            <button
              onClick={openAdd}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-500 text-ink-950 font-semibold hover:bg-neon-400 transition-all hover:scale-[1.02] text-sm"
            >
              <Plus size={16} /> Add Idea
            </button>
          </SectionHeading>
        </Reveal>

        {sortedIdeas.length === 0 ? (
          <Reveal>
            <div className="card-base p-12 text-center">
              <Lightbulb size={36} className="text-ink-600 mx-auto mb-4" />
              <p className="text-ink-500 mb-1">No ideas yet.</p>
              <p className="text-sm text-ink-600 mb-4">Start collecting project concepts and future plans here.</p>
              <button onClick={openAdd} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-500 text-ink-950 font-semibold hover:bg-neon-400 text-sm transition-all">
                <Plus size={16} /> Add Your First Idea
              </button>
            </div>
          </Reveal>
        ) : (
          <div className="space-y-3">
            {sortedIdeas.map((idea, i) => {
              const cfg = priorityConfig[idea.priority];
              return (
                <Reveal key={idea.id} delay={i * 60}>
                  <div className="card-base card-hover p-5 group">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${cfg.bg} ${cfg.color} flex-shrink-0`} style={{ background: idea.priority === 'high' ? '#ef4444' : idea.priority === 'medium' ? '#f59e0b' : '#555' }} />
                        <h3 className="font-semibold text-white truncate">{idea.title}</h3>
                        {idea.isSample && <span className="text-[10px] font-mono text-amber-400/50 flex-shrink-0">SAMPLE</span>}
                      </div>
                      <div className="flex gap-0.5 flex-shrink-0">
                        <button onClick={() => openEdit(idea)} className="text-ink-500 hover:text-neon-500 p-1.5 rounded-lg hover:bg-white/5 transition-colors" aria-label="Edit">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setConfirmDelete(idea.id)} className="text-ink-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors" aria-label="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-ink-500 leading-relaxed mb-3">{idea.description}</p>

                    {idea.nextSteps && (
                      <div className="mb-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                        <p className="text-xs text-ink-600 font-mono mb-0.5 flex items-center gap-1"><Flag size={10} /> NEXT STEPS</p>
                        <p className="text-sm text-ink-500">{idea.nextSteps}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      <button
                        onClick={() => setConvertId(idea.id)}
                        className="inline-flex items-center gap-1.5 text-sm text-neon-500 hover:text-neon-400 transition-colors font-medium"
                      >
                        <ArrowRightLeft size={14} /> Convert to Project
                      </button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Idea' : 'Add New Idea'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors" placeholder="Project idea name" />
          </div>
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors min-h-[70px] resize-y" placeholder="What is this idea about?" />
          </div>
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Priority</label>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Idea['priority'] })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors">
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Planned Next Steps</label>
            <textarea value={form.nextSteps} onChange={e => setForm({ ...form, nextSteps: e.target.value })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors min-h-[50px] resize-y" placeholder="What should I do first to start this?" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={submit} disabled={!form.title.trim()} className="flex-1 inline-flex items-center justify-center gap-2 bg-neon-500 text-ink-950 font-semibold py-2.5 rounded-xl hover:bg-neon-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm">
              {editingId ? 'Save' : 'Add Idea'}
            </button>
            <button onClick={() => setModalOpen(false)} className="flex-1 inline-flex items-center justify-center bg-white/5 text-white py-2.5 rounded-xl border border-white/8 hover:bg-white/8 transition-all text-sm">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Delete Idea?">
        <p className="text-ink-500 mb-5 text-sm">Remove this idea from your vault?</p>
        <div className="flex gap-3">
          <button onClick={() => { if (confirmDelete) deleteIdea(confirmDelete); setConfirmDelete(null); }} className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500/15 text-red-400 border border-red-500/25 py-2.5 rounded-xl hover:bg-red-500/25 transition-all text-sm font-medium">
            <Trash2 size={15} /> Delete
          </button>
          <button onClick={() => setConfirmDelete(null)} className="flex-1 inline-flex items-center justify-center bg-white/5 text-white py-2.5 rounded-xl border border-white/8 hover:bg-white/8 transition-all text-sm">
            Cancel
          </button>
        </div>
      </Modal>

      {/* Convert confirm */}
      <Modal open={convertId !== null} onClose={() => setConvertId(null)} title="Convert to Project?">
        <p className="text-ink-500 mb-5 text-sm">
          This will create a new project with the idea's title and description, then remove it from your ideas. You can edit the new project afterward to add technologies and links.
        </p>
        <div className="flex gap-3">
          <button onClick={() => { if (convertId) convertIdeaToProject(convertId); setConvertId(null); }} className="flex-1 inline-flex items-center justify-center gap-2 bg-neon-500 text-ink-950 font-semibold py-2.5 rounded-xl hover:bg-neon-400 transition-all text-sm">
            <ArrowRightLeft size={15} /> Convert
          </button>
          <button onClick={() => setConvertId(null)} className="flex-1 inline-flex items-center justify-center bg-white/5 text-white py-2.5 rounded-xl border border-white/8 hover:bg-white/8 transition-all text-sm">
            Cancel
          </button>
        </div>
      </Modal>
    </section>
  );
}
