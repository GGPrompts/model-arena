/**
 * GAME ENGINE TEST SUITE
 * Run with: node test-engine.js
 */

const { GameEngine, GAME_MODES, WORD_BANKS, BOSSES } = require('./game-engine.js');

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    testsPassed++;
    console.log(`  [PASS] ${message}`);
  } else {
    testsFailed++;
    console.log(`  [FAIL] ${message}`);
  }
}

function section(title) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('='.repeat(60));
}

// ============================================================================
// TESTS
// ============================================================================

section('INITIALIZATION TESTS');

(() => {
  const engine = new GameEngine();
  const state = engine.getState();

  assert(!state.isRunning, 'Engine starts in stopped state');
  assert(state.score === 0, 'Initial score is 0');
  assert(state.combo === 0, 'Initial combo is 0');
  assert(state.level === 1, 'Initial level is 1');
})();

section('GAME MODE TESTS');

// Test SURVIVAL mode
(() => {
  const engine = new GameEngine();
  engine.startGame('SURVIVAL');
  const state = engine.getState();

  assert(state.isRunning, 'SURVIVAL mode starts running');
  assert(state.gameMode === 'SURVIVAL', 'Game mode is SURVIVAL');
  assert(state.lives === 3, 'SURVIVAL mode has 3 lives');
  assert(state.currentWord !== null, 'Current word is set');
  assert(state.wordQueue.length > 0, 'Word queue is populated');

  engine.endGame('test');
})();

// Test TIME_ATTACK mode
(() => {
  const engine = new GameEngine();
  engine.startGame('TIME_ATTACK');
  const state = engine.getState();

  assert(state.isRunning, 'TIME_ATTACK mode starts running');
  assert(state.gameMode === 'TIME_ATTACK', 'Game mode is TIME_ATTACK');
  assert(state.timeRemaining === 60000, 'TIME_ATTACK has 60 second timer');
  assert(state.lives === 0, 'TIME_ATTACK has no lives');

  engine.endGame('test');
})();

// Test PERFECT_RUN mode
(() => {
  const engine = new GameEngine();
  engine.startGame('PERFECT_RUN');
  const state = engine.getState();

  assert(state.lives === 1, 'PERFECT_RUN has 1 life');

  engine.endGame('test');
})();

// Test BOSS_BATTLE mode
(() => {
  const engine = new GameEngine();
  engine.startGame('BOSS_BATTLE');
  const state = engine.getState();

  assert(state.currentBoss !== null, 'BOSS_BATTLE initializes a boss');
  assert(state.bossHp > 0, 'Boss has HP');

  engine.endGame('test');
})();

section('INPUT HANDLING TESTS');

// Test correct keystroke
(() => {
  const engine = new GameEngine();
  engine.startGame('SURVIVAL');

  const word = engine.getCurrentWord();
  const firstChar = word[0];

  const result = engine.processKeystroke(firstChar);

  assert(result.accepted, 'Correct keystroke is accepted');
  assert(result.correct, 'Correct keystroke is marked correct');
  assert(result.points > 0, 'Correct keystroke awards points');
  assert(engine.getState().combo === 1, 'Combo increases on correct keystroke');

  engine.endGame('test');
})();

// Test incorrect keystroke
(() => {
  const engine = new GameEngine();
  engine.startGame('SURVIVAL');

  const word = engine.getCurrentWord();
  // Find a character NOT in the word
  const wrongChar = word[0] === 'z' ? 'a' : 'z';

  // First build up a combo
  engine.processKeystroke(word[0]);
  const comboBeforeError = engine.getState().combo;

  // Now make an error
  const result = engine.processKeystroke(wrongChar);

  assert(result.accepted, 'Incorrect keystroke is accepted');
  assert(!result.correct, 'Incorrect keystroke is marked incorrect');
  assert(engine.getState().combo === 0, 'Combo breaks on incorrect keystroke');
  assert(engine.getState().lives === 2, 'Life lost on incorrect keystroke');

  engine.endGame('test');
})();

// Test word completion
(() => {
  const engine = new GameEngine();
  engine.startGame('SURVIVAL');

  const word = engine.getCurrentWord();
  let wordsCompleted = 0;

  engine.on('wordComplete', () => wordsCompleted++);

  // Type the entire word
  for (const char of word) {
    engine.processKeystroke(char);
  }

  assert(wordsCompleted === 1, 'Word completion event fires');
  assert(engine.getCurrentWord() !== word, 'New word after completion');

  engine.endGame('test');
})();

section('COMBO SYSTEM TESTS');

// Test combo multiplier
(() => {
  const engine = new GameEngine();
  engine.startGame('TIME_ATTACK'); // No lives to worry about

  // Type 10 correct characters to build combo
  for (let i = 0; i < 10; i++) {
    const word = engine.getCurrentWord();
    const progress = engine.getCurrentProgress();
    const nextChar = word[progress.typedIndex];
    if (nextChar) {
      engine.processKeystroke(nextChar);
    }
  }

  const state = engine.getState();
  assert(state.combo >= 10, 'Combo builds with correct keystrokes');
  assert(state.multiplier >= 2, 'Multiplier increases with combo');

  engine.endGame('test');
})();

// Test fever mode
(() => {
  const engine = new GameEngine();
  engine.startGame('TIME_ATTACK');

  let feverStarted = false;
  engine.on('feverModeStart', () => feverStarted = true);

  // Type 50 correct characters
  for (let i = 0; i < 50; i++) {
    const word = engine.getCurrentWord();
    const progress = engine.getCurrentProgress();
    const nextChar = word[progress.typedIndex];
    if (nextChar) {
      engine.processKeystroke(nextChar);
    }
  }

  const state = engine.getState();
  assert(state.isFeverMode, 'Fever mode activates at 50+ combo');
  assert(feverStarted, 'Fever mode event fires');

  engine.endGame('test');
})();

