import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AppData, Project, Skill, Idea, JourneyData, AboutData } from './types';
import { STORAGE_KEY } from './types';
import { createInitialData, newId } from './data';

interface DataContextValue {
  data: AppData;
  // Projects
  addProject: (p: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  // Skills
  addSkill: (s: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, patch: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  // Ideas
  addIdea: (i: Omit<Idea, 'id' | 'createdAt'>) => void;
  updateIdea: (id: string, patch: Partial<Idea>) => void;
  deleteIdea: (id: string) => void;
  convertIdeaToProject: (id: string) => void;
  // Journey & About
  updateJourney: (j: JourneyData) => void;
  updateAbout: (a: AboutData) => void;
  // Data
  exportData: () => void;
  importData: (json: string) => boolean;
  resetData: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      // shallow validate
      if (parsed && Array.isArray(parsed.projects) && Array.isArray(parsed.skills)) {
        return parsed;
      }
    }
  } catch { /* ignore */ }
  const fresh = createInitialData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { /* ignore quota errors */ }
  }, [data]);

  const addProject = useCallback((p: Omit<Project, 'id' | 'createdAt'>) => {
    setData(d => ({ ...d, projects: [{ ...p, id: newId(), createdAt: Date.now() }, ...d.projects] }));
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setData(d => ({ ...d, projects: d.projects.map(p => p.id === id ? { ...p, ...patch } : p) }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setData(d => ({ ...d, projects: d.projects.filter(p => p.id !== id) }));
  }, []);

  const addSkill = useCallback((s: Omit<Skill, 'id'>) => {
    setData(d => ({ ...d, skills: [...d.skills, { ...s, id: newId() }] }));
  }, []);

  const updateSkill = useCallback((id: string, patch: Partial<Skill>) => {
    setData(d => ({ ...d, skills: d.skills.map(s => s.id === id ? { ...s, ...patch } : s) }));
  }, []);

  const deleteSkill = useCallback((id: string) => {
    setData(d => ({ ...d, skills: d.skills.filter(s => s.id !== id) }));
  }, []);

  const addIdea = useCallback((i: Omit<Idea, 'id' | 'createdAt'>) => {
    setData(d => ({ ...d, ideas: [{ ...i, id: newId(), createdAt: Date.now() }, ...d.ideas] }));
  }, []);

  const updateIdea = useCallback((id: string, patch: Partial<Idea>) => {
    setData(d => ({ ...d, ideas: d.ideas.map(i => i.id === id ? { ...i, ...patch } : i) }));
  }, []);

  const deleteIdea = useCallback((id: string) => {
    setData(d => ({ ...d, ideas: d.ideas.filter(i => i.id !== id) }));
  }, []);

  const convertIdeaToProject = useCallback((id: string) => {
    setData(d => {
      const idea = d.ideas.find(i => i.id === id);
      if (!idea) return d;
      const project: Project = {
        id: newId(),
        title: idea.title,
        description: idea.description,
        category: 'New',
        technologies: [],
        status: 'pending',
        createdAt: Date.now(),
      };
      return { ...d, projects: [project, ...d.projects], ideas: d.ideas.filter(i => i.id !== id) };
    });
  }, []);

  const updateJourney = useCallback((j: JourneyData) => {
    setData(d => ({ ...d, journey: j }));
  }, []);

  const updateAbout = useCallback((a: AboutData) => {
    setData(d => ({ ...d, about: a }));
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suraj-exe-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json) as AppData;
      if (!parsed || !Array.isArray(parsed.projects)) return false;
      setData(parsed);
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetData = useCallback(() => {
    const fresh = createInitialData();
    setData(fresh);
  }, []);

  return (
    <DataContext.Provider value={{
      data, addProject, updateProject, deleteProject,
      addSkill, updateSkill, deleteSkill,
      addIdea, updateIdea, deleteIdea, convertIdeaToProject,
      updateJourney, updateAbout, exportData, importData, resetData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
