/**
 * RETRO TYPING ARENA - GAME ENGINE
 * A brutally addictive typing challenge with multiple game modes
 *
 * Think Tetris Effect meets typing tutor - pure flow state gaming
 */

// ============================================================================
// WORD DATABASES
// ============================================================================

const WORD_BANKS = {
  easy: [
    'cat', 'dog', 'run', 'jump', 'code', 'type', 'fast', 'slow', 'game', 'play',
    'win', 'lose', 'key', 'word', 'text', 'fire', 'ice', 'hot', 'cold', 'big',
    'small', 'red', 'blue', 'green', 'black', 'white', 'up', 'down', 'left', 'right',
    'go', 'stop', 'yes', 'no', 'hit', 'miss', 'good', 'bad', 'new', 'old'
  ],

  medium: [
    'function', 'variable', 'constant', 'keyboard', 'monitor', 'computer', 'program',
    'algorithm', 'developer', 'challenge', 'precision', 'accuracy', 'velocity',
    'momentum', 'intensity', 'frequency', 'amplitude', 'spectrum', 'terminal',
    'interface', 'protocol', 'sequence', 'parallel', 'recursive', 'iteration',
    'compiler', 'debugger', 'framework', 'library', 'module', 'package', 'deploy'
  ],

  hard: [
    'asynchronous', 'polymorphism', 'encapsulation', 'authentication', 'authorization',
    'infrastructure', 'microservices', 'containerization', 'virtualization',
    'orchestration', 'optimization', 'implementation', 'configuration', 'serialization',
    'deserialization', 'concatenation', 'interpolation', 'extrapolation', 'acceleration',
    'deceleration', 'synchronization', 'initialization', 'instantiation', 'multiplication'
  ],

  insane: [
    'antidisestablishmentarianism', 'pneumonoultramicroscopicsilicovolcanoconiosis',
    'supercalifragilisticexpialidocious', 'pseudopseudohypoparathyroidism',
    'floccinaucinihilipilification', 'hippopotomonstrosesquippedaliophobia',
    'thyroparathyroidectomized', 'dichlorodifluoromethane', 'incomprehensibilities',
    'electroencephalographically', 'immunoelectrophoretically', 'psychophysicotherapeutics'
  ],

  programming: [
    'const', 'let', 'var', 'function', 'return', 'async', 'await', 'promise',
    'class', 'extends', 'implements', 'interface', 'export', 'import', 'default',
    'static', 'public', 'private', 'protected', 'readonly', 'abstract', 'override',
    'typeof', 'instanceof', 'null', 'undefined', 'boolean', 'number', 'string',
    'object', 'array', 'map', 'set', 'symbol', 'bigint', 'void', 'never', 'unknown',
    'console.log', 'document.getElementById', 'addEventListener', 'querySelector',
    'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'requestAnimationFrame',
    'JSON.parse', 'JSON.stringify', 'Object.keys', 'Object.values', 'Object.entries',
    'Array.from', 'Array.isArray', 'Math.random', 'Math.floor', 'Math.ceil', 'Math.round'
  ],

  gibberish: [] // Generated dynamically
};

