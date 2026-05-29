import React, { useEffect, useState, useRef } from 'react';
import { ThemeConfig } from '../types';

interface CustomCursorProps {
  theme: ThemeConfig;
}

export default function CustomCursor({ theme }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailPosition, setTrailPosition] = useState({ x: 0, y: 0 });
  const [hoverType, setHoverType] = useState<'default' | 'link' | 'project' | 'click' | 'text'>('default');
  const [hoverText, setHoverText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Inspect hovered elements to apply semantic hover classes
      const target = e.target as HTMLElement;
      if (!target) return;

      const isLink = target.closest('a') || target.closest('button') || target.tagName === 'BUTTON' || target.closest('[role="button"]');
      const isProjectCard = target.closest('[data-cursor-project]');
      const isTextEntry = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (isProjectCard) {
        setHoverType('project');
        setHoverText((target.closest('[data-cursor-project]') as HTMLElement).dataset.cursorProject || 'VIEW');
      } else if (isLink) {
        setHoverType('link');
        setHoverText('');
      } else if (isTextEntry) {
        setHoverType('text');
        setHoverText('');
      } else {
        setHoverType('default');
        setHoverText('');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseDown = () => {
      setHoverType('click');
    };

    const handleMouseUp = () => {
      setHoverType('default');
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  // Trail physics animation using requestAnimationFrame
  useEffect(() => {
    const updateTrail = () => {
      setTrailPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        // Outer ring lags behind the dot with a 0.15 easing coefficient
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      requestRef.current = requestAnimationFrame(updateTrail);
    };

    requestRef.current = requestAnimationFrame(updateTrail);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [position]);

  if (!isVisible) return null;

  // Let's determine colors and effects based on themes
  const isMono = theme.id === 'mono';
  
  // Neon contrast colors & drop shadows
  // Under Bold Stark Mono, use '#09090b' (super dark Charcoal) as the primary outline color, and a vibrant stark orange/golden accent for the wheel tracker.
  // Under dark themes, use theme's vivid accentHex or fall back to neon orange.
  const strokeColor = isMono ? '#09090b' : theme.accentHex || '#f97316';
  const trackerColor = isMono ? '#ea580c' : strokeColor; // High-viz amber/orange for the scroll wheel trackers
  
  // High contrast white outline-glow drop shadows + dark directional shadow to ensure visibility over ANY dark/light pixels
  const cursorFilter = isMono
    ? 'drop-shadow(0px -1px 0px #ffffff) drop-shadow(0px 1px 0px #ffffff) drop-shadow(-1px 0px 0px #ffffff) drop-shadow(1px 0px 0px #ffffff) drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.95)) drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.45))'
    : `drop-shadow(0 0 5px ${strokeColor}60) drop-shadow(1px 2px 5px rgba(0, 0, 0, 0.55))`;

  // Render style configurations based on mouse hover state
  const getCursorStyles = () => {
    switch (hoverType) {
      case 'link':
        return {
          ring: `scale-[1.8] border-2 bg-transparent opacity-95`,
          dot: 'scale-[1.3] opacity-100',
        };
      case 'project':
        return {
          ring: `scale-[2.8] border border-solid bg-transparent opacity-100`,
          dot: 'scale-0 opacity-0',
        };
      case 'click':
        return {
          ring: `scale-[0.7] border-3 opacity-100`,
          dot: `scale-95 opacity-100`,
        };
      case 'text':
        return {
          ring: 'scale-x-[0.2] scale-y-[1.2] rounded-sm border-r-2 border-l-2 bg-transparent opacity-85',
          dot: 'scale-0 opacity-0',
        };
      default:
        return {
          ring: `scale-100 border opacity-70`,
          dot: `scale-100 opacity-100`,
        };
    }
  };

  const cursorStyles = getCursorStyles();

  return (
    <>
      {/* 1. Fast, highly rigid center vector mouse cursor graphic (Zero-latency) */}
      <div
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate3d(-50%, -50%, 0)`,
          color: strokeColor,
        }}
        className="fixed top-0 left-0 pointer-events-none z-50 transition-transform duration-75 ease-out select-none flex items-center justify-center"
      >
        <svg
          width="26"
          height="38"
          viewBox="0 0 24 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: cursorFilter }}
          className={`transition-all duration-150 ${
            hoverType === 'click' ? 'scale-90' : hoverType === 'link' ? 'scale-110' : 'scale-100'
          }`}
        >
          {/* Main Mouse Body Capsule (Thickened stroke: 2.6 for high definition) */}
          <rect
            x="2"
            y="2"
            width="20"
            height="32"
            rx="10"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={isMono ? 'rgba(255, 255, 255, 0.75)' : 'rgba(11, 15, 25, 0.45)'}
            className="transition-colors duration-300"
          />

          {/* Left / Right button separator (Thickened stroke: 2.6 for high definition) */}
          <line
            x1="12"
            y1="2"
            x2="12"
            y2="15"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* Buttons baseline boundary (Thickened stroke: 2.6 for high definition) */}
          <line
            x1="2"
            y1="15"
            x2="22"
            y2="15"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />

          {/* Scroll Wheel Tracker (Enhanced active tracking: stroke trackerColor and fill) */}
          <rect
            x="10.2"
            y="5"
            width="3.6"
            height="6.5"
            rx="1.8"
            fill={trackerColor}
            stroke="currentColor"
            strokeWidth="1.6"
            className="transition-all duration-150"
          />
        </svg>
      </div>

      {/* 2. Fluid lag-trail outer cursor tracking ring */}
      <div
        style={{
          transform: `translate3d(${trailPosition.x}px, ${trailPosition.y}px, 0) translate3d(-50%, -50%, 0)`,
          borderColor: isMono ? '#09090b' : strokeColor,
          boxShadow: isMono ? '0 0 10px rgba(0, 0, 0, 0.25), inset 0 0 4px rgba(255,255,255,0.85)' : `0 0 14px ${strokeColor}45`,
        }}
        className={`fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-50 flex items-center justify-center transition-all duration-300 ease-out border ${cursorStyles.ring} backdrop-blur-[0.5px]`}
      >
        {hoverType === 'project' && (
          <span className={`text-[7px] tracking-wide font-black uppercase font-mono select-none text-center ${isMono ? 'text-zinc-950 font-black' : theme.accentClass}`}>
            {hoverText}
          </span>
        )}
      </div>
    </>
  );
}
