import React, { useState, useRef } from 'react';
import { SKILL_CATEGORIES } from '../data';
import { ThemeConfig } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Cpu, Terminal, Shield, Zap, Layers } from 'lucide-react';

interface SkillsGridProps {
  theme: ThemeConfig;
}

type CategoryType = 'Frontend Architecture' | 'Backend Engineering' | 'Environment Tools' | 'Data & Cloud Security';

export default function SkillsGrid({ theme }: SkillsGridProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('Frontend Architecture');
  
  // Interactive Simulator States
  const [hoveredPart, setHoveredPart] = useState<'left' | 'right' | 'wheel' | 'body' | null>(null);
  const [pressedPart, setPressedPart] = useState<'left' | 'right' | 'wheel' | 'body' | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  
  // Ref tracking for double click resolution
  const lastLeftClick = useRef<number>(0);
  const lastRightClick = useRef<number>(0);

  // Active Category Data
  const currentCategory = SKILL_CATEGORIES.find(cat => cat.title === activeCategory) || SKILL_CATEGORIES[0];

  // Helper to map category names to icons
  const getCategoryIcon = (categoryTitle: string) => {
    switch (categoryTitle) {
      case 'Frontend Architecture':
        return <Layers className={`w-5 h-5 ${theme.accentClass}`} />;
      case 'Backend Engineering':
        return <Cpu className={`w-5 h-5 ${theme.accentClass}`} />;
      case 'Environment Tools':
        return <Terminal className={`w-5 h-5 ${theme.accentClass}`} />;
      case 'Data & Cloud Security':
        return <Shield className={`w-5 h-5 ${theme.accentClass}`} />;
      default:
        return <Zap className={`w-5 h-5 ${theme.accentClass}`} />;
    }
  };

  // Click Resolvers (Unified Desktop & Mobile support with double-click handling)
  const handleLeftClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setPressedPart('left');
    setTimeout(() => setPressedPart(null), 150);
    
    const now = Date.now();
    const timeSinceLast = now - lastLeftClick.current;
    
    if (timeSinceLast < 300) {
      setActiveCategory('Environment Tools');
    } else {
      setActiveCategory('Frontend Architecture');
    }
    lastLeftClick.current = now;
  };

  const handleRightClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setPressedPart('right');
    setTimeout(() => setPressedPart(null), 150);
    
    const now = Date.now();
    const timeSinceLast = now - lastRightClick.current;
    
    if (timeSinceLast < 300) {
      setActiveCategory('Data & Cloud Security');
    } else {
      setActiveCategory('Backend Engineering');
    }
    lastRightClick.current = now;
  };

  const handleWheelClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setPressedPart('wheel');
    setTimeout(() => setPressedPart(null), 150);
    // Cycle state
    const currentIdx = SKILL_CATEGORIES.findIndex(cat => cat.title === activeCategory);
    const nextIdx = (currentIdx + 1) % SKILL_CATEGORIES.length;
    setActiveCategory(SKILL_CATEGORIES[nextIdx].title as CategoryType);
  };

  // Color mappings for hover glows based on theme
  const accentHex = theme.accentHex === '#000000' || !theme.accentHex ? '#f97316' : theme.accentHex;
  const hoverFillColor = `${accentHex}1a`; // 10% opacity hex
  const pressedFillColor = `${accentHex}40`; // 25% opacity hex

  return (
    <div className="relative bg-white/60 dark:bg-zinc-950/40 backdrop-blur-md border border-zinc-200 dark:border-zinc-900/80 rounded-2xl p-6 md:p-8 overflow-hidden text-current shadow-lg scroll-reveal">
      
      {/* Absolute futuristic boundary grid aesthetic */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-zinc-200 dark:bg-zinc-900/30 opacity-60 pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* LEFT COLUMN: THE MOUSE HARDWARE CONTROLLER DECK */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-900/50 bg-zinc-50/20 dark:bg-zinc-950/20 relative group-inner min-h-[380px]">
          
          {/* Subtle high tech header grid marker */}
          <div className="absolute top-3 left-4 right-4 flex justify-between items-center font-mono text-[8px] text-zinc-400 dark:text-zinc-650 tracking-wider">
            <span>ID: DRIVER_HARDWARE_M_v1.02</span>
            <span className="animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> ONLINE
            </span>
          </div>

          {/* ONBOARDING FLOW INDICATOR */}
          <div className="mb-4 text-center mt-3">
            <span className="inline-block font-mono text-[9px] px-2 py-0.5 rounded-full border border-orange-500/20 text-orange-500 animate-pulse bg-orange-500/5 tracking-wider font-extrabold uppercase">
              • CLICK SVG TO NAVIGATE CATEGORIES
            </span>
          </div>

          {/* VIRTUAL MOUSE CONTROLLER SVG DISPLAY */}
          <div className="relative w-44 h-56 flex items-center justify-center">
            {/* Dynamic Ambient Backlight Glow centered behind mouse */}
            <div 
              className="absolute w-28 h-40 blur-[32px] opacity-15 rounded-full transition-colors duration-500 pointer-events-none"
              style={{
                backgroundColor: hoveredPart ? accentHex : '#3b82f6',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%'
              }}
            />

            <svg 
              viewBox="0 0 160 260" 
              className="w-full h-full drop-shadow-2xl relative select-none"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.1))' }}
            >
              <g id="mouse-shell">
                {/* Main Outer Mouse Boundary Capsule */}
                <rect 
                  x="20" 
                  y="20" 
                  width="120" 
                  height="220" 
                  rx="60" 
                  fill={theme.id === 'mono' ? '#ffffff' : '#07090e'} 
                  stroke={theme.id === 'mono' ? '#09090b' : '#1e293b'} 
                  strokeWidth="2.5" 
                  className="transition-colors duration-300"
                />

                {/* Left Click Region */}
                <path 
                  d="M 80 20 C 50 20, 23 45, 21 80 L 21 110 L 80 110 Z" 
                  fill={
                    pressedPart === 'left' ? pressedFillColor :
                    hoveredPart === 'left' ? hoverFillColor : 'transparent'
                  } 
                  stroke={
                    hoveredPart === 'left' ? accentHex : 
                    theme.id === 'mono' ? '#e2e8f0' : '#1e293b'
                  }
                  strokeWidth={hoveredPart === 'left' ? '2' : '1.5'}
                  className="cursor-pointer transition-all duration-150"
                  role="button"
                  aria-label="Frontend Architecture (Double click for Environment)"
                  onClick={handleLeftClick}
                  onMouseEnter={() => setHoveredPart('left')}
                  onMouseLeave={() => setHoveredPart(null)}
                />

                {/* Right Click Region */}
                <path 
                  d="M 80 20 C 110 20, 137 45, 139 80 L 139 110 L 80 110 Z" 
                  fill={
                    pressedPart === 'right' ? pressedFillColor :
                    hoveredPart === 'right' ? hoverFillColor : 'transparent'
                  } 
                  stroke={
                    hoveredPart === 'right' ? accentHex : 
                    theme.id === 'mono' ? '#e2e8f0' : '#1e293b'
                  }
                  strokeWidth={hoveredPart === 'right' ? '2' : '1.5'}
                  className="cursor-pointer transition-all duration-150"
                  role="button"
                  aria-label="Backend Engineering (Double click for Cloud & Data Security)"
                  onClick={handleRightClick}
                  onMouseEnter={() => setHoveredPart('right')}
                  onMouseLeave={() => setHoveredPart(null)}
                />

                {/* Middle Scroll Wheel Segment */}
                <g 
                  className="cursor-pointer"
                  onClick={handleWheelClick}
                  onMouseEnter={() => setHoveredPart('wheel')}
                  onMouseLeave={() => setHoveredPart(null)}
                  role="button"
                  aria-label="Cycle categories"
                >
                  {/* Wheel container/cutout */}
                  <rect 
                    x="74" 
                    y="45" 
                    width="12" 
                    height="32" 
                    rx="6" 
                    fill={theme.id === 'mono' ? '#f1f5f9' : '#0d111c'} 
                    stroke={theme.id === 'mono' ? '#cbd5e1' : '#1e293b'} 
                    strokeWidth="1.5"
                  />
                  {/* Active spinning wheel node */}
                  <rect 
                    x="77" 
                    y="50" 
                    width="6" 
                    height="16" 
                    rx="3" 
                    fill={
                      pressedPart === 'wheel' ? accentHex :
                      hoveredPart === 'wheel' ? accentHex : 
                      theme.id === 'mono' ? '#475569' : '#334155'
                    }
                    className="transition-colors duration-200"
                  />
                  {/* Spinning hashes */}
                  {hoveredPart === 'wheel' && (
                    <line x1="77" y1="58" x2="83" y2="58" stroke="#ffffff" strokeWidth="1" className="animate-pulse" />
                  )}
                </g>

                {/* Bottom Center Diagnostic Logo/Aesthetic */}
                <g id="decorations" className="opacity-15 pointer-events-none">
                  <circle cx="80" cy="180" r="28" stroke={accentHex} strokeWidth="0.5" strokeDasharray="4,4" fill="none" />
                  <circle cx="80" cy="180" r="14" stroke={accentHex} strokeWidth="0.5" fill="none" />
                  <line x1="80" y1="130" x2="80" y2="215" stroke={accentHex} strokeWidth="0.5" />
                  <line x1="45" y1="180" x2="115" y2="180" stroke={accentHex} strokeWidth="0.5" />
                </g>

                {/* Bottom Body Region */}
                <path 
                  d="M 21 110 L 139 110 L 139 190 C 139 225, 110 239, 80 239 C 50 239, 21 225, 21 190 Z" 
                  fill="transparent"
                  stroke={theme.id === 'mono' ? '#e2e8f0' : '#1e293b'}
                  strokeWidth="1.5"
                  className="cursor-pointer hover:bg-white/5"
                  onClick={handleWheelClick}
                  onMouseEnter={() => setHoveredPart('body')}
                  onMouseLeave={() => setHoveredPart(null)}
                />

                {/* Text overlay reading coordinates on body */}
                <text x="80" y="205" fill={theme.id === 'mono' ? '#64748b' : '#475569'} fontSize="7" fontFamily="monospace" textAnchor="middle" className="select-none tracking-widest opacity-80 uppercase font-extrabold font-mono">
                  ACCEL: 2400DPI
                </text>
              </g>
            </svg>
          </div>

          {/* SIMULATOR QUICK DIRECTORIES - TABS RACK UNDER THE MOUSE */}
          <div className="w-full mt-5 space-y-1.5 z-10">
            <span className="block text-center font-mono text-[8px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-black">
              CONSOLE SPEED INTEGRATIONS
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
              <button
                onClick={() => setActiveCategory('Frontend Architecture')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded border text-left transition-all ${
                  activeCategory === 'Frontend Architecture'
                  ? `bg-zinc-900 text-white border-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 ${theme.accentClass}`
                  : 'bg-white/50 dark:bg-zinc-900/10 border-zinc-200/50 dark:border-zinc-900 hover:bg-white/80 dark:hover:bg-zinc-900/40 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeCategory === 'Frontend Architecture' ? 'bg-orange-500 animate-ping' : 'bg-zinc-400'}`} />
                <span>Frontend [L_Click]</span>
              </button>

              <button
                onClick={() => setActiveCategory('Backend Engineering')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded border text-left transition-all ${
                  activeCategory === 'Backend Engineering'
                  ? `bg-zinc-900 text-white border-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 ${theme.accentClass}`
                  : 'bg-white/50 dark:bg-zinc-900/10 border-zinc-200/50 dark:border-zinc-900 hover:bg-white/80 dark:hover:bg-zinc-900/40 text-zinc-550 hover:text-zinc-850 dark:hover:text-zinc-300'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeCategory === 'Backend Engineering' ? 'bg-orange-500 animate-ping' : 'bg-zinc-400'}`} />
                <span>Backend [R_Click]</span>
              </button>

              <button
                onClick={() => setActiveCategory('Environment Tools')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded border text-left transition-all col-span-1 ${
                  activeCategory === 'Environment Tools'
                  ? `bg-zinc-900 text-white border-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 ${theme.accentClass}`
                  : 'bg-white/50 dark:bg-zinc-900/10 border-zinc-200/50 dark:border-zinc-900 hover:bg-white/80 dark:hover:bg-zinc-900/40 text-zinc-550 hover:text-zinc-850 dark:hover:text-zinc-300'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeCategory === 'Environment Tools' ? 'bg-orange-500 animate-ping' : 'bg-zinc-400'}`} />
                <span>Env Tools [DbL_L]</span>
              </button>

              <button
                onClick={() => setActiveCategory('Data & Cloud Security')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded border text-left transition-all col-span-1 ${
                  activeCategory === 'Data & Cloud Security'
                  ? `bg-zinc-900 text-white border-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 ${theme.accentClass}`
                  : 'bg-white/50 dark:bg-zinc-900/10 border-zinc-200/50 dark:border-zinc-900 hover:bg-white/80 dark:hover:bg-zinc-900/40 text-zinc-550 hover:text-zinc-850 dark:hover:text-zinc-300'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeCategory === 'Data & Cloud Security' ? 'bg-orange-500 animate-ping' : 'bg-zinc-400'}`} />
                <span>Security [DbL_R]</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE MATRIX CATEGORY DECK WITH SMOOTH HARDWARE-SLIDE / MATRIX TRANSITION */}
        <div className="lg:col-span-7 flex flex-col justify-between min-h-[440px] relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 25, filter: 'blur(5px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -25, filter: 'blur(5px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Category Header */}
              <div className="flex items-center gap-3.5 pb-3.5 border-b border-zinc-200/60 dark:border-zinc-900/80">
                <div className="p-2.5 rounded-xl bg-zinc-100/60 dark:bg-zinc-950/40 border border-zinc-200/40 dark:border-zinc-900/40 flex items-center justify-center">
                  {getCategoryIcon(activeCategory)}
                </div>
                <div>
                  <span className="block font-mono text-[9px] text-zinc-500 dark:text-zinc-500 uppercase font-black tracking-widest">
                    MODULE SUBSYSTEM // ACTIVE
                  </span>
                  <h3 className="text-2xl font-sans font-black tracking-tight uppercase font-display text-zinc-950 dark:text-white mt-0.5">
                    {currentCategory.title}
                  </h3>
                </div>
              </div>

              {/* Interactive Skill Grid */}
              <div className="space-y-4">
                {currentCategory.skills.map((skill) => {
                  const isHovered = hoveredSkill === skill.name;
                  return (
                    <div
                      key={skill.name}
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className={`relative flex flex-col pt-2 pb-2.5 border-b overflow-hidden cursor-crosshair transition-all duration-300 ease-in-out ${
                        isHovered 
                          ? 'translate-x-1.5 border-[#FF6B00]' 
                          : 'border-zinc-100 dark:border-zinc-900/50'
                      }`}
                      id={`skill-item-${skill.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <Check 
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isHovered ? `scale-110 ${theme.accentClass}` : 'scale-70 opacity-40 text-zinc-450 dark:text-zinc-650'
                            }`} 
                          />
                          <span className={`text-[13.5px] font-mono tracking-tight font-semibold transition-colors duration-200 ${
                            isHovered ? 'text-zinc-950 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'
                          }`}>
                            {skill.name}
                          </span>
                        </div>
                        <span className={`text-[11.5px] font-mono font-bold transition-colors duration-200 ${
                          isHovered ? theme.accentClass : 'text-zinc-400 dark:text-zinc-650'
                        }`}>
                          {skill.level}%
                        </span>
                      </div>

                      {/* Smooth progressive loading neon bar */}
                      <div className="w-full h-[3px] bg-zinc-200 dark:bg-zinc-900/80 overflow-hidden mt-2 rounded-sm relative">
                        {/* Shimmer overlay effect */}
                        {isHovered && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer z-20" />
                        )}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1], delay: 0.05 }}
                          className="h-full bg-current transition-colors absolute left-0 top-0"
                          style={{
                            color: isHovered ? accentHex : (theme.id === 'mono' ? '#18181b' : '#3f3f46'),
                            boxShadow: isHovered ? `0 0 8px ${accentHex}` : 'none'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Active category details overlay footer */}
          <div className="pt-6 border-t border-zinc-200/50 dark:border-zinc-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-zinc-400 dark:text-zinc-650 font-mono mt-4">
            <span className="uppercase text-[9px] font-bold tracking-widest">
              HARDWARE CONNECTION: STABLE_GIGABIT
            </span>
            <span className="uppercase text-[9px] font-bold tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping inline-block" />
              SIM_SPEED: REALTIME_60FPS
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