// Boss definitions with ASCII art and attack phrases
const BOSSES = {
  1: {
    name: 'SYNTAX ERROR',
    ascii: `
    ╔═══════════════════╗
    ║   (╯°□°)╯︵ ┻━┻   ║
    ║    SYNTAX ERROR   ║
    ║   HP: [████████]  ║
    ╚═══════════════════╝`,
    maxHp: 100,
    phrases: [
      'undefined is not a function',
      'unexpected token',
      'missing semicolon',
      'cannot read property of null',
      'stack overflow'
    ],
    attackInterval: 3000
  },

  2: {
    name: 'MEMORY LEAK',
    ascii: `
    ╔═══════════════════════╗
    ║   ░░░▓▓▓███████▓▓▓░░  ║
    ║      MEMORY LEAK      ║
    ║   ╔══╗ ╔══╗ ╔══╗      ║
    ║   ║▓▓║ ║▓▓║ ║▓▓║      ║
    ║   HP: [████████████]  ║
    ╚═══════════════════════╝`,
    maxHp: 200,
    phrases: [
      'heap allocation failed',
      'out of memory exception',
      'garbage collection paused',
      'buffer overflow detected',
      'segmentation fault core dumped',
      'memory corruption at address'
    ],
    attackInterval: 2500
  },

  3: {
    name: 'INFINITE LOOP',
    ascii: `
    ╔═════════════════════════╗
    ║   ╭─────────────────╮   ║
    ║   │ while(true) {   │   ║
    ║   │   INFINITE LOOP │   ║
    ║   │ }               │   ║
    ║   ╰─────────────────╯   ║
    ║   HP: [██████████████]  ║
    ╚═════════════════════════╝`,
    maxHp: 350,
    phrases: [
      'while true do nothing end',
      'for ever and ever and ever',
      'recursion without base case',
      'call stack exceeded maximum',
      'process not responding',
      'application has frozen',
      'ctrl alt delete required'
    ],
    attackInterval: 2000
  },

  4: {
    name: 'RACE CONDITION',
    ascii: `
    ╔═══════════════════════════════╗
    ║  ┌──┐  ┌──┐  ┌──┐  ┌──┐      ║
    ║  │T1│=>│T2│<=│T3│=>│T4│      ║
    ║  └──┘  └──┘  └──┘  └──┘      ║
    ║       RACE CONDITION          ║
    ║   HP: [████████████████████]  ║
    ╚═══════════════════════════════╝`,
    maxHp: 500,
    phrases: [
      'deadlock detected between threads',
      'mutex acquisition timeout',
      'concurrent modification exception',
      'thread synchronization failed',
      'atomic operation interrupted',
      'semaphore wait abandoned',
      'critical section violation',
      'thread starvation detected'
    ],
    attackInterval: 1800
  },

  5: {
    name: 'FINAL BOSS: LEGACY CODE',
    ascii: `
    ╔═══════════════════════════════════════╗
    ║  ████████████████████████████████████ ║
    ║  █ // TODO: refactor this someday   █ ║
    ║  █ // Author: Unknown, Year: 1997   █ ║
    ║  █ // WARNING: HERE BE DRAGONS      █ ║
    ║  █                                  █ ║
    ║  █     L E G A C Y   C O D E        █ ║
    ║  █                                  █ ║
    ║  █  "It works, don't touch it"      █ ║
    ║  ████████████████████████████████████ ║
    ║   HP: [██████████████████████████████] ║
    ╚═══════════════════════════════════════╝`,
    maxHp: 1000,
    phrases: [
      'magic number forty two detected',
      'deprecated function call warning',
      'documentation not found anywhere',
      'spaghetti code complexity exceeded',
      'technical debt interest accruing',
      'vendor lock in dependency hell',
      'backwards compatibility nightmare',
      'undocumented side effects detected',
      'goto statement considered harmful',
      'global variable mutation chaos'
    ],
    attackInterval: 1500
  }
};

// ============================================================================
// EVENT EMITTER
// ============================================================================

class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) callbacks.splice(index, 1);
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (e) {
        console.error(`Error in event listener for ${event}:`, e);
      }
    });
  }

  once(event, callback) {
    const unsubscribe = this.on(event, (data) => {
      unsubscribe();
      callback(data);
    });
    return unsubscribe;
  }
}

// ============================================================================
// GAME MODES
// ============================================================================

const GAME_MODES = {
  SURVIVAL: {
    name: 'SURVIVAL',
    description: 'Endless mode - words get harder, speed increases',
    hasTimer: false,
    hasLives: true,
    initialLives: 3,
    speedIncrease: true,
    difficultyProgression: true
  },

  TIME_ATTACK: {
    name: 'TIME ATTACK',
    description: '60 seconds - maximize your score!',
    hasTimer: true,
    duration: 60000,
    hasLives: false,
    speedIncrease: false,
    difficultyProgression: false
  },

  PERFECT_RUN: {
    name: 'PERFECT RUN',
    description: 'One mistake = Game Over. How far can you go?',
    hasTimer: false,
    hasLives: true,
    initialLives: 1,
    speedIncrease: true,
    difficultyProgression: true
  },

  BOSS_BATTLE: {
    name: 'BOSS BATTLE',
    description: 'Defeat ASCII art bosses by typing their attacks!',
    hasTimer: false,
    hasLives: true,
    initialLives: 5,
    speedIncrease: false,
    difficultyProgression: false,
    isBossBattle: true
  }
};

// ============================================================================
// GAME ENGINE
// ============================================================================