section('EVENT SYSTEM TESTS');

// Test event emission
(() => {
  const engine = new GameEngine();
  let eventsFired = [];

  engine.on('gameStart', () => eventsFired.push('gameStart'));
  engine.on('newWord', () => eventsFired.push('newWord'));
  engine.on('stateChange', () => eventsFired.push('stateChange'));

  engine.startGame('SURVIVAL');

  assert(eventsFired.includes('gameStart'), 'gameStart event fires');
  assert(eventsFired.includes('newWord'), 'newWord event fires');
  assert(eventsFired.includes('stateChange'), 'stateChange event fires');

  engine.endGame('test');
})();

// Test once() method
(() => {
  const engine = new GameEngine();
  let callCount = 0;

  engine.once('stateChange', () => callCount++);

  engine.startGame('SURVIVAL');
  engine.pauseGame();
  engine.resumeGame();

  assert(callCount === 1, 'once() only fires once');

  engine.endGame('test');
})();

section('PAUSE/RESUME TESTS');

(() => {
  const engine = new GameEngine();
  engine.startGame('TIME_ATTACK');

  engine.pauseGame();
  const pausedState = engine.getState();

  assert(pausedState.isPaused, 'Game pauses correctly');

  engine.resumeGame();
  const resumedState = engine.getState();

  assert(!resumedState.isPaused, 'Game resumes correctly');
  assert(resumedState.isRunning, 'Game still running after resume');

  engine.endGame('test');
})();

section('PERFECT RUN GAME OVER TEST');

(() => {
  const engine = new GameEngine();
  let gameOverFired = false;
  let gameOverReason = '';

  engine.on('gameOver', (data) => {
    gameOverFired = true;
    gameOverReason = data.reason;
  });

  engine.startGame('PERFECT_RUN');

  // Make one mistake
  engine.processKeystroke('~'); // Unlikely to be correct

  assert(gameOverFired, 'Game over fires on PERFECT_RUN mistake');
  assert(gameOverReason === 'no_lives', 'Game over reason is no_lives');
})();

section('BOSS BATTLE TESTS');

(() => {
  const engine = new GameEngine();
  let bossAppeared = false;
  let bossDamaged = false;

  engine.on('bossAppear', () => bossAppeared = true);
  engine.on('bossDamage', () => bossDamaged = true);

  engine.startGame('BOSS_BATTLE');

  assert(bossAppeared, 'Boss appears in BOSS_BATTLE mode');

  // Type the boss phrase
  const phrase = engine.getCurrentWord();
  for (const char of phrase) {
    engine.processKeystroke(char);
  }

  assert(bossDamaged, 'Boss takes damage when phrase completed');

  engine.endGame('test');
})();

section('STATISTICS TESTS');

(() => {
  const engine = new GameEngine();
  engine.startGame('TIME_ATTACK');

  // Type some characters
  const word = engine.getCurrentWord();
  for (const char of word) {
    engine.processKeystroke(char);
  }

  const accuracy = engine.getAccuracy();
  const progress = engine.getCurrentProgress();

  assert(parseFloat(accuracy) === 100, 'Accuracy is 100% with no errors');
  assert(engine.getState().wordsCompleted >= 1, 'Words completed tracked');

  engine.endGame('test');
})();

section('WORD GENERATION TESTS');

(() => {
  assert(WORD_BANKS.easy.length > 0, 'Easy word bank exists');
  assert(WORD_BANKS.medium.length > 0, 'Medium word bank exists');
  assert(WORD_BANKS.hard.length > 0, 'Hard word bank exists');
  assert(WORD_BANKS.insane.length > 0, 'Insane word bank exists');
  assert(WORD_BANKS.programming.length > 0, 'Programming word bank exists');
})();

section('BOSS DEFINITIONS TESTS');

(() => {
  assert(Object.keys(BOSSES).length >= 5, 'At least 5 bosses defined');
  assert(BOSSES[1].name === 'SYNTAX ERROR', 'First boss is SYNTAX ERROR');
  assert(BOSSES[5].name === 'FINAL BOSS: LEGACY CODE', 'Final boss is LEGACY CODE');

  for (const [level, boss] of Object.entries(BOSSES)) {
    assert(boss.phrases.length >= 5, `Boss ${level} has at least 5 phrases`);
    assert(boss.maxHp > 0, `Boss ${level} has HP`);
    assert(boss.ascii.length > 0, `Boss ${level} has ASCII art`);
  }
})();

section('CUSTOM WORD BANK TEST');

(() => {
  const engine = new GameEngine();
  const customWords = ['custom', 'words', 'test'];

  engine.setWordBank('easy', customWords);
  engine.startGame('SURVIVAL');

  const word = engine.getCurrentWord();
  assert(customWords.includes(word), 'Custom word bank is used');

  engine.endGame('test');

  // Restore default
  engine.setWordBank('easy', WORD_BANKS.easy);
})();

// ============================================================================
// RESULTS
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('  TEST RESULTS');
console.log('='.repeat(60));
console.log(`  PASSED: ${testsPassed}`);
console.log(`  FAILED: ${testsFailed}`);
console.log(`  TOTAL:  ${testsPassed + testsFailed}`);
console.log('='.repeat(60));

if (testsFailed > 0) {
  process.exit(1);
}
