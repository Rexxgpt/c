import React from 'react';
import { ThemeConfig, ThemeType } from '../types';
import { THEMES } from '../data';
import { motion } from 'motion/react';

interface ThemeSelectorProps {
  activeTheme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
}

export default function ThemeSelector({ activeTheme, setTheme }: ThemeSelectorProps) {
  return (
    <div className="flex items-center gap-1.5 bg-zinc-900/40 backdrop-blur-md p-1.2 rounded-full border border-zinc-800">
      {(Object.keys(THEMES) as ThemeType[]).map((key) => {
        const themeOption = THEMES[key];
        const isActive = activeTheme.id === key;

        return (
          <button
            key={key}
            onClick={() => setTheme(themeOption)}
            className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-tight overflow-hidden transition-all duration-300 cursor-pointer ${
              isActive
                ? 'text-black font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
            id={`theme-btn-${key}`}
          >
            {isActive && (
              <motion.div
                layoutId="activeThemeBg"
                className="absolute inset-0 bg-white"
                style={{
                  backgroundColor: themeOption.id === 'mono' ? '#ffffff' : themeOption.accentHex,
                  borderRadius: 9999,
                  zIndex: -1,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 uppercase">{themeOption.name.split(' ')[0]}</span>
          </button>
        );
      })}
    </div>
  );
}