class GameEngine extends EventEmitter {
  constructor(options = {}) {
    super();

    this.options = {
      wordQueueSize: 5,
      basePointsPerChar: 10,
      comboFeverThreshold: 50,
      feverMultiplier: 2,
      maxComboMultiplier: 10,
      wpmWindow: 5000, // 5 second rolling window for WPM
      ...options
    };

    this.reset();
  }

  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------

  reset() {
    this.state = {
      // Game state
      isRunning: false,
      isPaused: false,
      gameMode: null,

      // Scoring
      score: 0,
      combo: 0,
      maxCombo: 0,
      multiplier: 1,
      isFeverMode: false,

      // Progress
      level: 1,
      wordsCompleted: 0,
      totalCharsTyped: 0,
      correctChars: 0,
      incorrectChars: 0,

      // Lives (for applicable modes)
      lives: 0,
      maxLives: 0,

      // Timer
      timeRemaining: 0,
      startTime: 0,
      elapsedTime: 0,

      // Word management
      currentWord: null,
      currentWordIndex: 0,
      wordQueue: [],

      // WPM tracking
      keystrokeTimestamps: [],
      wpm: 0,
      peakWpm: 0,

      // Difficulty
      currentDifficulty: 'easy',
      wordSpeed: 1.0, // Multiplier for word spawn rate

      // Boss battle
      currentBoss: null,
      bossHp: 0,
      bossMaxHp: 0,
      bossAttackTimer: null,
      bossLevel: 0,

      // Statistics
      stats: {
        totalGames: 0,
        totalScore: 0,
        totalWords: 0,
        totalChars: 0,
        bestCombo: 0,
        bestWpm: 0,
        bossesDefeated: 0
      }
    };

    this.timers = {
      game: null,
      wpm: null,
      difficulty: null,
      bossAttack: null
    };
  }

  getState() {
    return { ...this.state };
  }

  // --------------------------------------------------------------------------
  // GAME LIFECYCLE
  // --------------------------------------------------------------------------

  startGame(mode) {
    if (!GAME_MODES[mode]) {
      throw new Error(`Unknown game mode: ${mode}`);
    }

    this.reset();
    const modeConfig = GAME_MODES[mode];

    this.state.gameMode = mode;
    this.state.isRunning = true;
    this.state.startTime = Date.now();

    // Initialize lives
    if (modeConfig.hasLives) {
      this.state.lives = modeConfig.initialLives;
      this.state.maxLives = modeConfig.initialLives;
    }

    // Initialize timer for time attack
    if (modeConfig.hasTimer) {
      this.state.timeRemaining = modeConfig.duration;
      this.startTimer();
    }

    // Start WPM tracking
    this.startWpmTracking();

    // Start difficulty progression for applicable modes
    if (modeConfig.difficultyProgression) {
      this.startDifficultyProgression();
    }

    // Initialize boss battle
    if (modeConfig.isBossBattle) {
      this.initBossBattle(1);
    } else {
      // Fill initial word queue
      this.fillWordQueue();
      this.nextWord();
    }

    this.emit('gameStart', { mode, config: modeConfig });
    this.emit('stateChange', this.getState());
  }

  pauseGame() {
    if (!this.state.isRunning || this.state.isPaused) return;

    this.state.isPaused = true;
    this.stopAllTimers();

    this.emit('gamePause', {});
    this.emit('stateChange', this.getState());
  }

  resumeGame() {
    if (!this.state.isRunning || !this.state.isPaused) return;

    this.state.isPaused = false;

    const modeConfig = GAME_MODES[this.state.gameMode];

    if (modeConfig.hasTimer) {
      this.startTimer();
    }

    this.startWpmTracking();

    if (modeConfig.difficultyProgression) {
      this.startDifficultyProgression();
    }

    if (this.state.currentBoss) {
      this.startBossAttackTimer();
    }

    this.emit('gameResume', {});
    this.emit('stateChange', this.getState());
  }

