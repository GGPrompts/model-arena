# Battlestation Dashboard - React Spring Animation Design

## Overview

This document provides concrete React Spring animation patterns for a full-screen dashboard with:
- Glass-looking icon tabs around page edges
- Full-page panels sliding from 4 directions
- Satisfying physics-based spring animations
- Gesture-based interactions

---

## 1. React Spring Hooks Selection

### Primary Hooks

| Hook | Use Case |
|------|----------|
| `useSpring` | Tab icon animations (glow, press, scale) |
| `useTransition` | Panel mount/unmount animations |
| `useChain` | Sequencing panel slide + content fade |
| `useSpringRef` | Controlling animation sequence timing |

### Why These Choices

- **`useSpring`** - Best for continuous state-driven animations (hover, active states)
- **`useTransition`** - Handles DOM mounting/unmounting lifecycle (panels appearing/disappearing)
- **`useChain`** - Orchestrates multiple animations in sequence (panel slides, then content fades)
- **`useDrag` from @use-gesture** - Physics-based drag-to-dismiss

---

## 2. Spring Configurations

### The "Snap" Feel

The key to satisfying snap animations is **high tension + moderate friction + low mass**.

```typescript
// /src/config/springConfigs.ts

export const springConfigs = {
  // Snappy panel slide - main panels
  snap: {
    tension: 400,
    friction: 30,
    mass: 1,
    clamp: false,
  },

  // Extra snappy for small movements
  snappier: {
    tension: 500,
    friction: 28,
    mass: 0.8,
  },

  // Gentle settle for content fade-in
  gentle: {
    tension: 200,
    friction: 26,
    mass: 1,
  },

  // Bouncy for tab press feedback
  bouncy: {
    tension: 300,
    friction: 10,
    mass: 0.5,
  },

  // Stiff for hover states (fast response)
  stiff: {
    tension: 600,
    friction: 40,
    mass: 1,
  },

  // Wobbly for playful feedback
  wobbly: {
    tension: 180,
    friction: 12,
    mass: 1,
  },

  // Drag release - overshoots then settles
  dragRelease: {
    tension: 350,
    friction: 25,
    mass: 1,
    velocity: 0,
  },
} as const;

// Presets for common scenarios
export const panelConfig = springConfigs.snap;
export const tabConfig = springConfigs.stiff;
export const contentConfig = springConfigs.gentle;
```

### Config Breakdown

| Config | Tension | Friction | Feel |
|--------|---------|----------|------|
| snap | 400 | 30 | Quick settle, minimal overshoot |
| bouncy | 300 | 10 | Playful bounce, lots of overshoot |
| stiff | 600 | 40 | Immediate response, no wobble |
| gentle | 200 | 26 | Smooth, gradual settle |

---

## 3. Panel Slide Animations (4 Directions)

### Direction-Based Transform Values

```typescript
// /src/hooks/usePanelAnimation.ts

import { useTransition, config } from '@react-spring/web';
import { springConfigs } from '../config/springConfigs';

type PanelDirection = 'left' | 'right' | 'top' | 'bottom';

interface PanelState {
  id: string;
  direction: PanelDirection;
  isOpen: boolean;
}

// Transform values for each direction
const directionTransforms = {
  left: {
    from: 'translate3d(-100%, 0, 0)',
    enter: 'translate3d(0%, 0, 0)',
    leave: 'translate3d(-100%, 0, 0)',
  },
  right: {
    from: 'translate3d(100%, 0, 0)',
    enter: 'translate3d(0%, 0, 0)',
    leave: 'translate3d(100%, 0, 0)',
  },
  top: {
    from: 'translate3d(0, -100%, 0)',
    enter: 'translate3d(0, 0%, 0)',
    leave: 'translate3d(0, -100%, 0)',
  },
  bottom: {
    from: 'translate3d(0, 100%, 0)',
    enter: 'translate3d(0, 0%, 0)',
    leave: 'translate3d(0, 100%, 0)',
  },
};

export function usePanelTransition(
  activePanel: PanelState | null,
  direction: PanelDirection
) {
  const transforms = directionTransforms[direction];

  const transitions = useTransition(activePanel, {
    keys: (panel) => panel?.id ?? 'none',
    from: {
      transform: transforms.from,
      opacity: 0,
    },
    enter: {
      transform: transforms.enter,
      opacity: 1,
    },
    leave: {
      transform: transforms.leave,
      opacity: 0,
    },
    config: springConfigs.snap,
    // Ensures old panel leaves before new enters
    exitBeforeEnter: false,
  });

  return transitions;
}
```

