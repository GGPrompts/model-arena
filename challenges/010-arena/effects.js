/**
 * =============================================================================
 * RETRO TYPING GAME - INSANE VISUAL EFFECTS MODULE
 * A CRT that's about to explode
 * =============================================================================
 */

// ASCII art numbers for level display
const ASCII_NUMBERS = {
  0: [
    ' ██████╗ ',
    '██╔═══██╗',
    '██║   ██║',
    '██║   ██║',
    '╚██████╔╝',
    ' ╚═════╝ '
  ],
  1: [
    ' ██╗',
    '███║',
    '╚██║',
    ' ██║',
    ' ██║',
    ' ╚═╝'
  ],
  2: [
    '██████╗ ',
    '╚════██╗',
    ' █████╔╝',
    '██╔═══╝ ',
    '███████╗',
    '╚══════╝'
  ],
  3: [
    '██████╗ ',
    '╚════██╗',
    ' █████╔╝',
    ' ╚═══██╗',
    '██████╔╝',
    '╚═════╝ '
  ],
  4: [
    '██╗  ██╗',
    '██║  ██║',
    '███████║',
    '╚════██║',
    '     ██║',
    '     ╚═╝'
  ],
  5: [
    '███████╗',
    '██╔════╝',
    '███████╗',
    '╚════██║',
    '███████║',
    '╚══════╝'
  ],
  6: [
    ' ██████╗',
    '██╔════╝',
    '███████╗',
    '██╔═══██╗',
    '╚██████╔╝',
    ' ╚═════╝'
  ],
  7: [
    '███████╗',
    '╚════██║',
    '    ██╔╝',
    '   ██╔╝ ',
    '   ██║  ',
    '   ╚═╝  '
  ],
  8: [
    ' █████╗ ',
    '██╔══██╗',
    '╚█████╔╝',
    '██╔══██╗',
    '╚█████╔╝',
    ' ╚════╝ '
  ],
  9: [
    ' █████╗ ',
    '██╔══██╗',
    '╚██████║',
    ' ╚═══██║',
    ' █████╔╝',
    ' ╚════╝ '
  ]
};

