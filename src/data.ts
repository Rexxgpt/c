import { Project, ThemeConfig } from './types';

export const THEMES: Record<string, ThemeConfig> = {
  superlocal: {
    id: 'superlocal',
    name: 'Superlocal',
    bgClass: 'bg-[#0B0F19]',
    textClass: 'text-zinc-100',
    accentClass: 'text-orange-500',
    accentHex: '#f97316',
    accentHoverClass: 'hover:text-orange-400',
    cardBgClass: 'bg-[#111827]/80 border-orange-500/10 hover:border-orange-500/30 text-zinc-100',
    borderColorClass: 'border-orange-500/20',
    gridColor: 'rgba(249, 115, 22, 0.04)',
    glowClass: 'shadow-[0_0_20px_rgba(249,115,22,0.15)]',
  },
  mono: {
    id: 'mono',
    name: 'Bold Stark Mono',
    bgClass: 'bg-[#F3F3F3]',
    textClass: 'text-zinc-950',
    accentClass: 'text-zinc-950',
    accentHex: '#000000',
    accentHoverClass: 'hover:text-zinc-700',
    cardBgClass: 'bg-white border-zinc-950 text-zinc-950 hover:bg-zinc-950 hover:text-white hover:border-zinc-950',
    borderColorClass: 'border-zinc-950',
    gridColor: 'rgba(0, 0, 0, 0.08)',
    glowClass: 'shadow-[0_0_20px_rgba(0,0,0,0.02)]',
  },
  orange: {
    id: 'orange',
    name: 'Sunset Terracotta',
    bgClass: 'bg-[#1e130c]',
    textClass: 'text-amber-50',
    accentClass: 'text-orange-400',
    accentHex: '#fb923c',
    accentHoverClass: 'hover:text-orange-300',
    cardBgClass: 'bg-[#2d1c13]/80 border-orange-850/20 hover:border-orange-500/40 text-amber-50',
    borderColorClass: 'border-orange-800/30',
    gridColor: 'rgba(251, 146, 60, 0.03)',
    glowClass: 'shadow-[0_0_20px_rgba(251,146,60,0.12)]',
  },
};

export const PROJECTS: Project[] = [
  {
    id: 'dekhle',
    title: 'DekhLe',
    type: 'OTT Streaming Platform',
    description: 'A full-stack OTT streaming platform inspired by Netflix, engineered with beautiful scalable micro-architectures and highly smooth, cinematically responsive media components.',
    technologies: ['React.js', 'Vite', 'Tailwind CSS', 'Redux Toolkit', 'Axios', 'Spring Boot', 'Spring Security', 'JWT', 'MongoDB', 'Cloudinary'],
    liveUrl: 'https://dekhle-1.onrender.com/',
    githubUrl: 'https://github.com/Ankush-0g/dekhle',
    icon: '🎬'
  },
  {
    id: 'queueflow',
    title: 'QueueFlow',
    type: 'Queue Management Platform',
    description: 'Real-time multi-branch queue management application designed for banks, hospital environments, and busy transaction checkpoints with instant live updates.',
    technologies: ['React 19', 'FastAPI', 'MongoDB', 'WebSockets', 'Resend API', 'Tailwind CSS', 'Shadcn UI'],
    liveUrl: 'https://queueflowss.onrender.com/',
    githubUrl: 'https://github.com/Ankush-0g/Queueflow',
    icon: '📊'
  },
  {
    id: 'vac',
    title: 'Virtual Assistant Compiler',
    type: 'Android Mobile Application',
    description: 'An elegant Android environment compiler that empowers programmers to compile, validate, and debug functional programs on-the-go directly from smartphone layers.',
    technologies: ['Android', 'Java', 'Judge0 API', 'XML Layouts', 'SDK Libraries'],
    githubUrl: 'https://github.com/Ankush-0g/VAC-virtual-assistant-compiler-',
    icon: '📱'
  },
  {
    id: 'rms',
    title: 'Restaurant Management System',
    type: 'Desktop System Application',
    description: 'Comprehensive, high-throughput desktop application dealing with staff management, modular inventory logs, order billing structures, and tabular financial auditing.',
    technologies: ['Java', 'Swing GUI', 'PostgreSQL', 'JDBC driver', 'JasperReports'],
    githubUrl: 'https://github.com/Ankush-0g/java-project',
    icon: '🍽️'
  },
  {
    id: 'sendkr',
    title: 'SendKR',
    type: 'P2P File Transfer Protocol',
    description: 'A modern, full-stack file sharing platform designed for ultra-fast, encrypted peer-to-peer or cloud-fallback transfers directly inside standard browser environments.',
    technologies: ['Node.js', 'Socket.io', 'Multer', 'React', 'Vite', 'Tailwind CSS', 'Lucide Icons', 'Framer Motion', 'Axios'],
    liveUrl: 'https://sendkr.onrender.com/',
    githubUrl: 'https://github.com/Ankush-0g/sendkr',
    icon: '📤'
  },
  {
    id: 'fittrack',
    title: 'FitTrack',
    type: 'AI-Powered Fitness Suite',
    description: 'An intelligent workout and diet optimizer leveraging Gemini neural engines to draft personalized fitness blueprints alongside scalable PostgreSQL stats structures.',
    technologies: ['React', 'TypeScript', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'JWT', 'Gemini API', 'Tailwind CSS', 'Lucide Icons', 'Recharts'],
    liveUrl: 'https://fit-track-v0hp.onrender.com/',
    githubUrl: 'https://github.com/Ankush-0g/FitTrack',
    icon: '🏋️'
  },
  {
    id: 'college-erp',
    title: 'College ERP',
    type: 'Enterprise Resource System',
    description: 'A cohesive enterprise resource planning dashboard orchestrating attendance books, grade vaults, notification broadcast nodes, and administrative authorization logs.',
    technologies: ['Java', 'Spring Boot', 'MySQL', 'React', 'Vite', 'Redux', 'Tailwind CSS', 'Firebase', 'Maven'],
    githubUrl: 'https://github.com/Ankush-0g/college-ERP-System',
    icon: '🏫'
  },
  {
    id: 'ganesh-marbles',
    title: 'Ganesh Marbles',
    type: 'Interactive Marble E-Commerce',
    description: 'Highly responsive digital commerce platform styled to showcase high-end natural stones and architectural marble with modular customer query structures.',
    technologies: ['Node.js', 'TypeScript', 'Tailwind CSS', 'Lucide Icons', 'Recharts', 'MongoDB', 'Vite', 'JWT'],
    liveUrl: 'https://web-l1ni.onrender.com/',
    githubUrl: 'https://github.com/Ankush-0g/Small_e-commerce-',
    icon: '💎'
  },
  {
    id: 'currency-converter',
    title: 'Currency Converter',
    type: 'Full-Stack Rate Compiler',
    description: 'Robust server-integrated exchange tool syncing live rates from API pools with highly protective offline-first lookup fallbacks to safeguard transactions.',
    technologies: ['Python', 'Flask', 'REST API', 'HTML', 'CSS', 'JavaScript'],
    githubUrl: 'https://github.com/Ankush-0g/Currency_conversion-Tool-Python',
    icon: '💱'
  }
];

