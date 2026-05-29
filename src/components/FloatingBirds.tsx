import React, { useEffect, useRef, useState } from 'react';
import { Bird, ThemeConfig } from '../types';

interface BirdPalette {
  body: string;
  farWing: string;
  nearWing: string;
  tail: string;
}

interface LocalBird extends Bird {
  palette: BirdPalette;
  finalSize: number;
  noseSize: number;
  tailSize: number;
  bellySize: number;
  backSize: number;
}

interface FloatingBirdsProps {
  theme: ThemeConfig;
}

export default function FloatingBirds({ theme }: FloatingBirdsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const birdsRef = useRef<LocalBird[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const [birdCount, setBirdCount] = useState(24);
  const [windMode, setWindMode] = useState<'calm' | 'gusty' | 'attract'>('calm');

  // Master warm orange-red sunset color palettes for high-fidelity origami shading
  const getBirdPalette = (themeId: string, idx: number): BirdPalette => {
    const isMono = themeId === 'mono';
    if (isMono) {
      const shades = ['#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a'];
      const shadingBase = shades[idx % shades.length];
      return {
        body: shadingBase,
        farWing: '#d4d4d8', 
        nearWing: '#09090b',
        tail: '#e4e4e7',
      };
    } else {
      // Strictly and exclusively based on the user's signature orange: HEX #FF6B00
      // Tonal variations computed strictly to represent origami facet highlights/shadows of #FF6B00
      const palettes = [
        { body: '#FF6B00', farWing: '#FF9447', nearWing: '#C75300', tail: '#FFE6D4' },
        { body: '#FF6B00', farWing: '#FFAE7A', nearWing: '#AB4700', tail: '#FFDBC2' },
        { body: '#FF6B00', farWing: '#FF852E', nearWing: '#E05E00', tail: '#FFF0E6' },
        { body: '#FF6B00', farWing: '#FF9F5C', nearWing: '#BD4F00', tail: '#FFEBE0' },
        { body: '#FF6B00', farWing: '#FFB88F', nearWing: '#9E4200', tail: '#FFD6C2' }
      ];
      return palettes[idx % palettes.length];
    }
  };

  // Initialize birds with cached dimensions and beautiful zero-allocation palettes
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvasRef.current.width = width * dpr;
      canvasRef.current.height = height * dpr;
      canvasRef.current.style.width = `${width}px`;
      canvasRef.current.style.height = `${height}px`;

      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    const initialBirds: LocalBird[] = [];
    const count = 24;

    for (let i = 0; i < count; i++) {
      const depth = 0.4 + Math.random() * 1.6; // depth scaling
      const baseSize = 13 + Math.random() * 13;
      const finalSize = baseSize * (0.5 + depth * 0.5);

      initialBirds.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.9, // distributed near the center and hero sections
        size: baseSize,
        speedX: (1.6 + Math.random() * 1.6) * (0.6 + depth * 0.4), // faster depth moves horizontally
        speedY: (Math.random() - 0.5) * 0.7,
        wingPhase: Math.random() * Math.PI * 2,
        angle: 0,
        color: theme.accentHex,
        depth: depth,
        revealScroll: 0,
        revealProgress: 1, // Full opacity and visible on initial render (no gating delay)
        hasTriggeredRipple: false,
        palette: getBirdPalette(theme.id, i),
        finalSize,
        noseSize: finalSize * 0.6,
        tailSize: -finalSize * 0.5,
        bellySize: finalSize * 0.1,
        backSize: -finalSize * 0.1,
      });
    }

    birdsRef.current = initialBirds;
    setBirdCount(initialBirds.length);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sync color changes with the active theme instantly without runtime conversions
  useEffect(() => {
    birdsRef.current.forEach((bird, idx) => {
      bird.palette = getBirdPalette(theme.id, idx);
      bird.color = bird.palette.body;
    });
  }, [theme]);

  // Track cursor hover in logical coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Interactive local waves
  const ripplesRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; opacity: number }[]>([]);

  const createRipple = (x: number, y: number) => {
    ripplesRef.current.push({
      x,
      y,
      radius: 0,
      maxRadius: 120,
      opacity: 0.7,
    });
  };

  // Spawn new birds on backdrops with zero delay
  useEffect(() => {
    const handleWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') || 
        target.closest('a') || 
        target.closest('input') || 
        target.closest('textarea') || 
        target.closest('form') ||
        target.closest('.pointer-events-auto') ||
        target.closest('nav')
      ) {
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const clickX = e.clientX;
      const clickY = e.clientY;
      const scale = 0.5 + Math.random() * 1.5;
      const baseSize = 13 + Math.random() * 13;
      const finalSize = baseSize * (0.5 + scale * 0.5);

      const newBird: LocalBird = {
        id: Date.now() + Math.random(),
        x: clickX,
        y: clickY,
        size: baseSize,
        speedX: (2.2 + Math.random() * 1.4) * (0.6 + scale * 0.4),
        speedY: (Math.random() - 0.5) * 1.6,
        wingPhase: Math.random() * Math.PI * 2,
        angle: 0,
        color: theme.accentHex,
        depth: scale,
        revealScroll: 0,
        revealProgress: 1, // always instantly visible
        hasTriggeredRipple: true,
        palette: getBirdPalette(theme.id, birdsRef.current.length),
        finalSize,
        noseSize: finalSize * 0.6,
        tailSize: -finalSize * 0.5,
        bellySize: finalSize * 0.1,
        backSize: -finalSize * 0.1,
      };

      birdsRef.current = [...birdsRef.current, newBird];
      setBirdCount(birdsRef.current.length);
      createRipple(clickX, clickY);
    };

    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, [theme]);

  // Main high-performance render loop with hardware acceleration and zero garbage collection pressure
  useEffect(() => {
    let animationId: number;
    let smoothScrollY = window.scrollY;
    let lastTime = performance.now();

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const logicalWidth = canvas.width / dpr;
      const logicalHeight = canvas.height / dpr;

      // Clean canvas clear
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      // Frame rate independent delta tracking
      const now = performance.now();
      let dt = (now - lastTime) / 16.667;
      if (dt > 4) dt = 4; // cap delta to prevent temporal teleportation during hiccups
      lastTime = now;

      // Smooth scroll lerp
      smoothScrollY += (window.scrollY - smoothScrollY) * 0.12 * dt;

      // 1. High-Performance Batched Grid Background (runs in sub-millisecond)
      const gridSize = 80;
      ctx.strokeStyle = theme.gridColor;
      ctx.lineWidth = 0.5;

      const time = now * 0.00015;
      const gridShiftX = Math.sin(time) * 8;
      const gridShiftY = (Math.cos(time) * 8 - smoothScrollY) % gridSize;

      ctx.beginPath();
      for (let x = gridShiftX; x < logicalWidth; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, logicalHeight);
      }
      for (let y = gridShiftY; y < logicalHeight; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(logicalWidth, y);
      }
      ctx.stroke();

      // 2. Compute and draw ripple ring expanders
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += 2.8 * dt;
        ripple.opacity -= 0.018 * dt;

        if (ripple.opacity <= 0 || ripple.radius >= ripple.maxRadius) {
          return false;
        }

        // Fast canvas hex alpha injection
        const alphaHex = Math.max(0, Math.min(255, Math.floor(ripple.opacity * 255)))
          .toString(16)
          .padStart(2, '0');
        
        ctx.strokeStyle = `${theme.accentHex}${alphaHex}`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();

        return true;
      });

      // 3. Update and render bird flock kinematics
      const birds = birdsRef.current;
      const mouse = mouseRef.current;

      birds.forEach((bird) => {
        const bDepth = bird.depth !== undefined ? bird.depth : 1.0;

        // Kinematic flight integration
        bird.x += bird.speedX * dt;
        bird.y += bird.speedY * dt;

        const wingExtent = Math.sin(bird.wingPhase);
        bird.wingPhase += (0.13 + Math.abs(bird.speedY) * 0.035 + (bird.speedX * 0.012)) * dt;

        // Coordinate calculations with deep parallax layer values
        const finalX = bird.x;
        const scrollParallax = smoothScrollY * (bDepth - 0.4) * 0.14;
        const finalY = bird.y - scrollParallax;

        // Radial interactive cursor avoidance system
        if (mouse.active) {
          const dx = finalX - mouse.x;
          const dy = finalY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const triggerRadius = 180;
          if (dist < triggerRadius) {
            const force = (triggerRadius - dist) / triggerRadius; // 1 at cursor, 0 at border

            if (windMode === 'attract') {
              bird.speedX += (dx < 0 ? 0.09 : -0.09) * force * dt;
              bird.speedY += (dy < 0 ? 0.09 : -0.09) * force * dt;
            } else {
              const factor = windMode === 'gusty' ? 0.38 : 0.2;
              bird.speedX += (dx > 0 ? factor : -factor) * force * bDepth * dt;
              bird.speedY += (dy > 0 ? factor : -factor) * force * bDepth * dt;
              bird.wingPhase += 0.24 * force * dt;
            }
          }
        }

        // Airborne levitational balance
        bird.speedY += Math.sin(bird.wingPhase) * 0.02 * dt;

        // Kinematic speed caps to prevent hyper-accelerations
        const maxSpeed = 4.2 * (0.6 + bDepth * 0.4);
        const speed = Math.sqrt(bird.speedX * bird.speedX + bird.speedY * bird.speedY);
        if (speed > maxSpeed) {
          bird.speedX = (bird.speedX / speed) * maxSpeed;
          bird.speedY = (bird.speedY / speed) * maxSpeed;
        }

        // Base aerodynamic stabilization values
        const baseSpeedX = 2.1 * (0.6 + bDepth * 0.4);
        bird.speedX += (baseSpeedX - bird.speedX) * 0.015 * dt;

        // Seamless, glitch-free wraparound thresholds
        if (finalX > logicalWidth + 60) {
          bird.x = -50;
          bird.y = Math.random() * logicalHeight * 0.9 + scrollParallax;
          bird.speedX = (1.6 + Math.random() * 1.6) * (0.6 + bDepth * 0.4);
          bird.speedY = (Math.random() - 0.5) * 0.8;
          // Note: NOT resetting revealProgress here - this makes wraps completely seamless!
        } else if (finalX < -70) {
          bird.x = logicalWidth + 40;
          bird.y = Math.random() * logicalHeight * 0.9 + scrollParallax;
        }

        if (finalY > logicalHeight + 60) {
          bird.y = -50 + scrollParallax;
          bird.speedY = Math.random() * 0.6;
        } else if (finalY < -60) {
          bird.y = logicalHeight + 50 + scrollParallax;
          bird.speedY = -Math.random() * 0.6;
        }

        // Heading angle vectoring
        bird.angle = Math.atan2(bird.speedY, bird.speedX);

        // Advanced smooth alpha edge-fading (pre-fades birds smoothly at standard margins)
        const fadePadding = 80;
        let boundaryAlpha = 1.0;
        if (finalX < fadePadding) {
          boundaryAlpha = Math.max(0, finalX / fadePadding);
        } else if (finalX > logicalWidth - fadePadding) {
          boundaryAlpha = Math.max(0, (logicalWidth - finalX) / fadePadding);
        }
        if (finalY < fadePadding) {
          boundaryAlpha = Math.min(boundaryAlpha, Math.max(0, finalY / fadePadding));
        } else if (finalY > logicalHeight - fadePadding) {
          boundaryAlpha = Math.min(boundaryAlpha, Math.max(0, (logicalHeight - finalY) / fadePadding));
        }

        const bAlpha = (0.22 + (bDepth * 0.58)) * boundaryAlpha;
        if (bAlpha <= 0.01) return; // skip draws if invisible

        ctx.save();
        ctx.translate(finalX, finalY);
        ctx.rotate(bird.angle);
        ctx.globalAlpha = bAlpha;

        // Draw Origami Shape Parts with static pre-computed dimensions
        const size = bird.finalSize;
        const nose = bird.noseSize;
        const tail = bird.tailSize;
        const belly = bird.bellySize;
        const back = bird.backSize;

        // Nose Beak Folds
        ctx.fillStyle = bird.palette.body;
        ctx.strokeStyle = bird.palette.nearWing;
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.moveTo(nose, 0);
        ctx.lineTo(back, -size * 0.15);
        ctx.lineTo(belly, size * 0.15);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Far Wings segment
        ctx.fillStyle = bird.palette.farWing;
        ctx.beginPath();
        ctx.moveTo(back, -size * 0.1);
        ctx.lineTo(-size * 0.2, -size * (0.65 + wingExtent * 0.42));
        ctx.lineTo(back - size * 0.25, -size * 0.05);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Near Wings segment
        ctx.fillStyle = bird.palette.nearWing;
        ctx.beginPath();
        ctx.moveTo(belly, size * 0.1);
        ctx.lineTo(-size * 0.1, size * (0.7 + wingExtent * 0.46));
        ctx.lineTo(back - size * 0.15, size * 0.05);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Origami Tails segment
        ctx.fillStyle = bird.palette.tail;
        ctx.beginPath();
        ctx.moveTo(back, -size * 0.1);
        ctx.lineTo(tail, -size * 0.12);
        ctx.lineTo(back, size * 0.1);
        ctx.lineTo(tail, size * 0.12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      });

      // 4. Draw mouse kinetic aura in logical coordinates (zero-allocation)
      if (mouse.active) {
        ctx.fillStyle = theme.id === 'mono' ? 'rgba(0,0,0,0.02)' : 'rgba(255, 107, 0, 0.03)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [theme, windMode]);

  // Scatter/interaction kinetic wind triggers
  const triggerGust = () => {
    setWindMode('gusty');
    birdsRef.current.forEach(bird => {
      const bDepth = bird.depth !== undefined ? bird.depth : 1.0;
      bird.speedX += (3.5 + Math.random() * 2.5) * bDepth;
      bird.speedY += (Math.random() - 0.5) * 6.0;
    });

    setTimeout(() => {
      setWindMode('calm');
    }, 1200);
  };

  const attractAll = () => {
    setWindMode(prev => prev === 'attract' ? 'calm' : 'attract');
  };

  return (
    <div className="fixed inset-0 select-none overflow-hidden pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none transform-gpu"
        style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        title="Optimized background bird engine"
      />
      {/* Floating interactive physics dashboard console */}
      <div className={`hidden absolute bottom-6 left-6 pointer-events-auto flex flex-wrap items-center gap-3 border rounded-xl p-2 px-3 text-xs font-mono shadow-xl transition-all ${
        theme.id === 'mono'
          ? 'bg-white/90 border-zinc-950 text-zinc-950 hover:bg-white'
          : 'bg-[#0B0F19]/60 backdrop-blur-md border-zinc-800 text-zinc-400 hover:border-zinc-700'
      }`}>
        <div className="flex items-center gap-1.5 mr-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-bold">BIRD ENGINE</span>
          <span className={`px-1.5 py-0.5 border text-[10px] rounded font-black ${
            theme.id === 'mono' ? 'bg-zinc-150 border-zinc-300' : 'bg-zinc-900 border-zinc-800 text-zinc-300'
          }`}>{birdCount} FLOCK</span>
        </div>
        <button
          onClick={triggerGust}
          className={`px-2 py-1 text-[11px] font-bold rounded cursor-pointer select-none transition-all active:scale-95 border ${
            theme.id === 'mono'
              ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-950'
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
          }`}
          title="Unleash a gust of wind to scatter birds"
        >
          💨 SCATTER GUST
        </button>
        <button
          onClick={attractAll}
          className={`px-2 py-1 text-[11px] border transition-all cursor-pointer select-none active:scale-95 rounded font-bold ${
            windMode === 'attract'
              ? 'bg-orange-600/20 border-orange-500 text-orange-400'
              : (theme.id === 'mono'
                  ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-950'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300')
          }`}
          title="Birds gather toward your cursor location"
        >
          🧲 {windMode === 'attract' ? 'SOLO ATTRACT: ON' : 'ATTRACT MODE'}
        </button>
      </div>
    </div>
  );
}