// Glitch characters for corruption effect
const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`█▓▒░▀▄▌▐■□▪▫●○◘◙◦☺☻♥♦♣♠•◘○';

// Boot sequence messages
const BOOT_MESSAGES = [
  'INITIALIZING CRT DISPLAY...',
  'LOADING PHOSPHOR MATRIX...',
  'CALIBRATING ELECTRON GUN...',
  'SYNCING HORIZONTAL SCAN...',
  'WARMING UP CATHODE RAY...',
  'ESTABLISHING DEFLECTION COILS...',
  'LOADING GAME DATA...',
  'READY.'
];

/**
 * Effect state and configuration
 */
const state = {
  container: null,
  scanlines: null,
  particleContainer: null,
  isInitialized: false,
  shakeTimeout: null,
  glitchInterval: null,
  feverMode: false,
  combo: 0,
  intensity: 0, // Overall intensity level 0-1
  phosphorTrails: [],
  activeCorruptions: new Map()
};

/**
 * Initialize the effects system
 * @param {HTMLElement} container - The main CRT container element
 */
export function initEffects(container) {
  if (state.isInitialized) {
    console.warn('Effects already initialized');
    return;
  }

  state.container = container;
  container.classList.add('crt-container', 'flicker-continuous', 'gpu-accelerated');

  // Create scanlines overlay
  state.scanlines = document.createElement('div');
  state.scanlines.className = 'scanlines';
  container.appendChild(state.scanlines);

  // Create particle container
  state.particleContainer = document.createElement('div');
  state.particleContainer.className = 'particle-container';
  container.appendChild(state.particleContainer);

  // Set initial CSS variables
  updateIntensity(0);

  state.isInitialized = true;

  // Start ambient effects
  startAmbientEffects();

  return {
    triggerScreenShake,
    triggerGlitch,
    animateCharacter,
    showComboEffect,
    triggerFeverMode,
    playLevelTransition,
    updateIntensity,
    createParticleExplosion,
    triggerRGBSplit,
    triggerScanlineBurst,
    corruptCharacter,
    createPhosphorTrail,
    animateWPMMilestone,
    animateProgressBar,
    animateScoreSpin,
    cleanup
  };
}

/**
 * Start subtle ambient effects
 */
function startAmbientEffects() {
  // Random subtle flickers
  setInterval(() => {
    if (Math.random() < 0.05 + state.intensity * 0.1) {
      state.container.classList.add('flicker');
      setTimeout(() => state.container.classList.remove('flicker'), 100);
    }
  }, 2000);

  // Random scanline intensity variation
  setInterval(() => {
    const base = 0.15;
    const variation = (Math.random() - 0.5) * 0.1 * (1 + state.intensity);
    state.container.style.setProperty('--scanline-intensity', base + variation);
  }, 500);
}

/**
 * Update overall effect intensity (0-1)
 */
export function updateIntensity(value) {
  state.intensity = Math.max(0, Math.min(1, value));
  const container = state.container;
  if (container) {
    container.style.setProperty('--flicker-intensity', state.intensity * 0.3);
    container.style.setProperty('--scanline-intensity', 0.15 + state.intensity * 0.2);
  }
}

/**
 * Trigger screen shake effect
 * @param {number} intensity - Shake intensity (1-10)
 */
export function triggerScreenShake(intensity = 5) {
  if (!state.container) return;

  clearTimeout(state.shakeTimeout);

  // Set shake intensity CSS variable
  state.container.style.setProperty('--shake-intensity', intensity);

  // Choose shake class based on intensity
  let shakeClass;
  if (intensity <= 3) {
    shakeClass = 'shake-light';
  } else if (intensity <= 6) {
    shakeClass = 'shake';
  } else if (intensity <= 8) {
    shakeClass = 'shake-heavy';
  } else {
    shakeClass = 'shake-violent';
  }

  // Apply shake
  state.container.classList.add(shakeClass);

  // Apply barrel distortion warp on heavy shakes
  if (intensity > 5) {
    state.container.style.setProperty('--barrel-warp', intensity * 0.5);
    setTimeout(() => {
      state.container.style.setProperty('--barrel-warp', 0);
    }, 200);
  }

  state.shakeTimeout = setTimeout(() => {
    state.container.classList.remove('shake-light', 'shake', 'shake-heavy', 'shake-violent');
  }, intensity * 30 + 100);
}

/**
 * Trigger RGB split / chromatic aberration
 * @param {boolean} intense - Whether to use intense version
 */
export function triggerRGBSplit(intense = false) {
  if (!state.container) return;

  const className = intense ? 'glitch-rgb' : 'glitch-rgb';
  state.container.classList.add(className);

  // Also apply to text content
  const textElements = state.container.querySelectorAll('.game-text, .display-text');
  textElements.forEach(el => {
    el.classList.add(intense ? 'rgb-split-intense' : 'rgb-split');
  });

  setTimeout(() => {
    state.container.classList.remove(className);
    textElements.forEach(el => {
      el.classList.remove('rgb-split', 'rgb-split-intense');
    });
  }, intense ? 200 : 150);
}

/**
 * Trigger scanline interference burst
 */
export function triggerScanlineBurst() {
  if (!state.scanlines) return;

  state.scanlines.classList.add('burst');
  setTimeout(() => {
    state.scanlines.classList.remove('burst');
  }, 300);
}

/**
 * Trigger comprehensive glitch effect
 * @param {number} duration - Duration in milliseconds
 */
export function triggerGlitch(duration = 300) {
  if (!state.container) return;

  // Stack multiple glitch effects
  triggerRGBSplit(true);
  triggerScanlineBurst();
  triggerScreenShake(4);

  // Horizontal tear effect
  state.container.classList.add('h-tear');

  // Flicker
  state.container.classList.add('flicker-intense');

  // Random character corruption
  const textElements = state.container.querySelectorAll('.char, [data-char]');
  const corruptCount = Math.min(textElements.length, Math.floor(3 + Math.random() * 5));
  const toCorrupt = shuffleArray([...textElements]).slice(0, corruptCount);

  toCorrupt.forEach((el, i) => {
    setTimeout(() => corruptCharacter(el, 200 + Math.random() * 200), i * 50);
  });

  // Clean up
  setTimeout(() => {
    state.container.classList.remove('h-tear', 'flicker-intense');
  }, duration);
}

/**
 * Corrupt a character temporarily with random glitch characters
 * @param {HTMLElement} element - Character element
 * @param {number} duration - How long to stay corrupted
 */
export function corruptCharacter(element, duration = 300) {
  const originalContent = element.textContent;
  const originalColor = element.style.color;

  const corruptionId = Math.random().toString(36);
  state.activeCorruptions.set(element, corruptionId);

  let iterations = 0;
  const maxIterations = Math.floor(duration / 50);

  const interval = setInterval(() => {
    if (state.activeCorruptions.get(element) !== corruptionId || iterations >= maxIterations) {
      clearInterval(interval);
      element.textContent = originalContent;
      element.style.color = originalColor;
      element.classList.remove('char-corrupt');
      state.activeCorruptions.delete(element);
      return;
    }

    element.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    element.style.color = ['#ff0040', '#00ffff', '#ff00ff', '#00ff41'][Math.floor(Math.random() * 4)];
    iterations++;
  }, 50);
}

/**
 * Animate a character based on typing action
 * @param {HTMLElement} element - The character element
 * @param {string} type - 'correct', 'error', or 'current'
 */
export function animateCharacter(element, type) {
  if (!element) return;

  // Remove existing animation classes
  element.classList.remove('char-typed', 'char-current', 'char-error');

  // Force reflow
  void element.offsetWidth;

  switch (type) {
    case 'correct':
      element.classList.add('char-typed');

      // Create phosphor trail on fast typing
      if (state.intensity > 0.3) {
        createPhosphorTrail(element);
      }

      // Sparks on high combo
      if (state.combo > 10) {
        createSparks(element, 3 + Math.floor(state.combo / 10));
      }
      break;

    case 'error':
      element.classList.add('char-error');
      triggerScreenShake(3 + state.combo * 0.2);
      triggerRGBSplit(false);

      // More intense effects on fever mode
      if (state.feverMode) {
        triggerGlitch(200);
      }
      break;

    case 'current':
      element.classList.add('char-current');
      break;
  }
}

/**
 * Create phosphor burn-in trail
 * @param {HTMLElement} element - Source element
 */
export function createPhosphorTrail(element) {
  const rect = element.getBoundingClientRect();
  const containerRect = state.container.getBoundingClientRect();

  const trail = document.createElement('span');
  trail.className = 'phosphor-trail';
  trail.textContent = element.textContent;
  trail.style.cssText = `
    left: ${rect.left - containerRect.left}px;
    top: ${rect.top - containerRect.top}px;
    font-size: ${window.getComputedStyle(element).fontSize};
  `;

  state.container.appendChild(trail);
  state.phosphorTrails.push(trail);

  // Cleanup
  setTimeout(() => {
    trail.remove();
    const idx = state.phosphorTrails.indexOf(trail);
    if (idx > -1) state.phosphorTrails.splice(idx, 1);
  }, 2000);
}

/**
 * Create spark particles
 * @param {HTMLElement} element - Source element
 * @param {number} count - Number of sparks
 */
function createSparks(element, count = 5) {
  const rect = element.getBoundingClientRect();
  const containerRect = state.container.getBoundingClientRect();

  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';

    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 50;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    spark.style.cssText = `
      left: ${rect.left - containerRect.left + rect.width / 2}px;
      top: ${rect.top - containerRect.top + rect.height / 2}px;
      --dx: ${dx};
      --dy: ${dy};
    `;

    state.particleContainer.appendChild(spark);

    setTimeout(() => spark.remove(), 600);
  }
}

/**
 * Create particle explosion from word completion
 * @param {HTMLElement} wordElement - The completed word element
 * @param {Object} options - Explosion options
 */
export function createParticleExplosion(wordElement, options = {}) {
  const {
    particleCount = 15,
    colors = ['#00ff41', '#00ffff', '#ffb000', '#ff00ff'],
    spread = 150,
    duration = 1000
  } = options;

  const rect = wordElement.getBoundingClientRect();
  const containerRect = state.container.getBoundingClientRect();
  const centerX = rect.left - containerRect.left + rect.width / 2;
  const centerY = rect.top - containerRect.top + rect.height / 2;

  const chars = wordElement.textContent.split('');

  // Explode each character
  chars.forEach((char, i) => {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.textContent = char;

    const angle = (Math.PI * 2 * i) / chars.length + (Math.random() - 0.5) * 0.5;
    const distance = spread * (0.5 + Math.random() * 0.5);
    const rotation = (Math.random() - 0.5) * 720;

    particle.style.cssText = `
      left: ${centerX}px;
      top: ${centerY}px;
      color: ${colors[Math.floor(Math.random() * colors.length)]};
      --angle: ${angle}rad;
      --distance: ${distance}px;
      --rotation: ${rotation}deg;
      --particle-lifetime: ${duration}ms;
    `;

    state.particleContainer.appendChild(particle);
    setTimeout(() => particle.remove(), duration);
  });

  // Extra sparks
  for (let i = 0; i < particleCount; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';

    const angle = Math.random() * Math.PI * 2;
    const distance = spread * (0.3 + Math.random() * 0.7);

    spark.style.cssText = `
      left: ${centerX}px;
      top: ${centerY}px;
      --dx: ${Math.cos(angle) * distance};
      --dy: ${Math.sin(angle) * distance};
      background: ${colors[Math.floor(Math.random() * colors.length)]};
    `;

    state.particleContainer.appendChild(spark);
    setTimeout(() => spark.remove(), 600);
  }

  // Screen effects
  triggerScreenShake(2);
  if (state.combo > 5) {
    triggerRGBSplit(false);
  }
}

/**
 * Show combo effect
 * @param {number} combo - Current combo count
 */
export function showComboEffect(combo) {
  state.combo = combo;

  // Update combo glow intensity
  const glowIntensity = Math.min(1, combo / 50);
  state.container.style.setProperty('--combo-glow', glowIntensity);

  // Find or create combo counter
  let comboCounter = state.container.querySelector('.combo-counter');

  if (comboCounter) {
    // Update combo class based on value
    comboCounter.classList.remove('on-fire', 'electric');

    if (combo >= 50) {
      comboCounter.classList.add('electric');
    } else if (combo >= 20) {
      comboCounter.classList.add('on-fire');
    }

    // Show combo popup on milestones
    if (combo % 10 === 0 && combo > 0) {
      showComboPopup(combo);
      triggerScreenShake(4);
      triggerRGBSplit(true);
    }
  }

  // Auto-trigger fever mode at high combo
  if (combo >= 30 && !state.feverMode) {
    triggerFeverMode();
  }
}

/**
 * Show combo popup
 * @param {number} combo - Combo number
 */
function showComboPopup(combo) {
  const popup = document.createElement('div');
  popup.className = 'combo-popup';
  popup.textContent = `${combo} COMBO!`;

  // Position near center but with some randomness
  const containerRect = state.container.getBoundingClientRect();
  popup.style.cssText = `
    left: ${containerRect.width / 2 + (Math.random() - 0.5) * 100}px;
    top: ${containerRect.height / 2 + (Math.random() - 0.5) * 50}px;
    color: ${combo >= 50 ? '#00ffff' : combo >= 30 ? '#ffb000' : '#00ff41'};
  `;

  state.particleContainer.appendChild(popup);
  setTimeout(() => popup.remove(), 800);
}

/**
 * Trigger FEVER MODE
 */
export function triggerFeverMode() {
  if (state.feverMode) return;

  state.feverMode = true;
  state.container.classList.add('fever-mode');

  // Show FEVER text
  const feverText = document.createElement('div');
  feverText.className = 'fever-text';
  feverText.textContent = 'FEVER MODE';
  state.container.appendChild(feverText);

  // Intense visual burst
  triggerScreenShake(8);
  triggerGlitch(500);

  // Remove FEVER text after animation
  setTimeout(() => {
    feverText.style.animation = 'fever-text-anim 0.3s ease-in reverse forwards';
    setTimeout(() => feverText.remove(), 300);
  }, 2000);
}

/**
 * End fever mode
 */
export function endFeverMode() {
  state.feverMode = false;
  state.container.classList.remove('fever-mode');
  state.container.style.setProperty('--fever-pulse', 0);
}

/**
 * Animate WPM milestone
 * @param {HTMLElement} wpmElement - WPM counter element
 * @param {number} wpm - Current WPM
 */
export function animateWPMMilestone(wpmElement, wpm) {
  if (!wpmElement) return;

  // Milestone at every 10 WPM
  if (wpm % 10 === 0 && wpm > 0) {
    wpmElement.classList.add('milestone');
    triggerScreenShake(3);

    setTimeout(() => {
      wpmElement.classList.remove('milestone');
    }, 500);
  }
}

/**
 * Animate progress bar with particle trail
 * @param {HTMLElement} progressFill - Progress fill element
 * @param {number} progress - Progress percentage (0-100)
 */
export function animateProgressBar(progressFill, progress) {
  if (!progressFill) return;

  const prevProgress = parseFloat(progressFill.style.width) || 0;
  progressFill.style.width = `${progress}%`;

  // Create particles on significant progress
  if (progress - prevProgress > 2) {
    const rect = progressFill.getBoundingClientRect();
    const containerRect = state.container.getBoundingClientRect();

    for (let i = 0; i < 3; i++) {
      const particle = document.createElement('div');
      particle.className = 'progress-particle';

      particle.style.cssText = `
        left: ${rect.right - containerRect.left}px;
        top: ${rect.top - containerRect.top + rect.height / 2}px;
        --dx: ${(Math.random() - 0.5) * 30};
        --dy: ${(Math.random() - 0.5) * 20 - 10};
      `;

      state.particleContainer.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  }
}

/**
 * Animate score with slot machine spin
 * @param {HTMLElement} scoreElement - Score display element
 * @param {number} oldScore - Previous score
 * @param {number} newScore - New score
 */
export function animateScoreSpin(scoreElement, oldScore, newScore) {
  if (!scoreElement) return;

  const gain = newScore - oldScore;

  // For big gains, add special effect
  if (gain >= 100) {
    scoreElement.classList.add('big-gain');
    triggerScreenShake(5);
    setTimeout(() => scoreElement.classList.remove('big-gain'), 500);
  }

  // Slot machine animation for each digit
  const oldStr = String(oldScore).padStart(6, '0');
  const newStr = String(newScore).padStart(6, '0');

  // Clear and rebuild digits
  scoreElement.innerHTML = '';

  for (let i = 0; i < newStr.length; i++) {
    const digit = document.createElement('span');
    digit.className = 'score-digit';
    digit.textContent = oldStr[i] || '0';

    if (oldStr[i] !== newStr[i]) {
      digit.classList.add('spinning');
      setTimeout(() => {
        digit.textContent = newStr[i];
        digit.classList.remove('spinning');
      }, 300);
    } else {
      digit.textContent = newStr[i];
    }

    scoreElement.appendChild(digit);
  }
}

/**
 * Play level transition
 * @param {number} levelNum - Level number
 * @param {Function} callback - Callback when transition complete
 */
export function playLevelTransition(levelNum, callback) {
  // Create transition overlay
  const transition = document.createElement('div');
  transition.className = 'level-transition';

  // CRT turn-off effect on current content
  state.container.classList.add('crt-off');

  setTimeout(() => {
    // Build transition content
    transition.innerHTML = `
      <div class="stage-clear">STAGE CLEAR</div>
      <div class="boot-loader">
        <div class="boot-loader-track">
          <div class="boot-loader-fill"></div>
        </div>
      </div>
      <div class="boot-text"></div>
      <div class="level-ascii"></div>
    `;

    document.body.appendChild(transition);

    // Animate boot sequence
    animateBootSequence(transition, levelNum, () => {
      // Remove transition
      transition.style.animation = 'crt-turn-off 0.3s ease-in forwards';

      setTimeout(() => {
        transition.remove();
        state.container.classList.remove('crt-off');
        state.container.classList.add('crt-on');

        setTimeout(() => {
          state.container.classList.remove('crt-on');
          if (callback) callback();
        }, 800);
      }, 300);
    });
  }, 500);
}

/**
 * Animate boot sequence
 */
function animateBootSequence(container, levelNum, callback) {
  const loader = container.querySelector('.boot-loader-fill');
  const bootText = container.querySelector('.boot-text');
  const levelAscii = container.querySelector('.level-ascii');

  let messageIndex = 0;
  let progress = 0;

  const interval = setInterval(() => {
    if (messageIndex < BOOT_MESSAGES.length) {
      bootText.textContent = BOOT_MESSAGES[messageIndex];
      progress = ((messageIndex + 1) / BOOT_MESSAGES.length) * 100;
      loader.style.width = `${progress}%`;
      messageIndex++;
    } else {
      clearInterval(interval);

      // Show level ASCII art
      setTimeout(() => {
        levelAscii.innerHTML = generateLevelASCII(levelNum);
        levelAscii.style.animation = 'ascii-reveal 0.5s steps(10) forwards';

        setTimeout(() => {
          if (callback) callback();
        }, 1500);
      }, 500);
    }
  }, 200);
}

/**
 * Generate ASCII art for level number
 */
function generateLevelASCII(num) {
  const digits = String(num).split('');
  const lines = ['', '', '', '', '', ''];

  // Add "LEVEL " prefix
  const levelPrefix = [
    '██╗     ███████╗██╗   ██╗███████╗██╗         ',
    '██║     ██╔════╝██║   ██║██╔════╝██║         ',
    '██║     █████╗  ██║   ██║█████╗  ██║         ',
    '██║     ██╔══╝  ╚██╗ ██╔╝██╔══╝  ██║         ',
    '███████╗███████╗ ╚████╔╝ ███████╗███████╗    ',
    '╚══════╝╚══════╝  ╚═══╝  ╚══════╝╚══════╝    '
  ];

  for (let i = 0; i < 6; i++) {
    lines[i] = levelPrefix[i];
    digits.forEach(d => {
      lines[i] += ASCII_NUMBERS[d][i];
    });
  }

  return lines.join('\n');
}

/**
 * Utility: Shuffle array
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Cleanup all effects
 */
export function cleanup() {
  clearTimeout(state.shakeTimeout);
  clearInterval(state.glitchInterval);

  state.phosphorTrails.forEach(trail => trail.remove());
  state.phosphorTrails = [];

  state.activeCorruptions.clear();

  if (state.particleContainer) {
    state.particleContainer.innerHTML = '';
  }

  state.feverMode = false;
  state.combo = 0;
  state.intensity = 0;

  if (state.container) {
    state.container.classList.remove(
      'fever-mode', 'crt-off', 'crt-on',
      'shake', 'shake-light', 'shake-heavy', 'shake-violent',
      'glitch-rgb', 'h-tear', 'flicker', 'flicker-intense'
    );
  }
}

// Export everything as default object too for convenience
export default {
  initEffects,
  triggerScreenShake,
  triggerGlitch,
  triggerRGBSplit,
  triggerScanlineBurst,
  animateCharacter,
  showComboEffect,
  triggerFeverMode,
  endFeverMode,
  playLevelTransition,
  updateIntensity,
  createParticleExplosion,
  corruptCharacter,
  createPhosphorTrail,
  animateWPMMilestone,
  animateProgressBar,
  animateScoreSpin,
  cleanup
};
