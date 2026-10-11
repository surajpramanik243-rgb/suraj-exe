export type ProjectStatus = 'pending' | 'in-progress' | 'completed';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: ProjectStatus;
  isSample?: boolean;
  createdAt: number;
}

export type SkillStatus = 'pending' | 'learning' | 'completed';

export interface Skill {
  id: string;
  name: string;
  category: string;
  status: SkillStatus;
  isSample?: boolean;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  nextSteps: string;
  isSample?: boolean;
  createdAt: number;
}

export interface YearGoal {
  goals: string;
  skills: string;
  projects: string;
  status: 'locked' | 'current' | 'completed';
  progress: number; // 0-100
}

export interface JourneyData {
  year01: YearGoal;
  year02: YearGoal;
  year03: YearGoal;
  year04: YearGoal;
}

export interface AboutData {
  introduction: string;
  goals: string;
  certificates: string;
  ctfs: string;
  achievements: string;
  milestones: string;
  links: { label: string; url: string }[];
}

export interface AppData {
  version: number;
  projects: Project[];
  skills: Skill[];
  ideas: Idea[];
  journey: JourneyData;
  about: AboutData;
}

export const STORAGE_KEY = 'suraj_exe_data_v1';
