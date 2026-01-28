#!/usr/bin/env node
/**
 * RETRO TYPING ARENA - TERMINAL DEMO
 * Interactive demo of the game engine
 *
 * Run with: node demo.js
 */

const readline = require('readline');
const { GameEngine, GAME_MODES } = require('./game-engine.js');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m'
};

// Clear screen
function clearScreen() {
  process.stdout.write('\x1b[2J\x1b[H');
}

// Move cursor
function moveCursor(row, col) {
  process.stdout.write(`\x1b[${row};${col}H`);
}

// ============================================================================
// GAME UI
// ============================================================================

class TerminalUI {
  constructor() {
    this.engine = new GameEngine();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Score changes
    this.engine.on('scoreChange', ({ score, points }) => {
      this.showFloatingText(`+${points}`, 'green');
    });

    // Combo changes
    this.engine.on('comboChange', ({ combo, multiplier, broken }) => {
      if (broken) {
        this.showFloatingText('COMBO BREAK!', 'red');
      } else if (combo > 0 && combo % 10 === 0) {
        this.showFloatingText(`${combo} COMBO!`, 'yellow');
      }
    });

    // Fever mode
    this.engine.on('feverModeStart', () => {
      this.showFloatingText('FEVER MODE!!!', 'magenta');
    });

    this.engine.on('feverModeEnd', () => {
      this.showFloatingText('FEVER OVER', 'dim');
    });

    // Level up
    this.engine.on('levelUp', ({ level }) => {
      this.showFloatingText(`LEVEL ${level}!`, 'cyan');
    });

    // Life lost
    this.engine.on('lifeLost', ({ livesRemaining }) => {
      this.showFloatingText(`-1 LIFE (${livesRemaining} left)`, 'red');
    });

    // Boss events
    this.engine.on('bossAppear', ({ boss }) => {
      clearScreen();
      console.log(colors.red + colors.bright);
      console.log(boss.ascii);
      console.log(colors.reset);
      console.log(`\n${colors.yellow}${boss.name} APPEARS!${colors.reset}`);
      setTimeout(() => this.render(), 2000);
    });

    this.engine.on('bossDamage', ({ damage, remainingHp, maxHp }) => {
      const percent = Math.round((remainingHp / maxHp) * 100);
      this.showFloatingText(`HIT! -${damage} HP (${percent}%)`, 'green');
    });

    this.engine.on('bossDefeated', ({ boss, bonus }) => {
      this.showFloatingText(`${boss} DEFEATED! +${bonus}`, 'cyan');
    });

    // Game over
    this.engine.on('gameOver', ({ reason, stats }) => {
      this.showGameOver(reason, stats);
    });

    // Word events
    this.engine.on('wordComplete', ({ word, bonus }) => {
      // Render will update
    });
  }

  showFloatingText(text, color) {
    const colorCode = colors[color] || colors.white;
    console.log(`\n${colorCode}${colors.bright}>>> ${text} <<<${colors.reset}\n`);
  }

  showGameOver(reason, stats) {
    clearScreen();
    console.log(`
${colors.red}${colors.bright}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                    G A M E   O V E R                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}

${colors.yellow}Reason: ${reason}${colors.reset}

${colors.cyan}═══════════════ FINAL STATS ═══════════════${colors.reset}

  ${colors.bright}SCORE:${colors.reset}          ${stats.score.toLocaleString()}
  ${colors.bright}WORDS:${colors.reset}          ${stats.wordsCompleted}
  ${colors.bright}MAX COMBO:${colors.reset}      ${stats.maxCombo}
  ${colors.bright}ACCURACY:${colors.reset}       ${stats.accuracy}%
  ${colors.bright}PEAK WPM:${colors.reset}       ${stats.peakWpm}
  ${colors.bright}AVG WPM:${colors.reset}        ${stats.averageWpm}
  ${colors.bright}TOTAL CHARS:${colors.reset}    ${stats.totalCharsTyped}
  ${colors.bright}LEVEL:${colors.reset}          ${stats.level}
  ${colors.bright}TIME:${colors.reset}           ${(stats.elapsedTime / 1000).toFixed(1)}s

${colors.green}Press ENTER to return to menu...${colors.reset}
`);
  }

