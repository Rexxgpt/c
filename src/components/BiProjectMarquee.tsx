import React, { useState, useRef } from 'react';
import { Project, ThemeConfig } from '../types';
import { PROJECTS } from '../data';
import { ExternalLink, Github, ArrowUpRight, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';

interface BiProjectMarqueeProps {
  theme: ThemeConfig;
}

export default function BiProjectMarquee({ theme }: BiProjectMarqueeProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // We duplicate the project arrays to have double lists inside each marquee track.
  // This satisfies 'Perfect Loop Mirroring'.
  const row1Projects = PROJECTS;
  const row2Projects = PROJECTS;

  return (
    <div 
      className="relative w-full py-10 md:py-14 overflow-hidden select-none scroll-reveal" 
      id="marquee-section"
    >
      
      {/* Main Container with bi-directional scrolls */}
      <div className="space-y-6 md:space-y-8 relative w-full">
        {/* ROW 1: Loops infinitely to the Left. Uses flex whitespace-nowrap overflow-x-hidden with pure CSS translates */}
        <div 
          className="relative flex whitespace-nowrap overflow-x-hidden py-2 border-y border-zinc-250/20 dark:border-zinc-850/20 bg-zinc-400/5 dark:bg-zinc-950/20 cursor-default group hover:[&>div]:[animation-play-state:paused] w-full"
          id="marquee-row-1"
        >
          {/* Track 1 (Original) */}
          <div 
            className="animate-marquee-left flex flex-row shrink-0 transform-gpu"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
          >
            {row1Projects.map((project, idx) => (
              <div key={`row1-a-${project.id}-${idx}`} className="pr-5 shrink-0 transform-gpu" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                <MarqueeCard
                  project={project}
                  index={idx}
                  theme={theme}
                  onClick={() => setSelectedProject(project)}
                />
              </div>
            ))}
          </div>
          {/* Track 2 (Mirror Copy for seamless infinite wrap) */}
          <div 
            className="animate-marquee-left flex flex-row shrink-0 transform-gpu"
            aria-hidden="true"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
          >
            {row1Projects.map((project, idx) => (
              <div key={`row1-b-${project.id}-${idx}`} className="pr-5 shrink-0 transform-gpu" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                <MarqueeCard
                  project={project}
                  index={idx}
                  theme={theme}
                  onClick={() => setSelectedProject(project)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Loops infinitely to the Right. Uses flex whitespace-nowrap overflow-x-hidden with pure CSS translates */}
        <div 
          className="relative flex whitespace-nowrap overflow-x-hidden py-2 border-b border-zinc-250/20 dark:border-zinc-850/20 bg-zinc-400/5 dark:bg-zinc-950/20 cursor-default group hover:[&>div]:[animation-play-state:paused] w-full"
          id="marquee-row-2"
        >
          {/* Track 1 (Original) */}
          <div 
            className="animate-marquee-right flex flex-row shrink-0 transform-gpu"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
          >
            {row2Projects.map((project, idx) => (
              <div key={`row2-a-${project.id}-${idx}`} className="pr-5 shrink-0 transform-gpu" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                <MarqueeCard
                  project={project}
                  index={idx}
                  theme={theme}
                  onClick={() => setSelectedProject(project)}
                />
              </div>
            ))}
          </div>
          {/* Track 2 (Mirror Copy for seamless infinite wrap) */}
          <div 
            className="animate-marquee-right flex flex-row shrink-0 transform-gpu"
            aria-hidden="true"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
          >
            {row2Projects.map((project, idx) => (
              <div key={`row2-b-${project.id}-${idx}`} className="pr-5 shrink-0 transform-gpu" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                <MarqueeCard
                  project={project}
                  index={idx}
                  theme={theme}
                  onClick={() => setSelectedProject(project)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions Overlay */}
      <div className="flex justify-center mt-6">
        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-zinc-500">
          <AlertCircle className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-650" />
          <span>HOVER ROW TO SLEEP • CLICK A CARD TO DIAGNOSE MODULE CONFIGS</span>
        </span>
      </div>

      {/* STUNNING PROJECT DETAIL MODAL - Wrapped in a portal to escape CSS transforms and pins */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className={`relative max-w-2xl w-full rounded-2xl border p-6 md:p-8 shadow-2xl overflow-hidden cursor-default ${
                  theme.id === 'mono' 
                    ? 'bg-white text-zinc-950 border-zinc-950' 
                    : 'bg-[#111827] border-zinc-800 text-zinc-100'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Corner indicators for classic agency/Superlocal framing aesthetic */}
                <span className={`absolute top-3 left-3 w-2 h-2 border-t border-l ${theme.id === 'mono' ? 'border-zinc-950/60' : 'border-zinc-700'}`} />
                <span className={`absolute top-3 right-3 w-2 h-2 border-t border-r ${theme.id === 'mono' ? 'border-zinc-950/60' : 'border-zinc-700'}`} />
                <span className={`absolute bottom-3 left-3 w-2 h-2 border-b border-l ${theme.id === 'mono' ? 'border-zinc-950/60' : 'border-zinc-700'}`} />
                <span className={`absolute bottom-3 right-3 w-2 h-2 border-b border-r ${theme.id === 'mono' ? 'border-zinc-950/60' : 'border-zinc-700'}`} />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className={`absolute top-4 right-4 p-2 rounded-full border transition-all ${
                    theme.id === 'mono'
                      ? 'border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 text-zinc-950'
                      : 'border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-300'
                  }`}
                  title="Close overlay"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header inside modal */}
                <div className="flex items-center gap-3.5 mb-5 mt-2">
                  <span className="text-4xl select-none" role="img" aria-label={selectedProject.title}>
                    {selectedProject.icon}
                  </span>
                  <div>
                    <span className={`text-[10px] font-mono uppercase font-black tracking-widest ${theme.accentClass}`}>
                      {selectedProject.type}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-sans font-black tracking-tight uppercase leading-tight">
                      {selectedProject.title}
                    </h3>
                  </div>
                </div>

                {/* Core description grid */}
                <div className="space-y-4 font-sans mb-8">
                  <div>
                    <h4 className="text-[10px] font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase font-black mb-1.5">
                      TECHNICAL SPECIFICATION
                    </h4>
                    <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Integration architecture tags */}
                  <div>
                    <h4 className="text-[10px] font-mono tracking-widest text-zinc-400 dark:text-zinc-500 uppercase font-black mb-2">
                      TECHNOLOGY CONGRUENCY INDEX
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className={`text-[10px] font-mono font-bold tracking-tight px-2.5 py-1 rounded transition-colors ${
                            theme.id === 'mono'
                              ? 'bg-zinc-100 border border-zinc-250 text-zinc-950 hover:bg-zinc-950 hover:text-white'
                              : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom direct hyperlink triggers */}
                <div className="flex items-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-900">
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg border font-mono text-xs font-black uppercase tracking-wider select-none transition-all duration-300 cursor-pointer ${
                        theme.id === 'mono'
                          ? 'bg-zinc-950 border-zinc-950 text-white hover:bg-zinc-900'
                          : `bg-orange-500 border-transparent text-black hover:bg-orange-400`
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>LAUNCH REPLICA</span>
                    </a>
                  )}
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-lg border font-mono text-xs font-bold uppercase tracking-wider select-none transition-all duration-300 cursor-pointer ${
                      theme.id === 'mono'
                        ? 'border-zinc-300 hover:border-zinc-450 hover:bg-zinc-50 text-zinc-950'
                        : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>DECRYPT REPOSITORY</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

/* MARQUEE CARD COMPONENT (Small rectangular card showcasing portfolio item inside infinite tracks) */
interface MarqueeCardProps {
  project: Project;
  index: number;
  theme: ThemeConfig;
  onClick: () => void;
}

function MarqueeCard({ project, index, theme, onClick }: MarqueeCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative mouse positioning inside the viewport coordinate
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Apply exact tilt multipliers
    const maxTilt = 8;
    const x = (mouseY / height - 0.5) * -maxTilt;
    const y = (mouseX / width - 0.5) * maxTilt;

    setTilt({ x, y });

    // Specular highlight positions
    const glareX = (mouseX / width) * 100;
    const glareY = (mouseY / height) * 100;
    setGlare({ x: glareX, y: glareY, opacity: 0.2 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  // Build the dynamic inline style for the cards inside the scrolling lists
  const cardStyle = {
    transform: isHovered
      ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.05, 1.05, 1.05)`
      : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: isHovered ? 'none' : 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, border-color 0.3s ease-in-out',
    boxShadow: isHovered
      ? (theme.id === 'mono'
          ? '0 12px 20px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)'
          : `0 15px 30px -8px rgba(255, 107, 0, 0.25)`)
      : 'none'
  };

  // Build the specular highlight layer
  const glareStyle = {
    background: `radial-gradient(circle 90px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${theme.id === 'mono' ? '0.22' : '0.14'}), transparent)`,
    opacity: glare.opacity,
    transition: isHovered ? 'opacity 0.1s ease-out' : 'opacity 0.3s ease-in-out',
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={cardStyle}
      className={`relative w-[280px] sm:w-[320px] shrink-0 p-4.5 md:p-5 rounded-xl border backdrop-blur-md cursor-pointer select-none overflow-hidden group transition-[background-color,border-color,box-shadow,opacity] duration-300 ease-in-out ${
        theme.cardBgClass
      } ${
        isHovered
          ? (theme.id === 'mono' ? 'border-zinc-950' : 'border-[#FF6B00]')
          : (theme.id === 'mono' ? 'border-zinc-950/20' : 'border-zinc-900/40')
      }`}
    >
      {/* Visual Glare highlight */}
      <div className="absolute inset-0 pointer-events-none z-10" style={glareStyle} />

      {/* Frame Corners (Inspired by Museum framing layout specs) */}
      <span className={`absolute top-1.5 left-1.5 w-1 h-1 border-t border-l transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-40'
      } ${theme.id === 'mono' ? 'border-zinc-950/90' : 'border-current/50'} ${theme.id !== 'mono' ? theme.accentClass : ''}`} />
      <span className={`absolute top-1.5 right-1.5 w-1 h-1 border-t border-r transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-40'
      } ${theme.id === 'mono' ? 'border-zinc-950/90' : 'border-current/50'} ${theme.id !== 'mono' ? theme.accentClass : ''}`} />
      <span className={`absolute bottom-1.5 left-1.5 w-1 h-1 border-b border-l transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-40'
      } ${theme.id === 'mono' ? 'border-zinc-950/90' : 'border-current/50'} ${theme.id !== 'mono' ? theme.accentClass : ''}`} />
      <span className={`absolute bottom-1.5 right-1.5 w-1 h-1 border-b border-r transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-40'
      } ${theme.id === 'mono' ? 'border-zinc-950/90' : 'border-current/50'} ${theme.id !== 'mono' ? theme.accentClass : ''}`} />

      {/* Inner thin rectangular grid border */}
      <div className={`absolute inset-2 border rounded-lg pointer-events-none transition-all duration-300 ${
        isHovered
          ? (theme.id === 'mono' ? 'border-zinc-950/10' : `border-current/8`)
          : 'border-transparent'
      }`} />

      <div className="relative z-10 h-full flex flex-col justify-between">
        {/* Top bar header */}
        <div className="flex items-start justify-between mb-3">
          <span className="font-mono text-[9px] text-zinc-500 font-extrabold tracking-wider">
            [0{(index % PROJECTS.length) + 1}] / {project.type.split(' ')[0].toUpperCase()}
          </span>
          <span className="text-xl filter drop-shadow-sm select-none" role="img" aria-label={project.title}>
            {project.icon}
          </span>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h4 className="text-md sm:text-lg font-sans font-black tracking-tight leading-snug uppercase group-hover:translate-x-1 transition-all duration-300 flex items-center gap-1 text-current">
            <span>{project.title}</span>
            <ArrowUpRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 ${theme.accentClass}`} />
          </h4>
          <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-sans line-clamp-2 mt-1">
            {project.description}
          </p>
        </div>

        {/* Technologies tags bar */}
        <div className="mt-3 pt-2.5 border-t border-zinc-200/20 dark:border-zinc-800/60 flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className={`text-[8.5px] font-mono font-bold tracking-tight px-1.5 py-0.5 rounded leading-none transition-colors ${
                theme.id === 'mono'
                  ? 'bg-zinc-100 border border-zinc-200 text-zinc-800'
                  : 'bg-zinc-900 border border-zinc-850 text-zinc-450'
              }`}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[8.5px] font-mono font-bold text-zinc-450 dark:text-zinc-550 leading-none">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