### Panel Component Implementation

```tsx
// /src/components/Panel.tsx

import { animated, useSpring, useSpringRef, useChain } from '@react-spring/web';
import { springConfigs } from '../config/springConfigs';

interface PanelProps {
  direction: 'left' | 'right' | 'top' | 'bottom';
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const directionStyles = {
  left: { left: 0, top: 0, bottom: 0, width: '100%' },
  right: { right: 0, top: 0, bottom: 0, width: '100%' },
  top: { top: 0, left: 0, right: 0, height: '100%' },
  bottom: { bottom: 0, left: 0, right: 0, height: '100%' },
};

const getTransform = (direction: string, progress: number) => {
  switch (direction) {
    case 'left': return `translate3d(${-100 + progress * 100}%, 0, 0)`;
    case 'right': return `translate3d(${100 - progress * 100}%, 0, 0)`;
    case 'top': return `translate3d(0, ${-100 + progress * 100}%, 0)`;
    case 'bottom': return `translate3d(0, ${100 - progress * 100}%, 0)`;
    default: return 'translate3d(0, 0, 0)';
  }
};

export function Panel({ direction, isOpen, onClose, children }: PanelProps) {
  // Panel slide animation
  const panelRef = useSpringRef();
  const panelSpring = useSpring({
    ref: panelRef,
    progress: isOpen ? 1 : 0,
    config: springConfigs.snap,
  });

  // Content fade animation (chained after panel)
  const contentRef = useSpringRef();
  const contentSpring = useSpring({
    ref: contentRef,
    opacity: isOpen ? 1 : 0,
    y: isOpen ? 0 : 20,
    config: springConfigs.gentle,
  });

  // Chain: panel slides first, content fades 100ms later
  useChain(
    isOpen ? [panelRef, contentRef] : [contentRef, panelRef],
    isOpen ? [0, 0.15] : [0, 0.1]
  );

  return (
    <animated.div
      className="fixed z-50 bg-gray-900/95 backdrop-blur-xl"
      style={{
        ...directionStyles[direction],
        transform: panelSpring.progress.to(p => getTransform(direction, p)),
      }}
    >
      {/* Glass effect border */}
      <div className="absolute inset-0 border border-white/10 pointer-events-none" />

      {/* Animated content */}
      <animated.div
        className="h-full overflow-auto p-8"
        style={{
          opacity: contentSpring.opacity,
          transform: contentSpring.y.to(y => `translateY(${y}px)`),
        }}
      >
        {children}
      </animated.div>
    </animated.div>
  );
}
```

---

## 4. Tab Icon Animations

### Tab States

1. **Idle** - Subtle glow
2. **Hover** - Enhanced glow + slight scale
3. **Press** - Scale down + brightness
4. **Active** - Persistent glow + rotation indicator

```tsx
// /src/components/TabIcon.tsx

import { animated, useSpring } from '@react-spring/web';
import { useState } from 'react';
import { springConfigs } from '../config/springConfigs';

interface TabIconProps {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  position: 'left' | 'right' | 'top' | 'bottom';
}

export function TabIcon({ icon, isActive, onClick, position }: TabIconProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Combined spring for all visual states
  const spring = useSpring({
    scale: isPressed ? 0.85 : isHovered ? 1.1 : 1,
    glowOpacity: isActive ? 0.8 : isHovered ? 0.5 : 0.2,
    glowScale: isActive ? 1.5 : isHovered ? 1.3 : 1,
    brightness: isPressed ? 1.2 : 1,
    rotation: isActive ? getActiveRotation(position) : 0,
    config: (key) => {
      if (key === 'scale') return springConfigs.bouncy;
      if (key === 'glowOpacity' || key === 'glowScale') return springConfigs.stiff;
      return springConfigs.snap;
    },
  });

  return (
    <animated.button
      className="relative p-3 rounded-xl backdrop-blur-md
                 bg-white/5 border border-white/10
                 cursor-pointer select-none"
      style={{
        transform: spring.scale.to(s => spring.rotation.to(r =>
          `scale(${s}) rotate(${r}deg)`
        )),
        filter: spring.brightness.to(b => `brightness(${b})`),
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {/* Glow effect */}
      <animated.div
        className="absolute inset-0 rounded-xl bg-cyan-400 blur-xl -z-10"
        style={{
          opacity: spring.glowOpacity,
          transform: spring.glowScale.to(s => `scale(${s})`),
        }}
      />

      {/* Icon */}
      <div className="relative z-10 text-white/90">
        {icon}
      </div>

      {/* Active indicator line */}
      <animated.div
        className={`absolute ${getIndicatorPosition(position)}
                    bg-cyan-400 rounded-full`}
        style={{
          opacity: spring.glowOpacity,
          transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
        }}
      />
    </animated.button>
  );
}

function getActiveRotation(position: string): number {
  // Subtle rotation toward panel direction
  switch (position) {
    case 'left': return -5;
    case 'right': return 5;
    case 'top': return 0;
    case 'bottom': return 0;
    default: return 0;
  }
}

function getIndicatorPosition(position: string): string {
  switch (position) {
    case 'left': return 'right-0 top-1/4 bottom-1/4 w-0.5';
    case 'right': return 'left-0 top-1/4 bottom-1/4 w-0.5';
    case 'top': return 'bottom-0 left-1/4 right-1/4 h-0.5';
    case 'bottom': return 'top-0 left-1/4 right-1/4 h-0.5';
    default: return '';
  }
}
```

