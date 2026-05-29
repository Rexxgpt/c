import React, { useEffect, useRef } from 'react';
import { ThemeConfig } from '../types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';

// Register the GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ScrollEntranceRevealProps {
  theme: ThemeConfig;
}

export default function ScrollEntranceReveal({ theme }: ScrollEntranceRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const centerLogoRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // References for bird elements to zoom/fly outwards
  const bird1Ref = useRef<SVGSVGElement>(null);
  const bird2Ref = useRef<SVGSVGElement>(null);
  const bird3Ref = useRef<SVGSVGElement>(null);
  const bird4Ref = useRef<SVGSVGElement>(null);
  const bird5Ref = useRef<SVGSVGElement>(null);
  const bird6Ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const overlay = containerRef.current;
    if (!trigger || !overlay) return;

    // Set initial styles for portfolio container through GSAP
    gsap.set('#portfolio-content', {
      opacity: 0,
      paddingTop: '0px',
    });
    gsap.set('#portfolio-content main', {
      scale: 0.94,
      transformOrigin: 'center 30%',
    });

    // Main scroll timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-entrance-trigger',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,    // Butter-smooth swift mapping
        pin: '#portfolio-content',
        pinSpacing: false,
        invalidateOnRefresh: true,
      },
    });

    // Animate paddingTop of #portfolio-content to match the scroll offset,
    // ensuring the main content aligns perfectly to the viewport top when unpinned.
    tl.to(
      '#portfolio-content',
      {
        paddingTop: '450px',
        ease: 'none',
      },
      0
    );

    // 1. Zoom/Animate birds outwards & scale up (fly towards camera)
    tl.to(
      bird1Ref.current,
      {
        x: '-100vw',
        y: '-100vh',
        scale: 12,
        opacity: 0,
        rotate: -45,
        ease: 'power1.inOut',
      },
      0
    )
      .to(
        bird2Ref.current,
        {
          x: '100vw',
          y: '-100vh',
          scale: 10,
          opacity: 0,
          rotate: 45,
          ease: 'power1.inOut',
        },
        0
      )
      .to(
        bird3Ref.current,
        {
          x: '-110vw',
          y: '100vh',
          scale: 14,
          opacity: 0,
          rotate: -60,
          ease: 'power1.inOut',
        },
        0
      )
      .to(
        bird4Ref.current,
        {
          x: '110vw',
          y: '100vh',
          scale: 11,
          opacity: 0,
          rotate: 60,
          ease: 'power1.inOut',
        },
        0
      )
      .to(
        bird5Ref.current,
        {
          x: 0,
          y: '-25vh',
          scale: 22, // flies straight past the reader's lens!
          opacity: 0,
          rotate: 15,
          ease: 'power2.in',
        },
        0
      )
      .to(
        bird6Ref.current,
        {
          x: '40vw',
          y: '-30vh',
          scale: 15,
          opacity: 0,
          rotate: -30,
          ease: 'power1.inOut',
        },
        0
      );

    // 2. Dissolve overlay typographic elements
    tl.to(
      centerLogoRef.current,
      {
        scale: 0.85,
        opacity: 0,
        letterSpacing: '0.4em',
        ease: 'power1.out',
      },
      0
    ).to(
      promptRef.current,
      {
        y: 40,
        opacity: 0,
        ease: 'power1.out',
      },
      0
    );

    // 3. Dissolve overlay background and parting elements
    tl.to(
      overlay,
      {
        opacity: 0,
        backdropFilter: 'blur(0px)',
        pointerEvents: 'none',
        ease: 'power2.inOut',
      },
      0.2
    );

    // 4. Transform portfolio content into 100% focus dimensions
    tl.to(
      '#portfolio-content',
      {
        opacity: 1,
        ease: 'power2.out',
      },
      0.15
    ).to(
      '#portfolio-content main',
      {
        scale: 1,
        ease: 'power2.out',
      },
      0.15
    );

    // Cleanup references on component unmount
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <>
      {/* Scroll trigger container mapping the height scroll bounds */}
      <div
        ref={triggerRef}
        id="scroll-entrance-trigger"
        className="absolute top-0 left-0 w-full h-[450px] pointer-events-none z-0"
      />

      {/* Persistent full-screen fixed reveal canvas overlay overlaying main portfolio */}
      <div
        ref={containerRef}
        id="scroll-entrance-overlay"
        className={`fixed inset-0 z-50 flex flex-col justify-between p-10 md:p-14 overflow-hidden select-none pointer-events-auto transition-colors duration-500 ${
          theme.id === 'mono' ? 'bg-zinc-100 text-zinc-950' : 'bg-[#070913] text-zinc-100'
        }`}
      >
        {/* Subtle geometric digital grids backing the overlay */}
        <div
          ref={gridRef}
          className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:30px_30px]"
        />

        {/* Brand system metadata */}
        <div className="relative z-10 flex items-center justify-between font-mono text-[9px] tracking-widest text-zinc-550 uppercase">
          <span>PORTAL SECURE TUNNEL</span>
          <span>SYSTEM VERIFICATION: ACTIVE</span>
        </div>

        {/* Centered branding logo assembly */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div ref={centerLogoRef} className="space-y-2">
            <span className="block font-mono text-[10px] md:text-xs text-zinc-500 tracking-[0.2em] uppercase font-bold">
              PORTFOLIO ENTRYWAY
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-sans font-black tracking-tighter uppercase font-display select-text">
              ANKUSH GUPTA
            </h1>
            <p className="max-w-md mx-auto text-zinc-500 dark:text-zinc-450 font-mono text-[10px] md:text-xs leading-relaxed tracking-tight py-2">
              BCA GRADUATE & FULL-STACK SYSTEMS DEVELOPER. CRAFTING METICULOUS DEEP INTERACTIVE DESIGN MECHANICS.
            </p>
          </div>
        </div>

        {/* STYLIZED ORIGAMI VECTOR BIRD LAYERS (FLY ALONG PARAMETRICS ON SCROLL) */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Bird 1: Top-left focus */}
          <svg
            ref={bird1Ref}
            viewBox="0 0 100 100"
            className="absolute top-[25%] left-[15%] w-14 h-14 md:w-20 md:h-20 fill-current opacity-85 rotate-[-25deg]"
            style={{ color: theme.accentHex, transformOrigin: 'center' }}
          >
            {/* Beak & Head */}
            <polygon points="50,20 53,10 47,10" className="opacity-95" />
            {/* Chest */}
            <polygon points="50,20 30,55 50,45" className="opacity-80" />
            <polygon points="50,20 70,55 50,45" className="opacity-90" />
            {/* Wings */}
            <polygon points="30,55 5,30 50,45" className="opacity-65" />
            <polygon points="70,55 95,30 50,45" className="opacity-75" />
            {/* Origami Tail */}
            <polygon points="50,45 50,80 43,65" className="opacity-50" />
          </svg>

          {/* Bird 2: Top-right focus */}
          <svg
            ref={bird2Ref}
            viewBox="0 0 100 100"
            className="absolute top-[20%] right-[20%] w-16 h-16 md:w-24 md:h-24 fill-current opacity-80 rotate-[35deg]"
            style={{ color: theme.accentHex, transformOrigin: 'center' }}
          >
            <polygon points="50,20 54,8 46,12" className="opacity-95" />
            <polygon points="50,20 32,58 50,48" className="opacity-80" />
            <polygon points="50,20 68,58 50,48" className="opacity-90" />
            <polygon points="32,58 8,36 50,48" className="opacity-60" />
            <polygon points="68,58 92,36 50,48" className="opacity-75" />
            <polygon points="50,48 50,78 45,64" className="opacity-45" />
          </svg>

          {/* Bird 3: Bottom-left focus */}
          <svg
            ref={bird3Ref}
            viewBox="0 0 100 100"
            className="absolute bottom-[20%] left-[20%] w-20 h-20 md:w-28 md:h-28 fill-current opacity-75 rotate-[-45deg]"
            style={{ color: theme.accentHex, transformOrigin: 'center' }}
          >
            <polygon points="50,15 52,5 48,5" className="opacity-95" />
            <polygon points="50,15 28,50 50,40" className="opacity-85" />
            <polygon points="50,15 72,50 50,40" className="opacity-90" />
            <polygon points="28,50 0,25 50,40" className="opacity-60" />
            <polygon points="72,50 100,25 50,40" className="opacity-75" />
            <polygon points="50,40 50,85 40,70" className="opacity-50" />
          </svg>

          {/* Bird 4: Bottom-right focus */}
          <svg
            ref={bird4Ref}
            viewBox="0 0 100 100"
            className="absolute bottom-[25%] right-[15%] w-15 h-15 md:w-22 md:h-22 fill-current opacity-80 rotate-[50deg]"
            style={{ color: theme.accentHex, transformOrigin: 'center' }}
          >
            <polygon points="50,22 53,12 47,12" className="opacity-95" />
            <polygon points="50,22 34,55 50,45" className="opacity-80" />
            <polygon points="50,22 66,55 50,45" className="opacity-90" />
            <polygon points="34,55 12,32 50,45" className="opacity-65" />
            <polygon points="66,55 88,32 50,45" className="opacity-70" />
            <polygon points="50,45 50,75 42,62" className="opacity-50" />
          </svg>

          {/* Bird 5: Centered massive bird warping towards screen */}
          <svg
            ref={bird5Ref}
            viewBox="0 0 100 100"
            className="absolute top-[42%] left-[45%] w-12 h-12 md:w-16 md:h-16 fill-current opacity-90 rotate-[-10deg]"
            style={{ color: theme.accentHex, transformOrigin: 'center' }}
          >
            <polygon points="50,20 52,10 48,10" className="opacity-95" />
            <polygon points="50,20 30,55 50,45" className="opacity-80" />
            <polygon points="50,20 70,55 50,45" className="opacity-90" />
            <polygon points="30,55 5,30 50,45" className="opacity-60" />
            <polygon points="70,55 95,30 50,45" className="opacity-75" />
            <polygon points="50,45 50,80 43,65" className="opacity-55" />
          </svg>

          {/* Bird 6: Upper-middle offset winging right */}
          <svg
            ref={bird6Ref}
            viewBox="0 0 100 100"
            className="absolute top-[35%] right-[35%] w-10 h-10 md:w-14 md:h-14 fill-current opacity-85 rotate-[15deg]"
            style={{ color: theme.accentHex, transformOrigin: 'center' }}
          >
            <polygon points="50,18 52,8 48,8" className="opacity-95" />
            <polygon points="50,18 32,52 50,42" className="opacity-80" />
            <polygon points="50,18 68,52 50,42" className="opacity-90" />
            <polygon points="32,52 8,28 50,42" className="opacity-65" />
            <polygon points="68,52 92,28 50,42" className="opacity-75" />
            <polygon points="50,42 50,76 44,63" className="opacity-50" />
          </svg>
        </div>

        {/* Dynamic down-scroll instruction drawer */}
        <div ref={promptRef} className="relative z-10 flex flex-col items-center gap-2">
          <ArrowDown className="w-5 h-5 animate-bounce text-zinc-400" />
          <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-500">
            SCROLL DOWN TO INITIATE REVEAL & FLY
          </span>
        </div>
      </div>
    </>
  );
}
