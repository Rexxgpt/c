export interface Project {
  id: string;
  title: string;
  type: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl: string;
  icon: string;
}

export type ThemeType = 'superlocal' | 'mono' | 'orange';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  bgClass: string;
  textClass: string;
  accentClass: string;
  accentHex: string;
  accentHoverClass: string;
  cardBgClass: string;
  borderColorClass: string;
  gridColor: string;
  glowClass: string;
}

export interface Bird {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  wingPhase: number;
  angle: number;
  color: string;
  depth?: number;
  revealScroll?: number;
  revealProgress?: number;
  hasTriggeredRipple?: boolean;
}