  endGame(reason = 'unknown') {
    if (!this.state.isRunning) return;

    this.state.isRunning = false;
    this.state.elapsedTime = Date.now() - this.state.startTime;

    this.stopAllTimers();

    // Calculate final stats
    const finalStats = this.calculateFinalStats();

    // Update persistent stats
    this.state.stats.totalGames++;
    this.state.stats.totalScore += this.state.score;
    this.state.stats.totalWords += this.state.wordsCompleted;
    this.state.stats.totalChars += this.state.totalCharsTyped;
    this.state.stats.bestCombo = Math.max(this.state.stats.bestCombo, this.state.maxCombo);
    this.state.stats.bestWpm = Math.max(this.state.stats.bestWpm, this.state.peakWpm);

    this.emit('gameOver', { reason, stats: finalStats });
    this.emit('stateChange', this.getState());
  }

  // --------------------------------------------------------------------------
  // INPUT HANDLING
  // --------------------------------------------------------------------------

  processKeystroke(char) {
    if (!this.state.isRunning || this.state.isPaused || !this.state.currentWord) {
      return { accepted: false, reason: 'game_not_active' };
    }

    const expectedChar = this.state.currentWord[this.state.currentWordIndex];
    const isCorrect = char === expectedChar;

    this.state.totalCharsTyped++;
    this.state.keystrokeTimestamps.push(Date.now());

    if (isCorrect) {
      return this.handleCorrectKeystroke(char);
    } else {
      return this.handleIncorrectKeystroke(char, expectedChar);
    }
  }

  handleCorrectKeystroke(char) {
    this.state.correctChars++;
    this.state.currentWordIndex++;

    // Update combo
    this.state.combo++;
    this.state.maxCombo = Math.max(this.state.maxCombo, this.state.combo);
    this.updateMultiplier();

    // Check for fever mode
    const wasFeverMode = this.state.isFeverMode;
    this.state.isFeverMode = this.state.combo >= this.options.comboFeverThreshold;

    if (this.state.isFeverMode && !wasFeverMode) {
      this.emit('feverModeStart', { combo: this.state.combo });
    }

    // Calculate points
    const points = this.calculatePoints(char);
    this.state.score += points;

    // Check if word completed
    const wordCompleted = this.state.currentWordIndex >= this.state.currentWord.length;

    if (wordCompleted) {
      this.handleWordComplete();
    }

    this.emit('correctKeystroke', {
      char,
      combo: this.state.combo,
      points,
      wordCompleted,
      position: this.state.currentWordIndex - 1
    });

    this.emit('scoreChange', { score: this.state.score, points });
    this.emit('comboChange', { combo: this.state.combo, multiplier: this.state.multiplier });
    this.emit('stateChange', this.getState());

    return {
      accepted: true,
      correct: true,
      points,
      wordCompleted,
      combo: this.state.combo
    };
  }

  handleIncorrectKeystroke(char, expected) {
    this.state.incorrectChars++;

    // Break combo
    const previousCombo = this.state.combo;
    this.state.combo = 0;
    this.state.multiplier = 1;

    // Exit fever mode
    if (this.state.isFeverMode) {
      this.state.isFeverMode = false;
      this.emit('feverModeEnd', { previousCombo });
    }

    // Handle mode-specific consequences
    const modeConfig = GAME_MODES[this.state.gameMode];
    let gameOver = false;

    if (modeConfig.hasLives) {
      this.state.lives--;
      this.emit('lifeLost', { livesRemaining: this.state.lives });

      if (this.state.lives <= 0) {
        gameOver = true;
        this.endGame('no_lives');
      }
    }

    this.emit('incorrectKeystroke', {
      char,
      expected,
      previousCombo,
      livesRemaining: this.state.lives
    });

    this.emit('comboChange', { combo: 0, multiplier: 1, broken: true });
    this.emit('stateChange', this.getState());

    return {
      accepted: true,
      correct: false,
      expected,
      gameOver,
      previousCombo
    };
  }

  // --------------------------------------------------------------------------
  // WORD MANAGEMENT
  // --------------------------------------------------------------------------

  generateWord() {
    const difficulty = this.state.currentDifficulty;
    let wordPool;

    // Select word pool based on difficulty and level
    if (this.state.level % 3 === 0 && this.state.level > 0) {
      // Every 3rd level, use programming keywords
      wordPool = WORD_BANKS.programming;
    } else if (this.state.level >= 15) {
      // High levels can include gibberish
      wordPool = [...WORD_BANKS[difficulty], ...this.generateGibberishWords(3)];
    } else {
      wordPool = WORD_BANKS[difficulty];
    }

    // Pick random word
    const word = wordPool[Math.floor(Math.random() * wordPool.length)];

    return word;
  }