### Glow Pulse Animation (Idle State)

```tsx
// /src/components/GlowPulse.tsx

import { animated, useSpring } from '@react-spring/web';
import { useEffect, useState } from 'react';

export function GlowPulse({ color = 'cyan' }: { color?: string }) {
  const [pulse, setPulse] = useState(false);

  // Continuous pulse loop
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const spring = useSpring({
    opacity: pulse ? 0.4 : 0.2,
    scale: pulse ? 1.2 : 1,
    config: {
      tension: 50,
      friction: 20,
      mass: 1,
    },
  });

  return (
    <animated.div
      className={`absolute inset-0 rounded-xl bg-${color}-400 blur-lg -z-10`}
      style={{
        opacity: spring.opacity,
        transform: spring.scale.to(s => `scale(${s})`),
      }}
    />
  );
}
```

---

## 5. Gesture Handling (Drag-to-Close)

### useDrag Integration

```tsx
// /src/hooks/usePanelGesture.ts

import { useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { springConfigs } from '../config/springConfigs';

interface UsePanelGestureOptions {
  direction: 'left' | 'right' | 'top' | 'bottom';
  onClose: () => void;
  threshold?: number; // Distance to trigger close (default: 150px)
  velocityThreshold?: number; // Velocity to trigger close (default: 0.5)
}

export function usePanelGesture({
  direction,
  onClose,
  threshold = 150,
  velocityThreshold = 0.5,
}: UsePanelGestureOptions) {
  const isHorizontal = direction === 'left' || direction === 'right';
  const isPositive = direction === 'right' || direction === 'bottom';

  const [spring, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: springConfigs.snap,
  }));

  const bind = useDrag(
    ({
      active,
      movement: [mx, my],
      velocity: [vx, vy],
      direction: [dx, dy],
      cancel,
    }) => {
      const movement = isHorizontal ? mx : my;
      const velocity = isHorizontal ? vx : vy;
      const dir = isHorizontal ? dx : dy;

      // Only allow dragging in the close direction
      const isClosingDirection = isPositive ? movement > 0 : movement < 0;

      if (!active) {
        // Check if should close
        const shouldClose =
          Math.abs(movement) > threshold ||
          (Math.abs(velocity) > velocityThreshold && isClosingDirection);

        if (shouldClose && isClosingDirection) {
          // Animate out then close
          api.start({
            [isHorizontal ? 'x' : 'y']: isPositive ? window.innerWidth : -window.innerWidth,
            config: springConfigs.dragRelease,
            onRest: onClose,
          });
        } else {
          // Snap back
          api.start({
            x: 0,
            y: 0,
            config: springConfigs.bouncy,
          });
        }
        return;
      }

      // During drag - apply resistance if dragging wrong direction
      const resistance = isClosingDirection ? 1 : 0.2;

      api.start({
        [isHorizontal ? 'x' : 'y']: movement * resistance,
        immediate: true,
      });
    },
    {
      axis: isHorizontal ? 'x' : 'y',
      filterTaps: true,
      threshold: 10,
      rubberband: 0.15, // Resistance at edges
    }
  );

  return { spring, bind };
}
```

### Draggable Panel Component

