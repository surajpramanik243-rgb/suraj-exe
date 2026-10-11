import type { AppData, Project, Skill, Idea, JourneyData, AboutData } from './types';

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

const sampleProjects: Project[] = [
  {
    id: uid(),
    title: 'Personal Portfolio Website (SURAJ.EXE)',
    description: 'Building my own personal brand website with a project tracker, skills dashboard, and learning roadmap. My first real web development project.',
    category: 'Web Development',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
    githubUrl: '',
    liveUrl: '',
    status: 'in-progress',
    isSample: true,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: uid(),
    title: 'Password Strength Analyzer',
    description: 'A tool that checks password strength, entropy, and common vulnerability patterns. A cybersecurity learning project.',
    category: 'Cybersecurity',
    technologies: ['Python', 'Regex'],
    githubUrl: '',
    liveUrl: '',
    status: 'pending',
    isSample: true,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: uid(),
    title: 'Linux Command Reference Sheet',
    description: 'A personal cheat sheet and reference guide for essential Linux commands I learn during my studies.',
    category: 'Linux',
    technologies: ['Markdown', 'Linux'],
    githubUrl: '',
    liveUrl: '',
    status: 'completed',
    isSample: true,
    createdAt: Date.now() - 86400000 * 14,
  },
];

const sampleSkills: Skill[] = [
  // Cybersecurity
  { id: uid(), name: 'Network Security Basics', category: 'Cybersecurity', status: 'learning', isSample: true },
  { id: uid(), name: 'Cryptography Fundamentals', category: 'Cybersecurity', status: 'pending', isSample: true },
  { id: uid(), name: 'OWASP Top 10', category: 'Cybersecurity', status: 'pending', isSample: true },
  { id: uid(), name: 'Penetration Testing Basics', category: 'Cybersecurity', status: 'pending', isSample: true },
  // Programming
  { id: uid(), name: 'Python', category: 'Programming', status: 'learning', isSample: true },
  { id: uid(), name: 'Bash Scripting', category: 'Programming', status: 'pending', isSample: true },
  { id: uid(), name: 'JavaScript / TypeScript', category: 'Programming', status: 'pending', isSample: true },
  // Networking
  { id: uid(), name: 'TCP/IP Fundamentals', category: 'Networking', status: 'learning', isSample: true },
  { id: uid(), name: 'DNS & HTTP Protocols', category: 'Networking', status: 'pending', isSample: true },
  { id: uid(), name: 'Wireshark / Packet Analysis', category: 'Networking', status: 'pending', isSample: true },
  // Linux
  { id: uid(), name: 'Linux Command Line', category: 'Linux', status: 'learning', isSample: true },
  { id: uid(), name: 'File Permissions & Users', category: 'Linux', status: 'completed', isSample: true },
  { id: uid(), name: 'System Services & Processes', category: 'Linux', status: 'pending', isSample: true },
  // Web Development
  { id: uid(), name: 'HTML & CSS', category: 'Web Development', status: 'completed', isSample: true },
  { id: uid(), name: 'React Basics', category: 'Web Development', status: 'pending', isSample: true },
  { id: uid(), name: 'REST APIs', category: 'Web Development', status: 'pending', isSample: true },
  // Tools & Technologies
  { id: uid(), name: 'Git & GitHub', category: 'Tools and Technologies', status: 'learning', isSample: true },
  { id: uid(), name: 'Virtual Machines / VirtualBox', category: 'Tools and Technologies', status: 'completed', isSample: true },
  { id: uid(), name: 'Docker Basics', category: 'Tools and Technologies', status: 'pending', isSample: true },
  { id: uid(), name: 'Nmap', category: 'Tools and Technologies', status: 'pending', isSample: true },
  // Future Interests
  { id: uid(), name: 'Machine Learning for Security', category: 'Future Interests', status: 'pending', isSample: true },
  { id: uid(), name: 'Cloud Security (AWS/Azure)', category: 'Future Interests', status: 'pending', isSample: true },
  { id: uid(), name: 'Mobile App Security', category: 'Future Interests', status: 'pending', isSample: true },
];

const sampleIdeas: Idea[] = [
  {
    id: uid(),
    title: 'Network Port Scanner Tool',
    description: 'Build a simple port scanner in Python to understand how nmap works under the hood. Great first cybersecurity tool project.',
    priority: 'high',
    nextSteps: 'Finish Python basics, learn about sockets, study TCP handshake, then build a basic scanner.',
    isSample: true,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: uid(),
    title: 'Cybersecurity Blog / Notes Site',
    description: 'A place to publish writeups, study notes, and CTF solutions. Could eventually become a public resource.',
    priority: 'medium',
    nextSteps: 'Research static site generators, decide on hosting, outline first 5 articles.',
    isSample: true,
    createdAt: Date.now() - 86400000,
  },
  {
    id: uid(),
    title: 'Phishing Awareness Quiz App',
    description: 'An interactive quiz that teaches people to spot phishing emails. Combines security knowledge with web development.',
    priority: 'low',
    nextSteps: 'Draft quiz questions, design UI mockup, decide on tech stack.',
    isSample: true,
    createdAt: Date.now() - 3600000,
  },
];

const defaultJourney: JourneyData = {
  year01: {
    goals: 'Build a strong foundation in computer science fundamentals, Linux, networking, and basic programming. Develop good study habits and start a coding portfolio.',
    skills: 'Python, Linux command line, basic networking, Git, HTML/CSS',
    projects: 'Personal website, Linux command reference, password strength checker',
    status: 'current',
    progress: 20,
  },
  year02: {
    goals: 'Explore different areas of cybersecurity and programming. Start participating in CTFs. deepen networking and web security knowledge.',
    skills: 'Bash scripting, web security basics, Wireshark, Nmap, introductory cryptography',
    projects: 'Port scanner, CTF writeup blog, phishing awareness tool',
    status: 'locked',
    progress: 0,
  },
  year03: {
    goals: 'Specialize in a chosen area of cybersecurity. Pursue relevant certifications. Build more advanced tools and contribute to open source.',
    skills: 'Penetration testing, security frameworks, advanced Python, cloud basics, a specialization area',
    projects: 'Security automation tools, open source contributions, certification study projects',
    status: 'locked',
    progress: 0,
  },
  year04: {
    goals: 'Launch into internships, real-world projects, and a professional presence. Prepare for a career in cybersecurity or a related field.',
    skills: 'Professional skills, interview prep, advanced specialization, project management',
    projects: 'Capstone project, professional portfolio, internship work, published research or tools',
    status: 'locked',
    progress: 0,
  },
};

const defaultAbout: AboutData = {
  introduction: 'I am a first-year cybersecurity student passionate about building, learning, and creating in the world of technology. I am just starting my journey and excited to document every step.',
  goals: 'Build a strong foundation in cybersecurity, become proficient in multiple programming languages, contribute to open source, and eventually launch a career in security or technology.',
  certificates: '',
  ctfs: '',
  achievements: '',
  milestones: 'Started my cybersecurity degree. Built my first personal website.',
  links: [],
};

export function createInitialData(): AppData {
  return {
    version: 1,
    projects: sampleProjects,
    skills: sampleSkills,
    ideas: sampleIdeas,
    journey: defaultJourney,
    about: defaultAbout,
  };
}

export function newId() {
  return uid();
}
