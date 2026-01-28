import { animated, useSpring } from '@react-spring/web';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { PanelConfig } from '../../types';
import clsx from 'clsx';

interface TabButtonProps {
  config: PanelConfig;
  isActive: boolean;
  onClick: () => void;
}

const accentColors = {
  cyan: {
    hex: '#5ef6ff',
    soft: 'rgba(94, 246, 255, 0.4)',
  },
  violet: {
    hex: '#b883ff',
    soft: 'rgba(184, 131, 255, 0.4)',
  },
  emerald: {
    hex: '#5cffb0',
    soft: 'rgba(92, 255, 176, 0.4)',
  },
  amber: {
    hex: '#ffb547',
    soft: 'rgba(255, 181, 71, 0.4)',
  },
  rose: {
    hex: '#ff5d87',
    soft: 'rgba(255, 93, 135, 0.4)',
  },
};

export function TabButton({ config, isActive, onClick }: TabButtonProps) {
  const { icon: Icon, title, accentColor = 'cyan' } = config;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const spring = useSpring({
    scale: isPressed ? 0.9 : isHovered ? 1.08 : 1,
    config: { tension: 400, friction: 20 },
  });

  const glowSpring = useSpring({
    opacity: isActive ? 1 : isHovered ? 0.6 : 0,
    config: { tension: 300, friction: 20 },
  });

  const colors = accentColors[accentColor];
  const accentStyle = {
    '--accent': colors.hex,
    '--accent-soft': colors.soft,
  } as CSSProperties;

  return (
    <animated.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{ scale: spring.scale, ...accentStyle }}
      title={title}
      data-active={isActive}
      className={clsx(
        'bs-tab',
        'relative w-10 h-10 rounded-lg',
        'flex items-center justify-center',
        'cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50'
      )}
    >
      {/* Icon */}
      <div
        className="relative z-10"
        style={isActive ? { filter: `drop-shadow(0 0 6px ${colors.hex})` } : undefined}
      >
        <Icon
          className={clsx(
            'w-5 h-5 transition-colors duration-150',
            isActive ? 'text-[var(--accent)]' : 'text-slate-400',
            isHovered && !isActive && 'text-slate-200'
          )}
        />
      </div>

      {/* Active glow indicator */}
      <animated.div
        style={{ opacity: glowSpring.opacity, backgroundColor: colors.hex }}
        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full blur-sm"
      />

      {/* Corner accents when active */}
      {isActive && (
        <>
          <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-white/25 rounded-tl" />
          <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-white/25 rounded-tr" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-white/25 rounded-bl" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-white/25 rounded-br" />
        </>
      )}
    </animated.button>
  );
}
