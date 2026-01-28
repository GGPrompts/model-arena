// React Spring configurations for premium cyberpunk animations
// Tuned for snappy, responsive, techy feel with satisfying easing

export const springConfigs = {
  // Panel slide - fast attack, controlled settle
  // High tension for immediate response, tuned friction for minimal overshoot
  snap: {
    tension: 520,
    friction: 32,
    mass: 0.8,
    clamp: false, // Allow tiny overshoot for organic feel
  },

  // Button press - ultra-responsive with micro-bounce
  // Low mass = instant response, lower friction = slight elasticity
  bouncy: {
    tension: 480,
    friction: 14,
    mass: 0.4,
  },

  // Hover states - near-instant, crisp
  // Very high tension + high friction = fast without bounce
  stiff: {
    tension: 800,
    friction: 50,
    mass: 0.6,
  },

  // Content fade - quick but not jarring
  // Slightly faster than typical for cyberpunk responsiveness
  gentle: {
    tension: 280,
    friction: 28,
    mass: 0.9,
  },

  // Gauge/meter animations - smooth data feel
  smooth: {
    tension: 140,
    friction: 22,
    mass: 1,
  },

  // Backdrop fade - fast in, slightly slower out
  backdrop: {
    tension: 360,
    friction: 34,
    mass: 1,
  },

  // Micro-interactions - nearly instant
  instant: {
    tension: 1000,
    friction: 60,
    mass: 0.5,
  },

  // Glow/pulse effects - ethereal, slightly slower
  glow: {
    tension: 200,
    friction: 20,
    mass: 1.2,
  },
};

// Transform helpers for panel directions
export const getClosedTransform = (position: 'top' | 'right' | 'bottom' | 'left') => {
  switch (position) {
    case 'left':
      return 'translateX(-100%)';
    case 'right':
      return 'translateX(100%)';
    case 'top':
      return 'translateY(-100%)';
    case 'bottom':
      return 'translateY(100%)';
  }
};

export const getOpenTransform = () => 'translate(0%, 0%)';