export const SKILL_CATEGORIES = [
  {
    title: 'Frontend Architecture',
    skills: [
      { name: 'React.js', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Redux Toolkit', level: 80 },
      { name: 'Vite Ecosystem', level: 90 },
      { name: 'Framer Motion', level: 85 },
      { name: 'Tailwind CSS', level: 95 },
      { name: 'HTML5 & CSS3', level: 95 },
      { name: 'Responsive UI Design', level: 95 }
    ]
  },
  {
    title: 'Backend Engineering',
    skills: [
      { name: 'Java Platform', level: 85 },
      { name: 'Spring Boot', level: 85 },
      { name: 'Spring MVC / REST API', level: 80 },
      { name: 'Spring Security & JWT', level: 80 },
      { name: 'FastAPI (Python)', level: 75 },
      { name: 'Maven Build Framework', level: 85 }
    ]
  },
  {
    title: 'Data & Cloud Security',
    skills: [
      { name: 'PostgreSQL', level: 80 },
      { name: 'MongoDB', level: 85 },
      { name: 'Neon Serverless Postgres', level: 80 },
      { name: 'Firebase Sync Engine', level: 80 },
      { name: 'Cloudinary CDN Integration', level: 85 }
    ]
  },
  {
    title: 'Environment Tools',
    skills: [
      { name: 'Git & Commandline Logs', level: 90 },
      { name: 'Render Platform Clones', level: 85 },
      { name: 'Railway Deploy Engines', level: 80 },
      { name: 'Postman Console Testing', level: 90 },
      { name: 'Docker Virtual Machines', level: 70 },
      { name: 'Swing App Frameworks', level: 80 }
    ]
  }
];

export const PERSONAL_DATA = {
  name: 'Ankush Gupta',
  title: 'Full Stack Developer',
  tagline: 'Crafting immersive digital architectures & smooth interactive systems.',
  bio: 'BCA graduate and passionate Full Stack Developer with experience in building responsive web applications using Java, Spring Boot, React, and modern web technologies. Focused on creating scalable, user-friendly solutions with clean UI and efficient backend systems.',
  email: 'ankushgupta4747@gmail.com',
  phone: '+91 7028111062',
  github: 'https://github.com/Ankush-0g',
  linkedin: 'https://www.linkedin.com/in/ankush-gupta07',
};