```tsx
// /src/components/DraggablePanel.tsx

import { animated } from '@react-spring/web';
import { usePanelGesture } from '../hooks/usePanelGesture';

interface DraggablePanelProps {
  direction: 'left' | 'right' | 'top' | 'bottom';
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function DraggablePanel({
  direction,
  isOpen,
  onClose,
  children
}: DraggablePanelProps) {
  const { spring, bind } = usePanelGesture({
    direction,
    onClose,
    threshold: 100,
    velocityThreshold: 0.3,
  });

  if (!isOpen) return null;

  return (
    <animated.div
      {...bind()}
      className="fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-xl touch-none"
      style={{
        transform: spring.x.to(x => spring.y.to(y =>
          `translate3d(${x}px, ${y}px, 0)`
        )),
      }}
    >
      {/* Drag handle indicator */}
      <div className={`absolute ${getDragHandlePosition(direction)}`}>
        <div className="w-10 h-1 bg-white/30 rounded-full" />
      </div>

      {children}
    </animated.div>
  );
}

function getDragHandlePosition(direction: string): string {
  switch (direction) {
    case 'left': return 'right-4 top-1/2 -translate-y-1/2 rotate-90';
    case 'right': return 'left-4 top-1/2 -translate-y-1/2 rotate-90';
    case 'top': return 'bottom-4 left-1/2 -translate-x-1/2';
    case 'bottom': return 'top-4 left-1/2 -translate-x-1/2';
    default: return '';
  }
}
```

---

## 6. Animation Sequencing

### useChain for Panel + Content

```tsx
// /src/hooks/useSequencedPanel.ts

import {
  useSpring,
  useTransition,
  useChain,
  useSpringRef
} from '@react-spring/web';
import { springConfigs } from '../config/springConfigs';

interface ContentItem {
  id: string;
  content: React.ReactNode;
}

export function useSequencedPanel(
  isOpen: boolean,
  direction: 'left' | 'right' | 'top' | 'bottom',
  contentItems: ContentItem[]
) {
  // Phase 1: Panel slide
  const panelRef = useSpringRef();
  const panelSpring = useSpring({
    ref: panelRef,
    from: { progress: 0 },
    to: { progress: isOpen ? 1 : 0 },
    config: springConfigs.snap,
  });

  // Phase 2: Content items stagger in
  const contentRef = useSpringRef();
  const contentTransitions = useTransition(isOpen ? contentItems : [], {
    ref: contentRef,
    keys: item => item.id,
    from: { opacity: 0, y: 30, scale: 0.95 },
    enter: { opacity: 1, y: 0, scale: 1 },
    leave: { opacity: 0, y: -20, scale: 0.95 },
    trail: 50, // 50ms stagger between items
    config: springConfigs.gentle,
  });

  // Chain: panel first, then content
  // On close: content fades first, then panel slides
  useChain(
    isOpen
      ? [panelRef, contentRef]
      : [contentRef, panelRef],
    isOpen
      ? [0, 0.2]  // Content starts at 20% through panel animation
      : [0, 0.15] // Panel starts at 15% through content fade
  );

  return {
    panelSpring,
    contentTransitions,
    getTransform: (progress: number) => {
      switch (direction) {
        case 'left': return `translate3d(${-100 + progress * 100}%, 0, 0)`;
        case 'right': return `translate3d(${100 - progress * 100}%, 0, 0)`;
        case 'top': return `translate3d(0, ${-100 + progress * 100}%, 0)`;
        case 'bottom': return `translate3d(0, ${100 - progress * 100}%, 0)`;
      }
    },
  };
}
```

### Full Sequenced Panel Component

```tsx
// /src/components/SequencedPanel.tsx

import { animated } from '@react-spring/web';
import { useSequencedPanel } from '../hooks/useSequencedPanel';

interface SequencedPanelProps {
  isOpen: boolean;
  direction: 'left' | 'right' | 'top' | 'bottom';
  items: Array<{ id: string; title: string; content: React.ReactNode }>;
  onClose: () => void;
}

export function SequencedPanel({
  isOpen,
  direction,
  items,
  onClose,
}: SequencedPanelProps) {
  const { panelSpring, contentTransitions, getTransform } = useSequencedPanel(
    isOpen,
    direction,
    items
  );

  return (
    <>
      {/* Backdrop */}
      <animated.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        style={{ opacity: panelSpring.progress }}
        onClick={onClose}
      />

      {/* Panel */}
      <animated.div
        className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900/98 to-gray-800/98
                   backdrop-blur-xl border-l border-white/10"
        style={{
          transform: panelSpring.progress.to(getTransform),
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>

        {/* Staggered content items */}
        <div className="p-6 space-y-4">
          {contentTransitions((style, item) => (
            <animated.div
              key={item.id}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
              style={{
                opacity: style.opacity,
                transform: style.y.to(y =>
                  style.scale.to(s => `translateY(${y}px) scale(${s})`)
                ),
              }}
            >
              <h3 className="text-lg font-medium text-white mb-2">
                {item.title}
              </h3>
              {item.content}
            </animated.div>
          ))}
        </div>
      </animated.div>
    </>
  );
}
```

