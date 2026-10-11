import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, FolderGit2, Github, ExternalLink, CircleDot, CheckCircle2, Clock } from 'lucide-react';
import { useData } from '@/store';
import { Reveal } from './Reveal';
import { SectionHeading } from './SectionHeading';
import { Modal } from './Modal';
import type { Project, ProjectStatus } from '@/types';

const statusConfig: Record<ProjectStatus, { label: string; icon: typeof Clock; color: string; bg: string; border: string }> = {
  'pending': { label: 'Pending', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/25' },
  'in-progress': { label: 'In Progress', icon: CircleDot, color: 'text-neon-500', bg: 'bg-neon-500/10', border: 'border-neon-500/25' },
  'completed': { label: 'Completed', icon: CheckCircle2, color: 'text-neon-400', bg: 'bg-neon-400/10', border: 'border-neon-400/30' },
};

const filters: { key: ProjectStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
];

const emptyForm: Omit<Project, 'id' | 'createdAt'> = {
  title: '', description: '', category: '', technologies: [], githubUrl: '', liveUrl: '', status: 'pending',
};

export function ProjectTracker() {
  const { data, addProject, updateProject, deleteProject } = useData();
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [techInput, setTechInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const stats = useMemo(() => ({
    pending: data.projects.filter(p => p.status === 'pending').length,
    inProgress: data.projects.filter(p => p.status === 'in-progress').length,
    completed: data.projects.filter(p => p.status === 'completed').length,
    total: data.projects.length,
  }), [data.projects]);

  const filtered = useMemo(() => {
    return data.projects.filter(p => {
      const matchFilter = filter === 'all' || p.status === filter;
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [data.projects, filter, search]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setTechInput('');
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({ title: p.title, description: p.description, category: p.category, technologies: [...p.technologies], githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '', status: p.status });
    setTechInput('');
    setModalOpen(true);
  };

  const submit = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      updateProject(editingId, form);
    } else {
      addProject(form);
    }
    setModalOpen(false);
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      setForm({ ...form, technologies: [...form.technologies, t] });
    }
    setTechInput('');
  };

  return (
    <section id="tracker" className="relative z-10 py-24 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <SectionHeading
            index="02"
            title="Project Tracker"
            subtitle="Manage projects across pending, in progress, and completed. Track everything I build."
          >
            <button
              onClick={openAdd}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-500 text-ink-950 font-semibold hover:bg-neon-400 transition-all hover:scale-[1.02] text-sm"
            >
              <Plus size={16} /> Add Project
            </button>
          </SectionHeading>
        </Reveal>

        {/* Dashboard stats */}
        <Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <StatCard label="Total" value={stats.total} icon={FolderGit2} color="text-white" bg="bg-white/5" />
            <StatCard label="Pending" value={stats.pending} icon={Clock} color="text-amber-400" bg="bg-amber-400/10" />
            <StatCard label="In Progress" value={stats.inProgress} icon={CircleDot} color="text-neon-500" bg="bg-neon-500/10" />
            <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} color="text-neon-400" bg="bg-neon-400/10" />
          </div>
        </Reveal>

        {/* Filters + Search */}
        <Reveal>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex gap-2 flex-wrap">
              {filters.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === f.key
                      ? 'bg-neon-500 text-ink-950'
                      : 'glass text-ink-500 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="relative flex-1 sm:max-w-xs sm:ml-auto">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg glass text-sm text-white placeholder:text-ink-500 outline-none focus:border-neon-500/30 transition-colors"
              />
            </div>
          </div>
        </Reveal>

        {/* Projects grid */}
        {filtered.length === 0 ? (
          <Reveal>
            <div className="card-base p-12 text-center">
              <FolderGit2 size={40} className="text-ink-600 mx-auto mb-4" />
              <p className="text-ink-500 mb-2">
                {data.projects.length === 0 ? 'No projects yet.' : 'No projects match your filter.'}
              </p>
              <p className="text-sm text-ink-600 mb-4">
                {data.projects.length === 0 ? 'Start building — add your first project.' : 'Try a different filter or search term.'}
              </p>
              {data.projects.length === 0 && (
                <button onClick={openAdd} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-500 text-ink-950 font-semibold hover:bg-neon-400 text-sm transition-all">
                  <Plus size={16} /> Add Your First Project
                </button>
              )}
            </div>
          </Reveal>
        ) : (
          <Reveal stagger>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(p => {
                const cfg = statusConfig[p.status];
                const StatusIcon = cfg.icon;
                return (
                  <div key={p.id} className="card-base card-hover p-5 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} ${cfg.border} border`}>
                        <StatusIcon size={11} /> {cfg.label}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(p)} className="text-ink-500 hover:text-neon-500 p-1 rounded-lg hover:bg-white/5 transition-colors" aria-label="Edit">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setConfirmDelete(p.id)} className="text-ink-500 hover:text-red-400 p-1 rounded-lg hover:bg-white/5 transition-colors" aria-label="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-white mb-1.5 leading-snug">{p.title}</h3>
                    {p.isSample && <span className="text-[10px] font-mono text-amber-400/60 mb-1">SAMPLE</span>}

                    <p className="text-sm text-ink-500 leading-relaxed mb-3 flex-1 line-clamp-3">{p.description}</p>

                    {p.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {p.technologies.slice(0, 4).map(tech => (
                          <span key={tech} className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-ink-500 font-mono">{tech}</span>
                        ))}
                        {p.technologies.length > 4 && <span className="px-2 py-0.5 text-xs text-ink-600">+{p.technologies.length - 4}</span>}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                      {p.githubUrl ? (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-ink-500 hover:text-white transition-colors flex items-center gap-1 text-xs">
                          <Github size={14} /> Code
                        </a>
                      ) : <span className="text-ink-600 text-xs flex items-center gap-1"><Github size={14} /> No link</span>}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-neon-500 hover:text-neon-400 transition-colors flex items-center gap-1 text-xs ml-auto">
                          <ExternalLink size={14} /> Live
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Project' : 'Add New Project'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Title *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors" placeholder="Project name" />
          </div>
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors min-h-[70px] resize-y" placeholder="What is this project about?" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Category</label>
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors" placeholder="e.g. Cybersecurity" />
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ProjectStatus })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors">
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                className="flex-1 bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2 text-sm text-white outline-none focus:border-neon-500/40 transition-colors"
                placeholder="Type and press Enter"
              />
              <button onClick={addTech} type="button" className="px-3 py-2 rounded-xl bg-white/5 text-ink-500 hover:text-white text-sm transition-colors">
                <Plus size={16} />
              </button>
            </div>
            {form.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.technologies.map((t, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neon-500/10 text-neon-500 text-xs font-mono">
                    {t}
                    <button onClick={() => setForm({ ...form, technologies: form.technologies.filter((_, j) => j !== i) })} className="hover:text-white">
                      <Trash2 size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">GitHub URL</label>
              <input value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-500 mb-1.5 tracking-wider">Live Demo URL</label>
              <input value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} className="w-full bg-ink-900/80 border border-white/8 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-neon-500/40 transition-colors" placeholder="https://..." />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={submit} disabled={!form.title.trim()} className="flex-1 inline-flex items-center justify-center gap-2 bg-neon-500 text-ink-950 font-semibold py-2.5 rounded-xl hover:bg-neon-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm">
              {editingId ? 'Save Changes' : 'Add Project'}
            </button>
            <button onClick={() => setModalOpen(false)} className="flex-1 inline-flex items-center justify-center gap-2 bg-white/5 text-white py-2.5 rounded-xl border border-white/8 hover:bg-white/8 transition-all text-sm">
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Delete Project?">
        <p className="text-ink-500 mb-5 text-sm">This will permanently remove this project. This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => { if (confirmDelete) deleteProject(confirmDelete); setConfirmDelete(null); }} className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500/15 text-red-400 border border-red-500/25 py-2.5 rounded-xl hover:bg-red-500/25 transition-all text-sm font-medium">
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

function StatCard({ label, value, icon: Icon, color, bg }: { label: string; value: number; icon: typeof Clock; color: string; bg: string }) {
  return (
    <div className="card-base p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="font-display font-bold text-2xl text-white leading-none">{value}</p>
        <p className="text-xs text-ink-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}