  render() {
    const state = this.engine.getState();
    if (!state.isRunning) return;

    clearScreen();

    const progress = this.engine.getCurrentProgress();

    // Header
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}  RETRO TYPING ARENA - ${state.gameMode}${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`);

    // Stats bar
    const livesDisplay = state.maxLives > 0 ? `LIVES: ${'♥'.repeat(state.lives)}${'♡'.repeat(state.maxLives - state.lives)}` : '';
    const timeDisplay = state.timeRemaining > 0 ? `TIME: ${(state.timeRemaining / 1000).toFixed(1)}s` : '';

    console.log(`\n  SCORE: ${colors.yellow}${state.score.toLocaleString().padEnd(10)}${colors.reset} LEVEL: ${colors.cyan}${state.level}${colors.reset}  ${colors.red}${livesDisplay}${colors.reset}  ${colors.magenta}${timeDisplay}${colors.reset}`);

    // Combo display
    let comboColor = colors.white;
    if (state.isFeverMode) comboColor = colors.magenta;
    else if (state.combo >= 20) comboColor = colors.yellow;
    else if (state.combo >= 10) comboColor = colors.green;

    console.log(`  COMBO: ${comboColor}${state.combo}${colors.reset} (x${state.multiplier})  WPM: ${colors.cyan}${state.wpm}${colors.reset}  ACCURACY: ${colors.green}${this.engine.getAccuracy()}%${colors.reset}`);

    // Boss HP bar
    if (state.currentBoss) {
      const hpPercent = state.bossHp / state.bossMaxHp;
      const barLength = 30;
      const filledLength = Math.round(barLength * hpPercent);
      const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
      console.log(`\n  ${colors.red}BOSS: ${state.currentBoss.name}${colors.reset}`);
      console.log(`  HP: [${colors.red}${bar}${colors.reset}] ${state.bossHp}/${state.bossMaxHp}`);
    }

    // Fever mode indicator
    if (state.isFeverMode) {
      console.log(`\n  ${colors.bgMagenta}${colors.bright} ★★★ FEVER MODE ACTIVE ★★★ ${colors.reset}`);
    }

    // Current word display
    console.log(`\n${colors.cyan}───────────────────────────────────────────────────────────${colors.reset}`);

    const typed = progress.typed;
    const remaining = progress.remaining;

    console.log(`\n  ${colors.green}${typed}${colors.reset}${colors.bright}${colors.white}${remaining}${colors.reset}\n`);

    // Difficulty indicator
    console.log(`  ${colors.dim}Difficulty: ${state.currentDifficulty.toUpperCase()} | Speed: ${state.wordSpeed.toFixed(2)}x${colors.reset}`);

    // Word queue preview
    if (state.wordQueue.length > 0 && !state.currentBoss) {
      console.log(`  ${colors.dim}Next: ${state.wordQueue.slice(0, 3).join(' | ')}${colors.reset}`);
    }

    console.log(`\n${colors.cyan}───────────────────────────────────────────────────────────${colors.reset}`);
    console.log(`  ${colors.dim}Type the word above! Press ESC to pause, CTRL+C to quit${colors.reset}`);
  }

  showMenu() {
    clearScreen();
    console.log(`
${colors.cyan}${colors.bright}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║           R E T R O   T Y P I N G   A R E N A             ║
║                                                           ║
║                  ████████████████████                     ║
║                  █ SELECT YOUR MODE █                     ║
║                  ████████████████████                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}

${colors.yellow}  [1]${colors.reset} SURVIVAL      - Endless mode, lives system
${colors.yellow}  [2]${colors.reset} TIME ATTACK   - 60 seconds, max score
${colors.yellow}  [3]${colors.reset} PERFECT RUN   - One mistake = game over
${colors.yellow}  [4]${colors.reset} BOSS BATTLE   - Defeat ASCII art bosses

${colors.yellow}  [Q]${colors.reset} Quit

${colors.green}Press a number to start...${colors.reset}
`);
  }

  start() {
    // Set up raw mode for keystroke capture
    readline.emitKeystrokeEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    this.showMenu();

    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        clearScreen();
        process.exit();
      }

      const state = this.engine.getState();

      // Menu handling
      if (!state.isRunning) {
        if (str === '1') {
          this.engine.startGame('SURVIVAL');
          this.render();
        } else if (str === '2') {
          this.engine.startGame('TIME_ATTACK');
          this.render();
        } else if (str === '3') {
          this.engine.startGame('PERFECT_RUN');
          this.render();
        } else if (str === '4') {
          this.engine.startGame('BOSS_BATTLE');
          // Boss appear event will trigger render
        } else if (str === 'q' || str === 'Q') {
          clearScreen();
          process.exit();
        } else if (key.name === 'return') {
          // Return to menu after game over
          this.showMenu();
        }
        return;
      }

      // Pause handling
      if (key.name === 'escape') {
        if (state.isPaused) {
          this.engine.resumeGame();
          this.render();
        } else {
          this.engine.pauseGame();
          console.log(`\n${colors.yellow}${colors.bright}  ═══ PAUSED ═══${colors.reset}`);
          console.log(`  ${colors.dim}Press ESC to resume${colors.reset}`);
        }
        return;
      }

      if (state.isPaused) return;

      // Game input
      if (str && str.length === 1) {
        const result = this.engine.processKeystroke(str);

        if (result.accepted) {
          if (state.isRunning) {
            this.render();
          }
        }
      }
    });

    // Periodic render for timer updates
    setInterval(() => {
      const state = this.engine.getState();
      if (state.isRunning && !state.isPaused && state.timeRemaining > 0) {
        this.render();
      }
    }, 100);
  }
}

// ============================================================================
// MAIN
// ============================================================================

const ui = new TerminalUI();
ui.start();
