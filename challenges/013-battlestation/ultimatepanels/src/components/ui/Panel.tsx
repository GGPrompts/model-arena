import { animated, useSpring } from '@react-spring/web';
import type { ReactNode, CSSProperties } from 'react';
import type { PanelConfig } from '../../types';
import { getClosedTransform, getOpenTransform } from '../../config/springs';
import clsx from 'clsx';

interface PanelProps {
  config: PanelConfig;
  isOpen: boolean;
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  children: ReactNode;
}

const positionStyles = {
  left: 'top-0 left-0 bottom-0 w-[320px] lg:w-[360px] xl:w-[380px]',
  right: 'top-0 right-0 bottom-0 w-[320px] lg:w-[360px] xl:w-[380px]',
  top: 'top-0 left-[320px] right-[320px] h-[50vh] lg:left-[360px] lg:right-[360px] xl:left-[380px] xl:right-[380px]',
  bottom: 'bottom-0 left-[320px] right-[320px] h-[50vh] lg:left-[360px] lg:right-[360px] xl:left-[380px] xl:right-[380px]',
};

const accentStyles = {
  cyan: {
    accent: '#5ef6ff',
    soft: 'rgba(94, 246, 255, 0.35)',
  },
  violet: {
    accent: '#b883ff',
    soft: 'rgba(184, 131, 255, 0.35)',
  },
  emerald: {
    accent: '#5cffb0',
    soft: 'rgba(92, 255, 176, 0.35)',
  },
  amber: {
    accent: '#ffb547',
    soft: 'rgba(255, 181, 71, 0.35)',
  },
  rose: {
    accent: '#ff5d87',
    soft: 'rgba(255, 93, 135, 0.35)',
  },
};

export function Panel({ config, isOpen, zIndex, onClose, onFocus, children }: PanelProps) {
  const { title, icon: Icon, position, accentColor = 'cyan' } = config;

  // Simple panel slide animation
  const panelSpring = useSpring({
    transform: isOpen ? getOpenTransform() : getClosedTransform(position),
    opacity: isOpen ? 1 : 0,
    config: { tension: 400, friction: 30 },
  });

  // Content fade
  const contentSpring = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { tension: 300, friction: 26 },
  });

  const accent = accentStyles[accentColor];
  const accentStyle = {
    '--accent': accent.accent,
    '--accent-soft': accent.soft,
  } as CSSProperties;

  return (
    <animated.div
      style={{
        ...panelSpring,
        zIndex,
        pointerEvents: isOpen ? 'auto' : 'none',
        ...accentStyle,
      }}
      // Use onMouseDown to stop backdrop clicks - fires before onClick
      onMouseDown={(e) => {
        e.stopPropagation();
        onFocus();
      }}
      data-position={position}
      className={clsx(
        'fixed bs-panel',
        positionStyles[position],
        'backdrop-blur-xl',
        'flex flex-col'
      )}
    >
      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Header - Compact cyberpunk design */}
      <header className="bs-panel-header">
        {/* Contained glow effect */}
        <div className="bs-panel-header-glow" />

        {/* Header content */}
        <div className="bs-panel-header-content">
          {/* Icon - compact */}
          <div className="bs-panel-icon">
            <Icon className="w-3.5 h-3.5" />
          </div>

          {/* Title */}
          <h2 className="bs-panel-title">{title}</h2>

          {/* Close button - compact */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onClose}
            className="bs-panel-close"
            title="Close panel (ESC)"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Bottom accent line */}
        <div className="bs-panel-header-line" />
      </header>

      {/* Content */}
      <animated.div style={contentSpring} className="flex-1 overflow-auto p-5">
        {children}
      </animated.div>

      {/* Corner accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-white/10 rounded-tl pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-white/10 rounded-tr pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-white/10 rounded-bl pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-white/10 rounded-br pointer-events-none" />
    </animated.div>
  );
}