---

## 7. Complete Dashboard Integration

```tsx
// /src/components/BattlestationDashboard.tsx

import { useState } from 'react';
import { TabIcon } from './TabIcon';
import { DraggablePanel } from './DraggablePanel';
import { SequencedPanel } from './SequencedPanel';

type PanelId = 'left' | 'right' | 'top' | 'bottom' | null;

const panelContent = {
  left: [
    { id: '1', title: 'System Stats', content: <div>CPU, Memory, Disk</div> },
    { id: '2', title: 'Network', content: <div>Traffic monitoring</div> },
  ],
  right: [
    { id: '1', title: 'Quick Actions', content: <div>Shortcuts</div> },
    { id: '2', title: 'Notifications', content: <div>Alerts</div> },
  ],
  top: [
    { id: '1', title: 'Search', content: <div>Global search</div> },
  ],
  bottom: [
    { id: '1', title: 'Terminal', content: <div>Command line</div> },
    { id: '2', title: 'Logs', content: <div>System logs</div> },
  ],
};

export function BattlestationDashboard() {
  const [activePanel, setActivePanel] = useState<PanelId>(null);

  const togglePanel = (panel: PanelId) => {
    setActivePanel(current => current === panel ? null : panel);
  };

  return (
    <div className="relative w-screen h-screen bg-gray-950 overflow-hidden">
      {/* Main content area */}
      <div className="absolute inset-20 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white/20">BATTLESTATION</h1>
      </div>

      {/* Tab icons - Left edge */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <TabIcon
          icon={<span>📊</span>}
          isActive={activePanel === 'left'}
          onClick={() => togglePanel('left')}
          position="left"
        />
      </div>

      {/* Tab icons - Right edge */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <TabIcon
          icon={<span>⚡</span>}
          isActive={activePanel === 'right'}
          onClick={() => togglePanel('right')}
          position="right"
        />
      </div>

      {/* Tab icons - Top edge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-3">
        <TabIcon
          icon={<span>🔍</span>}
          isActive={activePanel === 'top'}
          onClick={() => togglePanel('top')}
          position="top"
        />
      </div>

      {/* Tab icons - Bottom edge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        <TabIcon
          icon={<span>💻</span>}
          isActive={activePanel === 'bottom'}
          onClick={() => togglePanel('bottom')}
          position="bottom"
        />
      </div>

      {/* Panels */}
      {(['left', 'right', 'top', 'bottom'] as const).map(direction => (
        <SequencedPanel
          key={direction}
          isOpen={activePanel === direction}
          direction={direction}
          items={panelContent[direction]}
          onClose={() => setActivePanel(null)}
        />
      ))}
    </div>
  );
}
```

---

## 8. Summary: Animation Cheat Sheet

### Spring Config Quick Reference

| Feel | Tension | Friction | Use For |
|------|---------|----------|---------|
| Snappy | 400-500 | 28-35 | Panel slides, primary actions |
| Bouncy | 250-350 | 8-15 | Button presses, playful feedback |
| Stiff | 500-700 | 35-50 | Hover states, immediate response |
| Gentle | 150-250 | 20-30 | Content fades, secondary animations |
| Wobbly | 150-200 | 10-15 | Fun effects, attention grabbers |

### Hook Selection Guide

| Scenario | Hook |
|----------|------|
| Toggle open/close | `useSpring` |
| Mount/unmount elements | `useTransition` |
| Multiple items staggering | `useTransition` with `trail` |
| Sequenced animations | `useChain` + `useSpringRef` |
| Gesture interactions | `useDrag` from @use-gesture |
| Complex multi-value | `useSprings` |

### Gesture Thresholds

```typescript
// Recommended values for drag-to-dismiss
const gestureConfig = {
  threshold: 100,      // pixels before triggering
  velocity: 0.3,       // pixels/ms for quick swipe
  rubberband: 0.15,    // resistance at limits
  filterTaps: true,    // ignore accidental touches
};
```