  generateGibberishWords(count) {
    const words = [];
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const symbols = '!@#$%^&*(){}[]|;:,.<>?';

    for (let i = 0; i < count; i++) {
      const length = 8 + Math.floor(Math.random() * 12);
      let word = '';

      for (let j = 0; j < length; j++) {
        // 80% letters, 20% symbols
        if (Math.random() < 0.8) {
          word += chars[Math.floor(Math.random() * chars.length)];
        } else {
          word += symbols[Math.floor(Math.random() * symbols.length)];
        }
      }

      words.push(word);
    }

    return words;
  }

  fillWordQueue() {
    while (this.state.wordQueue.length < this.options.wordQueueSize) {
      this.state.wordQueue.push(this.generateWord());
    }
  }

  nextWord() {
    // Get next word from queue
    if (this.state.wordQueue.length > 0) {
      this.state.currentWord = this.state.wordQueue.shift();
    } else {
      this.state.currentWord = this.generateWord();
    }

    this.state.currentWordIndex = 0;

    // Refill queue
    this.fillWordQueue();

    this.emit('newWord', {
      word: this.state.currentWord,
      queue: [...this.state.wordQueue]
    });
  }

  handleWordComplete() {
    this.state.wordsCompleted++;

    // Bonus points for completing word
    const wordBonus = this.state.currentWord.length * 5 * this.state.multiplier;
    this.state.score += wordBonus;

    this.emit('wordComplete', {
      word: this.state.currentWord,
      bonus: wordBonus,
      wordsCompleted: this.state.wordsCompleted
    });

    // Check for level up (every 10 words in non-boss modes)
    if (!GAME_MODES[this.state.gameMode].isBossBattle) {
      if (this.state.wordsCompleted % 10 === 0) {
        this.levelUp();
      }
    }

    // Boss battle: damage boss
    if (this.state.currentBoss) {
      this.damageBoss(this.state.currentWord.length * 2);
    } else {
      this.nextWord();
    }
  }

  // --------------------------------------------------------------------------
  // SCORING SYSTEM
  // --------------------------------------------------------------------------

  calculatePoints(char) {
    let points = this.options.basePointsPerChar;

    // Apply combo multiplier
    points *= this.state.multiplier;

    // Apply fever mode bonus
    if (this.state.isFeverMode) {
      points *= this.options.feverMultiplier;
    }

    // WPM speed bonus (10% bonus per 10 WPM above 60)
    if (this.state.wpm > 60) {
      const wpmBonus = 1 + ((this.state.wpm - 60) / 100);
      points *= wpmBonus;
    }

    // Special character bonus
    if (/[^a-zA-Z0-9\s]/.test(char)) {
      points *= 1.5;
    }

    // Uppercase bonus
    if (char >= 'A' && char <= 'Z') {
      points *= 1.2;
    }

    return Math.floor(points);
  }

  updateMultiplier() {
    // Multiplier increases every 5 combo, caps at max
    const newMultiplier = Math.min(
      1 + Math.floor(this.state.combo / 5),
      this.options.maxComboMultiplier
    );

    if (newMultiplier !== this.state.multiplier) {
      this.state.multiplier = newMultiplier;
      this.emit('multiplierChange', { multiplier: this.state.multiplier });
    }
  }

  calculateFinalStats() {
    const accuracy = this.state.totalCharsTyped > 0
      ? (this.state.correctChars / this.state.totalCharsTyped * 100).toFixed(1)
      : 0;

    return {
      score: this.state.score,
      wordsCompleted: this.state.wordsCompleted,
      maxCombo: this.state.maxCombo,
      accuracy: parseFloat(accuracy),
      peakWpm: this.state.peakWpm,
      averageWpm: this.calculateAverageWpm(),
      totalCharsTyped: this.state.totalCharsTyped,
      correctChars: this.state.correctChars,
      incorrectChars: this.state.incorrectChars,
      level: this.state.level,
      elapsedTime: this.state.elapsedTime,
      bossesDefeated: this.state.stats.bossesDefeated
    };
  }

  // --------------------------------------------------------------------------
  // WPM TRACKING
  // --------------------------------------------------------------------------

  startWpmTracking() {
    this.timers.wpm = setInterval(() => {
      this.updateWpm();
    }, 500);
  }

