/**
 * React Spring Configuration Presets for Battlestation Dashboard
 *
 * These configs are tuned for satisfying "snap" animations with
 * appropriate physics for different interaction types.
 */

import type { SpringConfig } from '@react-spring/web';

// =============================================================================
// SPRING CONFIGURATIONS
// =============================================================================

export const springConfigs = {
  /**
   * Snappy panel slide - primary panels
   * High tension for quick response, moderate friction for clean settle
   */
  snap: {
    tension: 400,
    friction: 30,
    mass: 1,
    clamp: false,
  } satisfies SpringConfig,

  /**
   * Extra snappy for small UI elements
   * Lower mass = faster acceleration
   */
  snappier: {
    tension: 500,
    friction: 28,
    mass: 0.8,
  } satisfies SpringConfig,

  /**
   * Gentle settle for content fade-in
   * Lower tension = smoother, more gradual motion
   */
  gentle: {
    tension: 200,
    friction: 26,
    mass: 1,
  } satisfies SpringConfig,

  /**
   * Bouncy for button press feedback
   * Low friction = more oscillation/overshoot
   */
  bouncy: {
    tension: 300,
    friction: 10,
    mass: 0.5,
  } satisfies SpringConfig,

  /**
   * Stiff for hover states
   * High tension + high friction = immediate, no wobble
   */
  stiff: {
    tension: 600,
    friction: 40,
    mass: 1,
  } satisfies SpringConfig,

  /**
   * Wobbly for playful effects
   * Low friction creates a "jelly" feel
   */
  wobbly: {
    tension: 180,
    friction: 12,
    mass: 1,
  } satisfies SpringConfig,

  /**
   * Drag release - for gesture-driven animations
   * Slightly overshoots then settles
   */
  dragRelease: {
    tension: 350,
    friction: 25,
    mass: 1,
    velocity: 0,
  } satisfies SpringConfig,

  /**
   * Slow and dramatic - for large reveals
   */
  slow: {
    tension: 120,
    friction: 30,
    mass: 2,
  } satisfies SpringConfig,

  /**
   * Molasses - ultra smooth, no overshoot
   * Good for background elements
   */
  molasses: {
    tension: 80,
    friction: 40,
    mass: 3,
  } satisfies SpringConfig,
} as const;

// =============================================================================
// SEMANTIC ALIASES
// =============================================================================

/** Panel slide animations */
export const panelConfig = springConfigs.snap;

/** Tab icon hover/press states */
export const tabConfig = springConfigs.stiff;

/** Content fade-in animations */
export const contentConfig = springConfigs.gentle;

/** Button feedback */
export const buttonConfig = springConfigs.bouncy;

/** Backdrop fade */
export const backdropConfig = springConfigs.gentle;

/** Drag gesture release */
export const gestureConfig = springConfigs.dragRelease;

// =============================================================================
// DIRECTION TRANSFORMS
// =============================================================================

export type PanelDirection = 'left' | 'right' | 'top' | 'bottom';

/**
 * CSS transform values for panel animations from each direction
 */
export const directionTransforms: Record<
  PanelDirection,
  { from: string; enter: string; leave: string }
> = {
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

/**
 * Get transform string based on direction and progress (0-1)
 */
export function getDirectionTransform(
  direction: PanelDirection,
  progress: number
): string {
  switch (direction) {
    case 'left':
      return `translate3d(${-100 + progress * 100}%, 0, 0)`;
    case 'right':
      return `translate3d(${100 - progress * 100}%, 0, 0)`;
    case 'top':
      return `translate3d(0, ${-100 + progress * 100}%, 0)`;
    case 'bottom':
      return `translate3d(0, ${100 - progress * 100}%, 0)`;
  }
}

// =============================================================================
// GESTURE THRESHOLDS
// =============================================================================

export const gestureThresholds = {
  /** Minimum drag distance (px) to trigger close */
  dragDistance: 100,

  /** Minimum velocity (px/ms) for quick swipe */
  swipeVelocity: 0.3,

  /** Rubber band effect at limits (0-1) */
  rubberband: 0.15,

  /** Initial drag threshold before gesture activates */
  activationThreshold: 10,
} as const;

// =============================================================================
// ANIMATION TIMING
// =============================================================================

export const animationTiming = {
  /** Stagger delay between list items (ms) */
  staggerDelay: 50,

  /** Delay before content starts animating (0-1 of panel animation) */
  contentDelay: 0.2,

  /** Delay before panel closes after content fades (0-1) */
  panelCloseDelay: 0.15,
} as const;

// =============================================================================
// PER-KEY CONFIG HELPER
// =============================================================================

type ConfigKey = keyof typeof springConfigs;

/**
 * Create a config function for useSpring that applies different
 * configs based on the animated property key
 *
 * @example
 * useSpring({
 *   scale: 1,
 *   opacity: 1,
 *   config: createKeyConfig({
 *     scale: 'bouncy',
 *     opacity: 'gentle',
 *     default: 'snap'
 *   })
 * })
 */
export function createKeyConfig(
  mapping: Partial<Record<string, ConfigKey>> & { default?: ConfigKey }
): (key: string) => SpringConfig {
  return (key: string) => {
    const configKey = mapping[key] ?? mapping.default ?? 'snap';
    return springConfigs[configKey];
  };
}
