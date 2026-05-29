import React, { useState, useEffect, useRef } from 'react';
import { PROJECTS, THEMES, PERSONAL_DATA } from './data';
import { ThemeConfig } from './types';
import FloatingBirds from './components/FloatingBirds';
import CustomCursor from './components/CustomCursor';
import ThemeSelector from './components/ThemeSelector';
import BiProjectMarquee from './components/BiProjectMarquee';
import SkillsGrid from './components/SkillsGrid';
import ContactForm from './components/ContactForm';
import ScrollEntranceReveal from './components/ScrollEntranceReveal';
import ResumeDownloader from './components/ResumeDownloader';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  ChevronDown,
  Clock,
  Briefcase,
  Code2,
  PhoneCall,
  Zap,
  Download,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { setMuted, playClick, playHover, playSectionChange, playSuccess } from './utils/audio';

export default function App() {
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(THEMES.superlocal);
  const [loading, setLoading] = useState(true);
  const [loadPercent, setLoadPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);


  // Sync state to audio system
  useEffect(() => {
    setMuted(!audioEnabled);
  }, [audioEnabled]);

  // Section Change sound
  const prevSectionRef = useRef('home');
  useEffect(() => {
    if (!loading && audioEnabled && prevSectionRef.current !== activeSection) {
      prevSectionRef.current = activeSection;
      playSectionChange();
    }
  }, [activeSection, loading, audioEnabled]);

  // Global cursor click & hover handler sound delegator
  useEffect(() => {
    if (!audioEnabled) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const clickable = target.closest('a, button, [role="button"], [data-clickable], .cursor-pointer, input, textarea, select');
      if (clickable) {
        playClick();
      }
    };

    let lastHovered: Element | null = null;
    const handleGlobalMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const hoverable = target.closest('a, button, [role="button"], [data-cursor-project], .cursor-pointer, input, textarea, select');
      if (hoverable) {
        if (hoverable !== lastHovered) {
          lastHovered = hoverable;
          playHover();
        }
      } else {
        lastHovered = null;
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    window.addEventListener('mouseover', handleGlobalMouseOver, { capture: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
      window.removeEventListener('mouseover', handleGlobalMouseOver, { capture: true });
    };
  }, [audioEnabled]);

  // Trailing scroll index for parallax depth simulation
  const [scrollY, setScrollY] = useState(0);

  // Monitor loading progress smoothly for 2.5 seconds
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 8) + 3;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => setLoading(false), 400); // fade out duration
      }
      setLoadPercent(current);
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // Lightweight high-performance Intersection Observer for scroll reveal components
  useEffect(() => {
    if (loading) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.05,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Bind observers after loader clears and DOM updates
    const timeout = setTimeout(() => {
      const targets = document.querySelectorAll('.scroll-reveal');
      targets.forEach((target) => observer.observe(target));
    }, 600);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [loading]);

  // Sync scroll positions for parallax effects and navbar highlighting
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      const sections = ['home', 'projects', 'skills', 'contact'];
      const scrollPos = window.scrollY + 250;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Real-time clock countdown for high-precision design metrics
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format as HH:MM:SS UTC
      const formatted = now.toISOString().substring(11, 19) + ' UTC';
      setCurrentTime(formatted);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Setup theme styling on body tag dynamically
  useEffect(() => {
    const isDark = activeTheme.id !== 'mono';
    document.body.className = `${activeTheme.bgClass} ${activeTheme.textClass} ${isDark ? 'dark' : ''} transition-colors duration-500 overflow-x-hidden relative`;
  }, [activeTheme]);



  return (
    <>
      {/* 1. Precise Custom cursor following core design specs */}
      <CustomCursor theme={activeTheme} />

      {/* 2. Loading Screen matching 2.5 seconds visual check */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-[150] bg-[#070913] flex flex-col justify-between p-10 font-mono text-zinc-400"
          >
            {/* Top row */}
            <div className="flex items-center justify-between text-[10px] tracking-wider">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></span>
                SYSTEM BOOTSTRAP LOGS
              </span>
              <span>ANKUSHGUPTA_V1.0.0_PRODUCTION</span>
            </div>

            {/* Centered progress indicator */}
            <div className="max-w-md w-full mx-auto space-y-6">
              <div className="space-y-2">
                <div className="flex items-end justify-between text-xs">
                  <span className="font-sans font-bold text-white tracking-widest text-lg uppercase font-display">
                    ANKUSH GUPTA
                  </span>
                  <span className="text-sm font-bold text-orange-500">{loadPercent}%</span>
                </div>
                {/* Horizontal loader with dynamic gradient widths */}
                <div className="w-full h-[3px] bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${loadPercent}%` }}
                    transition={{ duration: 0.1 }}
                    className="h-full bg-orange-500"
                  />
                </div>
              </div>
              <div className="space-y-1 block text-left text-[8px] text-zinc-600 tracking-tight leading-relaxed select-none">
                <div>&gt; [SYSTEM] Initializing high-precision grid layers...</div>
                <div>&gt; [SYSTEM] Mapping origami origami-bird paths...</div>
                <div>&gt; [SYSTEM] Syncing NeoDB PostgreSQL cluster nodes...</div>
                <div>&gt; [SYSTEM] Executing Spring Security auth audits...</div>
              </div>
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between text-[10px] text-zinc-600">
              <span>DESIGN STYLE: SUPERLOCAL URUGUAY</span>
              <span>BOOT_TIME: {currentTime || 'SECURE'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2.5 Scroll Entrance Reveal Transition (Scroll to fly origami birds past camera) */}
      {!loading && <ScrollEntranceReveal theme={activeTheme} />}

      {/* 3. Main Content Portal */}
      <div id="portfolio-content" className={`flex flex-col min-h-screen relative`}>
        {/* Dynamic Canvas Birds Layer in core depth */}
        <FloatingBirds theme={activeTheme} />

        {/* Subtle decorative glow matrices reflecting 3D scroll movement */}
        <div
          style={{ transform: `translateY(${scrollY * 0.45}px)` }}
          className="absolute top-[15%] left-[10%] w-[350px] h-[350px] rounded-full bg-orange-500/5 glow-bubble pointer-events-none"
        />
        <div
          style={{ transform: `translateY(${scrollY * -0.25}px)` }}
          className="absolute bottom-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-zinc-500/5 glow-bubble pointer-events-none"
        />

        {/* Dynamic subtle vertical layout guideline rails (Museum-style design grid) */}
        <div className={`absolute inset-y-0 left-[6%] w-[1px] ${activeTheme.id === 'mono' ? 'bg-zinc-950/10' : 'bg-orange-500/10'} pointer-events-none`} />
        <div className={`absolute inset-y-0 right-[6%] w-[1px] ${activeTheme.id === 'mono' ? 'bg-zinc-950/10' : 'bg-orange-500/10'} pointer-events-none`} />

        {/* Fixed Navigation Bar with theme selector controls */}
        <nav className={`fixed top-0 left-0 w-full z-45 border-b backdrop-blur-md px-[6%] py-4 flex items-center justify-between select-none ${
          activeTheme.id === 'mono' ? 'bg-[#F3F3F3]/80 border-zinc-950/20 text-zinc-950' : 'bg-[#0B0F19]/60 border-zinc-900 text-zinc-100'
        }`}>
          {/* Logo container area */}
          <a
            href="#home"
            className="group flex items-center gap-2.5 text-current font-sans font-bold tracking-tighter text-lg cursor-pointer"
            id="nav-logo"
          >
            <span className={`w-8 h-8 flex items-center justify-center rounded font-mono font-black border transition-transform group-hover:rotate-6 ${
              activeTheme.id === 'mono' 
                ? 'bg-zinc-950 text-white border-zinc-950' 
                : 'bg-zinc-50 text-black border-zinc-800'
            }`}>
              A
            </span>
            <span className={`font-display tracking-wide uppercase font-extrabold text-sm md:text-base leading-none transition-colors ${
              activeTheme.id === 'mono' ? 'text-zinc-950' : 'text-zinc-50'
            }`}>
              ANKUSH.G
            </span>
          </a>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center gap-8 font-mono text-xs font-bold tracking-wider">
            {['home', 'projects', 'skills', 'contact'].map((sect) => (
              <a
                key={sect}
                href={`#${sect}`}
                className={`transition-colors uppercase relative py-1 cursor-pointer ${
                  activeSection === sect 
                    ? 'text-zinc-950 dark:text-white font-extrabold' 
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                }`}
                id={`lnk-${sect}`}
              >
                {sect}
                {activeSection === sect && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 w-full h-[1.5px] bg-current"
                    style={{ color: activeTheme.accentHex }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Floating Theme Selector pill and Audio feed toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => {
                const nextVal = !audioEnabled;
                setAudioEnabled(nextVal);
                if (nextVal) {
                  setTimeout(() => {
                    playSuccess();
                  }, 50);
                }
              }}
              className={`p-2 px-3 rounded-xl border cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTheme.id === 'mono'
                  ? 'border-zinc-950/20 bg-zinc-200/50 text-zinc-950 hover:bg-zinc-200'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900 hover:text-white'
              } ${audioEnabled ? 'ring-1 ring-orange-500/50' : ''}`}
              title={audioEnabled ? "Mute interaction sound feed" : "Enable synthesised user interface sounds"}
              id="audio-feed-switch"
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                  <span className="leading-none font-mono text-[9px] uppercase tracking-wider font-extrabold text-orange-500">
                    SOUND: ON
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 opacity-60" />
                  <span className="leading-none font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                    SOUND: OFF
                  </span>
                </>
              )}
            </button>
            <ThemeSelector activeTheme={activeTheme} setTheme={setActiveTheme} />
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex md:hidden items-center gap-2.5">
            {/* Audio Toggle (Mini version for mobile) */}
            <button
              onClick={() => {
                const nextVal = !audioEnabled;
                setAudioEnabled(nextVal);
                if (nextVal) {
                  setTimeout(() => {
                    playSuccess();
                  }, 50);
                }
              }}
              className={`p-1.5 rounded-lg border cursor-pointer flex items-center justify-center transition-all ${
                activeTheme.id === 'mono'
                  ? 'border-zinc-950/20 bg-zinc-200/50 text-zinc-950'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-300'
              }`}
              title={audioEnabled ? "Mute interactive audio" : "Enable high-precision UI synth"}
              id="mobile-audio-toggle"
            >
              {audioEnabled ? (
                <Volume2 className="w-4 h-4 text-orange-500 animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 opacity-50" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-300 cursor-pointer"
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-x-0 top-[60px] z-49 bg-zinc-950/95 border-b border-zinc-900 shadow-2xl p-6 flex flex-col gap-6 md:hidden font-mono text-sm"
            >
              <div className="flex flex-col gap-4">
                {['home', 'projects', 'skills', 'contact'].map((sect) => (
                  <a
                    key={sect}
                    href={`#${sect}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`uppercase tracking-widest py-2 border-b border-zinc-900/40 ${
                      activeSection === sect ? `font-black ${activeTheme.accentClass}` : 'text-zinc-400'
                    }`}
                  >
                    {sect}
                  </a>
                ))}
              </div>

              {/* Theme selection dropdown/panel for mobile */}
              <div className="pt-4 border-t border-zinc-900">
                <span className="block text-[8px] text-zinc-600 uppercase tracking-widest mb-2">
                  Select Theme Version
                </span>
                <div className="flex justify-center">
                  <ThemeSelector activeTheme={activeTheme} setTheme={setActiveTheme} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Body Containers */}
        <main className="flex-grow pt-24 pb-16 px-[6%] space-y-24 md:space-y-36 pr-[7%] pl-[7%]">
          {/* Section 1: Immersive Hero Area */}
          <section
            id="home"
            className="min-h-[85vh] flex flex-col justify-center relative select-none md:pt-12"
          >
            {/* Real-time system diagnostics status bar */}
            <div className="inline-flex items-center gap-3 bg-zinc-200/40 dark:bg-zinc-900/30 border border-zinc-300/60 dark:border-zinc-900/80 px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-wider text-zinc-600 dark:text-zinc-400 w-fit mb-8 reveal-fade-in self-start shadow-sm">
              <span className={`w-2 h-2 rounded-full bg-green-500 animate-ping`}></span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">SYS_TELEMETRY: ACTIVE_OK</span>
              <span className="text-zinc-350 dark:text-zinc-650">|</span>
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span className="font-semibold text-zinc-650 dark:text-zinc-300">{currentTime || 'UTC'}</span>
            </div>

            <div className="max-w-4xl space-y-6 text-current">
              <span className={`block font-mono text-[10px] md:text-xs uppercase tracking-[0.15em] font-extrabold reveal-fade-in ${activeTheme.accentClass}`}>
                DEVELOPER PORTFOLIO • {PERSONAL_DATA.name.toUpperCase()}
              </span>

              {/* Large, stunning Display heading */}
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-sans font-black tracking-tight leading-[0.85] uppercase font-display select-text">
                <span className={`block mb-2 group-hover:translate-x-1 transition-all duration-300 ${
                  activeTheme.id === 'mono' ? 'text-zinc-950' : 'text-transparent bg-clip-text bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                }`}>
                  FULL STACK
                </span>
                <span className={`block outline-text text-transparent break-words`} style={{ WebkitTextStroke: activeTheme.id === 'mono' ? '2px #09090b' : `2px ${activeTheme.accentHex === '#000000' ? '#ffffff' : activeTheme.accentHex}` }}>
                  DEVELOPER
                </span>
              </h1>

              {/* Sub-text biography */}
              <p className="text-zinc-650 dark:text-zinc-400 max-w-2xl font-sans text-md md:text-lg leading-relaxed font-normal pt-2 select-text">
                {PERSONAL_DATA.bio}
              </p>

              {/* Dynamic Action Buttons with hover scale properties */}
              <div className="flex flex-wrap items-center gap-4 pt-6">
                <a
                  href="#projects"
                  className="px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest border border-transparent shadow-xl transition-all duration-300 fluid-hover-btn active:scale-[0.98] cursor-pointer"
                  style={{ 
                    backgroundColor: activeTheme.accentHex,
                    color: activeTheme.id === 'mono' ? '#ffffff' : '#000000'
                  }}
                  id="cta-projects"
                >
                  VIEW FEAT_SYSTEMS
                </a>
                <ResumeDownloader />
                <a
                  href="#contact"
                  className="px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/60 backdrop-blur-sm transition-all duration-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-700 fluid-hover-btn active:scale-[0.98] cursor-pointer"
                  id="cta-contact"
                >
                  CONNECT DIRECT
                </a>
              </div>
            </div>

            {/* Float icon continuous bob animation (bob down) */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-70 pointer-events-none">
              <span className={`font-mono text-[8px] uppercase tracking-widest font-bold ${activeTheme.accentClass}`}>
                SCROLL STUDY
              </span>
              <ChevronDown className="w-4 h-4 text-zinc-500 animate-bounce" />
            </div>
          </section>

          {/* Section 2: Projects Showcase Catalog */}
          <section id="projects" className="space-y-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-6 scroll-reveal">
              <div className="space-y-2">
                <span className={`block font-mono text-[9px] uppercase tracking-widest font-black ${activeTheme.accentClass}`}>
                  CATALOG / FEATURED_SYSTEMS
                </span>
                <h2 className={`text-3xl md:text-5xl font-sans font-black tracking-tight uppercase font-display ${
                  activeTheme.id === 'mono' ? 'text-zinc-950' : 'text-transparent bg-clip-text bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 drop-shadow-[0_0_12px_rgba(255,255,255,0.12)]'
                }`}>
                  SELECTED CREATIONS
                </h2>
              </div>
            </div>

            {/* Bi-directional Infinite Marquee Logo Wall with Museum framing aspect ratios */}
            <BiProjectMarquee theme={activeTheme} />
          </section>

          {/* Section 3: Diagnostic Skill metrics */}
          <section id="skills" className="space-y-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-6 scroll-reveal">
              <div className="space-y-2">
                <span className={`block font-mono text-[9px] uppercase tracking-widest font-black ${activeTheme.accentClass}`}>
                  CAPABILITY MATRIX / METRICS
                </span>
                <h2 className={`text-3xl md:text-5xl font-sans font-black tracking-tight uppercase font-display ${
                  activeTheme.id === 'mono' ? 'text-zinc-950' : 'text-transparent bg-clip-text bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 drop-shadow-[0_0_12px_rgba(255,255,255,0.12)]'
                }`}>
                  DIAGNOSTIC SKILLSETS
                </h2>
              </div>
            </div>

            {/* Custom interactive Categories panels */}
            <SkillsGrid theme={activeTheme} />
          </section>

          {/* Section 4: Contact secure transmit */}
          <section id="contact" className="space-y-12 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-6 scroll-reveal">
              <div className="space-y-2">
                <span className={`block font-mono text-[9px] uppercase tracking-widest font-black ${activeTheme.accentClass}`}>
                  SECURE TRANSMISSION / TUNNEL
                </span>
                <h2 className={`text-3xl md:text-5xl font-sans font-black tracking-tight uppercase font-display ${
                  activeTheme.id === 'mono' ? 'text-zinc-950' : 'text-transparent bg-clip-text bg-gradient-to-r from-zinc-50 via-zinc-200 to-zinc-400 drop-shadow-[0_0_12px_rgba(255,255,255,0.12)]'
                }`}>
                  COLLABORATE NOW
                </h2>
              </div>
            </div>

            {/* Custom high contrast form integration */}
            <ContactForm theme={activeTheme} personalData={PERSONAL_DATA} />
          </section>
        </main>

        {/* Footer Area with static credits */}
        <footer className="border-t border-zinc-200 dark:border-zinc-900 py-10 px-[6%] text-zinc-500 select-none">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-[10px] tracking-wider uppercase">
            {/* Copyright indicator */}
            <div className="flex items-center gap-1">
              <span>© {new Date().getFullYear()}</span>
              <span className="text-zinc-800 dark:text-zinc-400 font-bold">{PERSONAL_DATA.name.toUpperCase()}</span>
              <span className="text-zinc-600">|</span>
              <span>All rights reserved.</span>
            </div>

            {/* Social media connections with 125% scale bounds */}
            <div className="flex items-center gap-5">
              <a
                href={PERSONAL_DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-125 hover:text-[#000000] dark:hover:text-white transition-all duration-300"
                title="Explore source nodes on Github"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={PERSONAL_DATA.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-125 hover:text-[#000000] dark:hover:text-white transition-all duration-300"
                title="Establish business connection on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${PERSONAL_DATA.email}`}
                className="hover:scale-125 hover:text-[#000000] dark:hover:text-white transition-all duration-300"
                title="Send direct solar mail dispatch"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            {/* Design statement references */}
            <div className="text-zinc-400 dark:text-zinc-600 text-[9px]">
              MODELLED ON SUPERLOCAL • BUILT WITH HANDS
            </div>
          </div>
        </footer>
      </div>


    </>
  );
}