  updateWpm() {
    const now = Date.now();
    const windowStart = now - this.options.wpmWindow;

    // Filter to only recent keystrokes
    this.state.keystrokeTimestamps = this.state.keystrokeTimestamps.filter(
      ts => ts > windowStart
    );

    // Calculate WPM (characters per minute / 5)
    const charsInWindow = this.state.keystrokeTimestamps.length;
    const windowMinutes = this.options.wpmWindow / 60000;

    this.state.wpm = Math.floor((charsInWindow / windowMinutes) / 5);
    this.state.peakWpm = Math.max(this.state.peakWpm, this.state.wpm);

    this.emit('wpmUpdate', { wpm: this.state.wpm, peak: this.state.peakWpm });
  }

  calculateAverageWpm() {
    if (this.state.elapsedTime === 0) return 0;

    const minutes = this.state.elapsedTime / 60000;
    const words = this.state.correctChars / 5;

    return Math.floor(words / minutes);
  }

  // --------------------------------------------------------------------------
  // TIMER MANAGEMENT
  // --------------------------------------------------------------------------

  startTimer() {
    this.timers.game = setInterval(() => {
      if (this.state.timeRemaining > 0) {
        this.state.timeRemaining -= 100;
        this.emit('timerTick', { remaining: this.state.timeRemaining });

        if (this.state.timeRemaining <= 0) {
          this.endGame('time_up');
        }
      }
    }, 100);
  }

  stopAllTimers() {
    Object.values(this.timers).forEach(timer => {
      if (timer) clearInterval(timer);
    });

    this.timers = {
      game: null,
      wpm: null,
      difficulty: null,
      bossAttack: null
    };
  }

  // --------------------------------------------------------------------------
  // DIFFICULTY PROGRESSION
  // --------------------------------------------------------------------------

  startDifficultyProgression() {
    // Increase difficulty every 30 seconds
    this.timers.difficulty = setInterval(() => {
      this.increaseDifficulty();
    }, 30000);
  }

  increaseDifficulty() {
    const difficulties = ['easy', 'medium', 'hard', 'insane'];
    const currentIndex = difficulties.indexOf(this.state.currentDifficulty);

    if (currentIndex < difficulties.length - 1) {
      this.state.currentDifficulty = difficulties[currentIndex + 1];
      this.emit('difficultyChange', { difficulty: this.state.currentDifficulty });
    }

    // Also increase word speed
    this.state.wordSpeed = Math.min(this.state.wordSpeed + 0.1, 3.0);
    this.emit('speedChange', { speed: this.state.wordSpeed });
  }

  levelUp() {
    this.state.level++;

    // Increase difficulty every 5 levels
    if (this.state.level % 5 === 0) {
      this.increaseDifficulty();
    }

    // Speed up
    if (GAME_MODES[this.state.gameMode].speedIncrease) {
      this.state.wordSpeed = Math.min(this.state.wordSpeed + 0.05, 3.0);
    }

    // Check for boss level (every 5 levels in SURVIVAL mode)
    if (this.state.gameMode === 'SURVIVAL' && this.state.level % 5 === 0) {
      const bossNumber = Math.min(Math.floor(this.state.level / 5), 5);
      this.initBossBattle(bossNumber);
    }

    this.emit('levelUp', { level: this.state.level });
    this.emit('stateChange', this.getState());
  }

  // --------------------------------------------------------------------------
  // BOSS BATTLE SYSTEM
  // --------------------------------------------------------------------------

  initBossBattle(bossNumber) {
    const boss = BOSSES[bossNumber];
    if (!boss) return;

    this.state.currentBoss = boss;
    this.state.bossHp = boss.maxHp;
    this.state.bossMaxHp = boss.maxHp;
    this.state.bossLevel = bossNumber;

    // Set first attack phrase as current word
    this.state.currentWord = this.getRandomBossPhrase();
    this.state.currentWordIndex = 0;
    this.state.wordQueue = [];

    // Start boss attack timer
    this.startBossAttackTimer();

    this.emit('bossAppear', {
      boss: {
        name: boss.name,
        ascii: boss.ascii,
        hp: boss.maxHp,
        level: bossNumber
      }
    });

    this.emit('newWord', {
      word: this.state.currentWord,
      queue: [],
      isBossAttack: true
    });
  }

  getRandomBossPhrase() {
    const phrases = this.state.currentBoss.phrases;
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  startBossAttackTimer() {
    if (this.timers.bossAttack) {
      clearInterval(this.timers.bossAttack);
    }

    this.timers.bossAttack = setInterval(() => {
      this.bossAttack();
    }, this.state.currentBoss.attackInterval);
  }

  bossAttack() {
    if (!this.state.currentBoss || !this.state.isRunning) return;

    // Boss attacks - player loses life if word not completed
    this.state.lives--;

    this.emit('bossAttack', {
      damage: 1,
      livesRemaining: this.state.lives,
      bossName: this.state.currentBoss.name
    });

    if (this.state.lives <= 0) {
      this.endGame('boss_defeated_you');
      return;
    }

    // New attack phrase
    this.state.currentWord = this.getRandomBossPhrase();
    this.state.currentWordIndex = 0;

    this.emit('newWord', {
      word: this.state.currentWord,
      queue: [],
      isBossAttack: true
    });

    this.emit('lifeLost', { livesRemaining: this.state.lives });
    this.emit('stateChange', this.getState());
  }

  damageBoss(damage) {
    if (!this.state.currentBoss) return;

    // Apply combo multiplier to damage
    const actualDamage = damage * this.state.multiplier;
    this.state.bossHp = Math.max(0, this.state.bossHp - actualDamage);

    this.emit('bossDamage', {
      damage: actualDamage,
      remainingHp: this.state.bossHp,
      maxHp: this.state.bossMaxHp
    });

    if (this.state.bossHp <= 0) {
      this.defeatBoss();
    } else {
      // Next attack phrase
      this.state.currentWord = this.getRandomBossPhrase();
      this.state.currentWordIndex = 0;

      this.emit('newWord', {
        word: this.state.currentWord,
        queue: [],
        isBossAttack: true
      });
    }

    this.emit('stateChange', this.getState());
  }

  defeatBoss() {
    // Stop boss attacks
    if (this.timers.bossAttack) {
      clearInterval(this.timers.bossAttack);
      this.timers.bossAttack = null;
    }

    // Bonus points for defeating boss
    const bossBonus = this.state.bossMaxHp * 10 * this.state.bossLevel;
    this.state.score += bossBonus;
    this.state.stats.bossesDefeated++;

    this.emit('bossDefeated', {
      boss: this.state.currentBoss.name,
      bonus: bossBonus,
      level: this.state.bossLevel
    });

    // In BOSS_BATTLE mode, check if there are more bosses
    if (this.state.gameMode === 'BOSS_BATTLE') {
      const nextBossLevel = this.state.bossLevel + 1;

      if (BOSSES[nextBossLevel]) {
        // Short delay before next boss
        setTimeout(() => {
          this.state.currentBoss = null;
          this.initBossBattle(nextBossLevel);
        }, 2000);
      } else {
        // All bosses defeated!
        this.endGame('victory');
      }
    } else {
      // Return to normal gameplay
      this.state.currentBoss = null;
      this.fillWordQueue();
      this.nextWord();
    }

    this.emit('stateChange', this.getState());
  }

  // --------------------------------------------------------------------------
  // UTILITY METHODS
  // --------------------------------------------------------------------------

  getCurrentWord() {
    return this.state.currentWord;
  }

  getCurrentProgress() {
    return {
      word: this.state.currentWord,
      typedIndex: this.state.currentWordIndex,
      typed: this.state.currentWord?.substring(0, this.state.currentWordIndex) || '',
      remaining: this.state.currentWord?.substring(this.state.currentWordIndex) || ''
    };
  }

  getAccuracy() {
    if (this.state.totalCharsTyped === 0) return 100;
    return (this.state.correctChars / this.state.totalCharsTyped * 100).toFixed(1);
  }

  getStats() {
    return { ...this.state.stats };
  }

  setWordBank(difficulty, words) {
    WORD_BANKS[difficulty] = words;
  }

  addCustomBoss(level, bossConfig) {
    BOSSES[level] = bossConfig;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GameEngine,
    GAME_MODES,
    WORD_BANKS,
    BOSSES,
    EventEmitter
  };
} else if (typeof window !== 'undefined') {
  window.GameEngine = GameEngine;
  window.GAME_MODES = GAME_MODES;
  window.WORD_BANKS = WORD_BANKS;
  window.BOSSES = BOSSES;
  window.EventEmitter = EventEmitter;
}
