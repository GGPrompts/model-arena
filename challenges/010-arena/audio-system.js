/**
 * THEATRICAL RETRO TYPING AUDIO SYSTEM
 * =====================================
 * An over-the-top audio experience for typing games.
 * Built on Web Audio API - mechanical keyboard ASMR meets arcade glory.
 */

class RetroTypingAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.initialized = false;

    // Background sound nodes
    this.crtHum = null;
    this.crtHumGain = null;
    this.heartbeat = null;
    this.heartbeatGain = null;
    this.bgMusic = null;
    this.bgMusicGain = null;

    // State tracking
    this.currentWPM = 0;
    this.currentCombo = 0;
    this.isFeverMode = false;
    this.bgMusicPlaying = false;
    this.heartbeatInterval = null;
    this.arpeggioInterval = null;

    // Musical scales for melodic sounds
    this.majorScale = [0, 2, 4, 5, 7, 9, 11, 12];
    this.pentatonic = [0, 2, 4, 7, 9, 12, 14, 16];
    this.baseFreq = 261.63; // C4
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  async initAudio() {
    if (this.initialized) return;

    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Master gain for overall volume control
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.7;
    this.masterGain.connect(this.ctx.destination);

    // Create compressor for that punchy sound
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 30;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;
    this.compressor.connect(this.masterGain);

    // Initialize continuous background sounds
    this._initCRTHum();
    this._initHeartbeat();

    this.initialized = true;
    console.log('🎵 Retro Audio System Initialized - GET READY TO TYPE!');

    return this;
  }

  _ensureContext() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ============================================
  // CRT HUM - Continuous background ambiance
  // ============================================

  _initCRTHum() {
    // Layer 1: Deep 60Hz hum
    const hum60 = this.ctx.createOscillator();
    hum60.type = 'sine';
    hum60.frequency.value = 60;

    // Layer 2: 120Hz harmonic
    const hum120 = this.ctx.createOscillator();
    hum120.type = 'sine';
    hum120.frequency.value = 120;

    // Layer 3: High frequency whine (CRT flyback)
    const humHigh = this.ctx.createOscillator();
    humHigh.type = 'sine';
    humHigh.frequency.value = 15734; // NTSC horizontal frequency

    // Noise layer for that authentic CRT crackle
    const noiseBuffer = this._createNoiseBuffer(2);
    this.crtNoise = this.ctx.createBufferSource();
    this.crtNoise.buffer = noiseBuffer;
    this.crtNoise.loop = true;

    // Filter the noise to make it more pleasant
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 3000;
    noiseFilter.Q.value = 0.5;

    // Gain nodes for mixing
    this.crtHumGain = this.ctx.createGain();
    this.crtHumGain.gain.value = 0.02; // Start quiet

    const hum60Gain = this.ctx.createGain();
    hum60Gain.gain.value = 0.4;

    const hum120Gain = this.ctx.createGain();
    hum120Gain.gain.value = 0.2;

    const humHighGain = this.ctx.createGain();
    humHighGain.gain.value = 0.03;

    this.crtNoiseGain = this.ctx.createGain();
    this.crtNoiseGain.gain.value = 0.05;

    // Connect everything
    hum60.connect(hum60Gain);
    hum120.connect(hum120Gain);
    humHigh.connect(humHighGain);
    this.crtNoise.connect(noiseFilter);
    noiseFilter.connect(this.crtNoiseGain);

    hum60Gain.connect(this.crtHumGain);
    hum120Gain.connect(this.crtHumGain);
    humHighGain.connect(this.crtHumGain);
    this.crtNoiseGain.connect(this.crtHumGain);

    this.crtHumGain.connect(this.compressor);

    // Start all oscillators
    hum60.start();
    hum120.start();
    humHigh.start();
    this.crtNoise.start();

    this.crtOscillators = [hum60, hum120, humHigh];
  }

  // ============================================
  // HEARTBEAT - Syncs to typing rhythm
  // ============================================

  _initHeartbeat() {
    this.heartbeatGain = this.ctx.createGain();
    this.heartbeatGain.gain.value = 0;
    this.heartbeatGain.connect(this.compressor);
  }

  _playHeartbeatPulse() {
    const now = this.ctx.currentTime;

    // "Lub" sound
    const lub = this.ctx.createOscillator();
    lub.type = 'sine';
    lub.frequency.value = 60;

    const lubGain = this.ctx.createGain();
    lubGain.gain.setValueAtTime(0, now);
    lubGain.gain.linearRampToValueAtTime(0.3, now + 0.02);
    lubGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    lub.connect(lubGain);
    lubGain.connect(this.heartbeatGain);

    lub.start(now);
    lub.stop(now + 0.2);

    // "Dub" sound (slightly delayed)
    const dub = this.ctx.createOscillator();
    dub.type = 'sine';
    dub.frequency.value = 50;

    const dubGain = this.ctx.createGain();
    dubGain.gain.setValueAtTime(0, now + 0.1);
    dubGain.gain.linearRampToValueAtTime(0.2, now + 0.12);
    dubGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    dub.connect(dubGain);
    dubGain.connect(this.heartbeatGain);

    dub.start(now + 0.1);
    dub.stop(now + 0.3);
  }

  _updateHeartbeatRate() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Calculate BPM based on typing speed
    // Faster typing = faster heartbeat
    const baseBPM = 60;
    const maxBPM = 180;
    const heartbeatBPM = Math.min(maxBPM, baseBPM + (this.currentWPM * 1.5));
    const intervalMs = (60 / heartbeatBPM) * 1000;

    this.heartbeatInterval = setInterval(() => {
      if (this.heartbeatGain.gain.value > 0.01) {
        this._playHeartbeatPulse();
      }
    }, intervalMs);
  }

  // ============================================
  // KEYSTROKE SOUNDS - The core experience
  // ============================================

  playKeystroke(correct = true) {
    this._ensureContext();
    const now = this.ctx.currentTime;

    if (correct) {
      this._playCorrectKeystroke(now);
    } else {
      this.playError();
    }
  }

  _playCorrectKeystroke(now) {
    // Randomization for organic feel
    const pitchVariation = 0.9 + Math.random() * 0.2;
    const timingOffset = Math.random() * 0.005;
    const attackTime = now + timingOffset;

    // Layer 1: Mechanical click (the "tick")
    const click = this.ctx.createOscillator();
    click.type = 'square';
    click.frequency.value = 3500 * pitchVariation;

    const clickFilter = this.ctx.createBiquadFilter();
    clickFilter.type = 'highpass';
    clickFilter.frequency.value = 2000;

    const clickGain = this.ctx.createGain();
    clickGain.gain.setValueAtTime(0, attackTime);
    clickGain.gain.linearRampToValueAtTime(0.15, attackTime + 0.001);
    clickGain.gain.exponentialRampToValueAtTime(0.001, attackTime + 0.03);

    click.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(this.compressor);

    click.start(attackTime);
    click.stop(attackTime + 0.05);

    // Layer 2: Thock body (the satisfying low end)
    const thock = this.ctx.createOscillator();
    thock.type = 'sine';
    thock.frequency.value = 180 * pitchVariation;

    const thockGain = this.ctx.createGain();
    thockGain.gain.setValueAtTime(0, attackTime);
    thockGain.gain.linearRampToValueAtTime(0.25, attackTime + 0.005);
    thockGain.gain.exponentialRampToValueAtTime(0.001, attackTime + 0.08);

    thock.connect(thockGain);
    thockGain.connect(this.compressor);

    thock.start(attackTime);
    thock.stop(attackTime + 0.1);

    // Layer 3: Key return spring (subtle metallic ping)
    const spring = this.ctx.createOscillator();
    spring.type = 'triangle';
    spring.frequency.value = 6000 * (0.8 + Math.random() * 0.4);

    const springGain = this.ctx.createGain();
    springGain.gain.setValueAtTime(0, attackTime + 0.015);
    springGain.gain.linearRampToValueAtTime(0.05, attackTime + 0.02);
    springGain.gain.exponentialRampToValueAtTime(0.001, attackTime + 0.06);

    spring.connect(springGain);
    springGain.connect(this.compressor);

    spring.start(attackTime + 0.015);
    spring.stop(attackTime + 0.08);

    // Layer 4: Subtle noise burst for texture
    const noiseBuffer = this._createNoiseBuffer(0.03);
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 4000;
    noiseFilter.Q.value = 1;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.08, attackTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, attackTime + 0.025);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.compressor);

    noise.start(attackTime);

    // Fever mode adds extra sparkle
    if (this.isFeverMode) {
      this._addFeverSparkle(attackTime);
    }
  }

  _addFeverSparkle(now) {
    const sparkle = this.ctx.createOscillator();
    sparkle.type = 'sine';
    sparkle.frequency.value = 2000 + Math.random() * 2000;

    const sparkleGain = this.ctx.createGain();
    sparkleGain.gain.setValueAtTime(0.1, now);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    sparkle.connect(sparkleGain);
    sparkleGain.connect(this.compressor);

    sparkle.start(now);
    sparkle.stop(now + 0.15);
  }

  // ============================================
  // ERROR SOUND - Harsh and punishing
  // ============================================

  playError() {
    this._ensureContext();
    const now = this.ctx.currentTime;

    // Layer 1: Descending sawtooth buzz
    const buzz = this.ctx.createOscillator();
    buzz.type = 'sawtooth';
    buzz.frequency.setValueAtTime(400, now);
    buzz.frequency.exponentialRampToValueAtTime(80, now + 0.3);

    const buzzGain = this.ctx.createGain();
    buzzGain.gain.setValueAtTime(0.3, now);
    buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    // Distortion for harshness
    const distortion = this.ctx.createWaveShaper();
    distortion.curve = this._makeDistortionCurve(50);

    buzz.connect(distortion);
    distortion.connect(buzzGain);
    buzzGain.connect(this.compressor);

    buzz.start(now);
    buzz.stop(now + 0.4);

    // Layer 2: Static burst
    const staticBuffer = this._createNoiseBuffer(0.2);
    const staticNoise = this.ctx.createBufferSource();
    staticNoise.buffer = staticBuffer;

    const staticFilter = this.ctx.createBiquadFilter();
    staticFilter.type = 'highpass';
    staticFilter.frequency.value = 1000;

    const staticGain = this.ctx.createGain();
    staticGain.gain.setValueAtTime(0.4, now);
    staticGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    staticNoise.connect(staticFilter);
    staticFilter.connect(staticGain);
    staticGain.connect(this.compressor);

    staticNoise.start(now);

    // Layer 3: Low thud of doom
    const doom = this.ctx.createOscillator();
    doom.type = 'sine';
    doom.frequency.setValueAtTime(100, now);
    doom.frequency.exponentialRampToValueAtTime(40, now + 0.2);

    const doomGain = this.ctx.createGain();
    doomGain.gain.setValueAtTime(0.4, now);
    doomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    doom.connect(doomGain);
    doomGain.connect(this.compressor);

    doom.start(now);
    doom.stop(now + 0.3);

    // Layer 4: Dissonant chord stab
    [150, 178, 200].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = freq;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.compressor);

      osc.start(now);
      osc.stop(now + 0.2);
    });
  }

  // ============================================
  // WORD COMPLETE - Satisfying chimes
  // ============================================

  playWordComplete(comboMultiplier = 1) {
    this._ensureContext();
    const now = this.ctx.currentTime;

    // Base ascending chime sequence
    const notes = [0, 4, 7, 12]; // Major chord arpeggio
    const baseFreq = 523.25; // C5

    notes.forEach((semitone, i) => {
      const freq = baseFreq * Math.pow(2, semitone / 12);
      const delay = i * 0.05;

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      // Add slight shimmer with second oscillator
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = freq * 2.01; // Slightly detuned octave

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.15, now + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.3);

      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0, now + delay);
      gain2.gain.linearRampToValueAtTime(0.05, now + delay + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.25);

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(this.compressor);
      gain2.connect(this.compressor);

      osc.start(now + delay);
      osc.stop(now + delay + 0.4);
      osc2.start(now + delay);
      osc2.stop(now + delay + 0.35);
    });

    // Check for combo milestone fanfares
    if (comboMultiplier >= 50) {
      this._playComboFanfare(50, now + 0.2);
    } else if (comboMultiplier >= 25) {
      this._playComboFanfare(25, now + 0.2);
    } else if (comboMultiplier >= 10) {
      this._playComboFanfare(10, now + 0.2);
    } else if (comboMultiplier >= 5) {
      this._playComboFanfare(5, now + 0.2);
    }
  }

  // ============================================
  // COMBO FANFARES - Increasingly epic
  // ============================================

  _playComboFanfare(level, startTime) {
    const fanfares = {
      5: {
        notes: [0, 4, 7],
        baseFreq: 659.25, // E5
        duration: 0.4,
        type: 'triangle'
      },
      10: {
        notes: [0, 4, 7, 12, 16],
        baseFreq: 783.99, // G5
        duration: 0.5,
        type: 'square'
      },
      25: {
        notes: [0, 4, 7, 11, 12, 16, 19],
        baseFreq: 880, // A5
        duration: 0.6,
        type: 'sawtooth'
      },
      50: {
        notes: [0, 4, 7, 11, 12, 14, 16, 19, 24],
        baseFreq: 1046.5, // C6
        duration: 0.8,
        type: 'square'
      }
    };

    const fanfare = fanfares[level];
    if (!fanfare) return;

    // Play ascending fanfare
    fanfare.notes.forEach((semitone, i) => {
      const freq = fanfare.baseFreq * Math.pow(2, semitone / 12);
      const delay = i * 0.06;

      const osc = this.ctx.createOscillator();
      osc.type = fanfare.type;
      osc.frequency.value = freq;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 3000 + (level * 100);

      const gain = this.ctx.createGain();
      const volume = 0.1 + (level / 200);
      gain.gain.setValueAtTime(0, startTime + delay);
      gain.gain.linearRampToValueAtTime(volume, startTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + delay + fanfare.duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.compressor);

      osc.start(startTime + delay);
      osc.stop(startTime + delay + fanfare.duration + 0.1);
    });

    // Add a big booming bass hit for 25+ combos
    if (level >= 25) {
      const boom = this.ctx.createOscillator();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(80, startTime);
      boom.frequency.exponentialRampToValueAtTime(40, startTime + 0.3);

      const boomGain = this.ctx.createGain();
      boomGain.gain.setValueAtTime(0.4, startTime);
      boomGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      boom.connect(boomGain);
      boomGain.connect(this.compressor);

      boom.start(startTime);
      boom.stop(startTime + 0.5);
    }

    // 50 combo gets the full treatment with reverb-like effect
    if (level === 50) {
      for (let echo = 1; echo <= 3; echo++) {
        setTimeout(() => {
          fanfare.notes.slice(-3).forEach((semitone, i) => {
            const freq = fanfare.baseFreq * Math.pow(2, semitone / 12);

            const osc = this.ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = freq;

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.05 / echo, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

            osc.connect(gain);
            gain.connect(this.compressor);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.35);
          });
        }, echo * 100);
      }
    }
  }

  // ============================================
  // SPEED MILESTONES - Dramatic whooshes
  // ============================================

  playSpeedMilestone(wpm) {
    this._ensureContext();
    const now = this.ctx.currentTime;

    const milestones = {
      30: { startFreq: 200, endFreq: 800, duration: 0.4 },
      60: { startFreq: 300, endFreq: 1200, duration: 0.5 },
      90: { startFreq: 400, endFreq: 1600, duration: 0.6 },
      120: { startFreq: 500, endFreq: 2000, duration: 0.7 }
    };

    const config = milestones[wpm];
    if (!config) return;

    // Whoosh sound - filtered noise sweep
    const noiseBuffer = this._createNoiseBuffer(config.duration + 0.2);
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 5;
    filter.frequency.setValueAtTime(config.startFreq, now);
    filter.frequency.exponentialRampToValueAtTime(config.endFreq, now + config.duration);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + config.duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + config.duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.compressor);

    noise.start(now);

    // Add tonal "power up" sweep
    const sweep = this.ctx.createOscillator();
    sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(config.startFreq / 2, now);
    sweep.frequency.exponentialRampToValueAtTime(config.endFreq / 2, now + config.duration);

    const sweepFilter = this.ctx.createBiquadFilter();
    sweepFilter.type = 'lowpass';
    sweepFilter.frequency.value = 2000;

    const sweepGain = this.ctx.createGain();
    sweepGain.gain.setValueAtTime(0, now);
    sweepGain.gain.linearRampToValueAtTime(0.15, now + config.duration * 0.2);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + config.duration);

    sweep.connect(sweepFilter);
    sweepFilter.connect(sweepGain);
    sweepGain.connect(this.compressor);

    sweep.start(now);
    sweep.stop(now + config.duration + 0.1);

    // Triumphant chord stab at the peak
    const chordTime = now + config.duration * 0.8;
    const chordFreqs = [
      config.endFreq / 4,
      config.endFreq / 4 * 1.25,
      config.endFreq / 4 * 1.5
    ];

    chordFreqs.forEach(freq => {
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = freq;

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0, chordTime);
      oscGain.gain.linearRampToValueAtTime(0.1, chordTime + 0.02);
      oscGain.gain.exponentialRampToValueAtTime(0.001, chordTime + 0.3);

      osc.connect(oscGain);
      oscGain.connect(this.compressor);

      osc.start(chordTime);
      osc.stop(chordTime + 0.4);
    });
  }

  // ============================================
  // LEVEL COMPLETE - Full retro victory fanfare
  // ============================================

  playLevelComplete() {
    this._ensureContext();
    const now = this.ctx.currentTime;

    // Classic 8-bit victory melody
    const melody = [
      { note: 0, time: 0, duration: 0.15 },      // C
      { note: 4, time: 0.15, duration: 0.15 },   // E
      { note: 7, time: 0.3, duration: 0.15 },    // G
      { note: 12, time: 0.45, duration: 0.15 },  // C (octave)
      { note: 9, time: 0.6, duration: 0.15 },    // A
      { note: 12, time: 0.75, duration: 0.15 },  // C
      { note: 16, time: 0.9, duration: 0.5 },    // E (high)
    ];

    const baseFreq = 523.25; // C5

    // Lead melody
    melody.forEach(({ note, time, duration }) => {
      const freq = baseFreq * Math.pow(2, note / 12);

      // Main voice
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = freq;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.2, now + time + 0.01);
      gain.gain.setValueAtTime(0.2, now + time + duration - 0.02);
      gain.gain.linearRampToValueAtTime(0.001, now + time + duration);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.compressor);

      osc.start(now + time);
      osc.stop(now + time + duration + 0.05);

      // Harmony voice (fifth below)
      if (time >= 0.45) {
        const harmonyOsc = this.ctx.createOscillator();
        harmonyOsc.type = 'square';
        harmonyOsc.frequency.value = freq / 1.5;

        const harmonyGain = this.ctx.createGain();
        harmonyGain.gain.setValueAtTime(0, now + time);
        harmonyGain.gain.linearRampToValueAtTime(0.1, now + time + 0.01);
        harmonyGain.gain.setValueAtTime(0.1, now + time + duration - 0.02);
        harmonyGain.gain.linearRampToValueAtTime(0.001, now + time + duration);

        harmonyOsc.connect(filter);
        filter.connect(harmonyGain);
        harmonyGain.connect(this.compressor);

        harmonyOsc.start(now + time);
        harmonyOsc.stop(now + time + duration + 0.05);
      }
    });

    // Bass line
    const bassNotes = [
      { note: -12, time: 0, duration: 0.3 },
      { note: -12, time: 0.45, duration: 0.3 },
      { note: -5, time: 0.9, duration: 0.5 },
    ];

    bassNotes.forEach(({ note, time, duration }) => {
      const freq = baseFreq * Math.pow(2, note / 12);

      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);

      osc.connect(gain);
      gain.connect(this.compressor);

      osc.start(now + time);
      osc.stop(now + time + duration + 0.1);
    });

    // Final cymbal crash
    const crashBuffer = this._createNoiseBuffer(1.5);
    const crash = this.ctx.createBufferSource();
    crash.buffer = crashBuffer;

    const crashFilter = this.ctx.createBiquadFilter();
    crashFilter.type = 'highpass';
    crashFilter.frequency.value = 3000;

    const crashGain = this.ctx.createGain();
    crashGain.gain.setValueAtTime(0, now + 0.9);
    crashGain.gain.linearRampToValueAtTime(0.3, now + 0.92);
    crashGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    crash.connect(crashFilter);
    crashFilter.connect(crashGain);
    crashGain.connect(this.compressor);

    crash.start(now + 0.9);

    // Sparkle effect at the end
    for (let i = 0; i < 8; i++) {
      const sparkleTime = now + 1.0 + (i * 0.05);
      const sparkleFreq = 2000 + Math.random() * 2000;

      const sparkle = this.ctx.createOscillator();
      sparkle.type = 'sine';
      sparkle.frequency.value = sparkleFreq;

      const sparkleGain = this.ctx.createGain();
      sparkleGain.gain.setValueAtTime(0.08, sparkleTime);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, sparkleTime + 0.2);

      sparkle.connect(sparkleGain);
      sparkleGain.connect(this.compressor);

      sparkle.start(sparkleTime);
      sparkle.stop(sparkleTime + 0.25);
    }
  }

  // ============================================
  // LEVEL FAIL - Dramatic doom sequence
  // ============================================

  playLevelFail() {
    this._ensureContext();
    const now = this.ctx.currentTime;

    // Descending doom notes
    const doomNotes = [
      { note: 0, time: 0 },
      { note: -1, time: 0.2 },
      { note: -3, time: 0.4 },
      { note: -5, time: 0.6 },
      { note: -7, time: 0.8 },
      { note: -12, time: 1.0 },
    ];

    const baseFreq = 261.63; // C4

    doomNotes.forEach(({ note, time }, i) => {
      const freq = baseFreq * Math.pow(2, note / 12);

      // Main doom voice
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2000, now + time);
      filter.frequency.exponentialRampToValueAtTime(200, now + time + 0.3);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.25, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.compressor);

      osc.start(now + time);
      osc.stop(now + time + 0.4);

      // Dissonant second voice
      const dissonant = this.ctx.createOscillator();
      dissonant.type = 'square';
      dissonant.frequency.value = freq * 1.059; // Minor second

      const dissonantGain = this.ctx.createGain();
      dissonantGain.gain.setValueAtTime(0, now + time);
      dissonantGain.gain.linearRampToValueAtTime(0.1, now + time + 0.02);
      dissonantGain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.25);

      dissonant.connect(dissonantGain);
      dissonantGain.connect(this.compressor);

      dissonant.start(now + time);
      dissonant.stop(now + time + 0.3);
    });

    // Final impact
    const impact = this.ctx.createOscillator();
    impact.type = 'sine';
    impact.frequency.setValueAtTime(60, now + 1.0);
    impact.frequency.exponentialRampToValueAtTime(20, now + 1.8);

    const impactGain = this.ctx.createGain();
    impactGain.gain.setValueAtTime(0.5, now + 1.0);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    impact.connect(impactGain);
    impactGain.connect(this.compressor);

    impact.start(now + 1.0);
    impact.stop(now + 2.1);

    // Static/glitch effect
    const staticBuffer = this._createNoiseBuffer(0.8);
    const staticNoise = this.ctx.createBufferSource();
    staticNoise.buffer = staticBuffer;

    const staticGain = this.ctx.createGain();
    staticGain.gain.setValueAtTime(0, now + 1.0);
    staticGain.gain.linearRampToValueAtTime(0.3, now + 1.05);
    staticGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    staticNoise.connect(staticGain);
    staticGain.connect(this.compressor);

    staticNoise.start(now + 1.0);

    // Sad trombone-esque descending tone
    const sadTone = this.ctx.createOscillator();
    sadTone.type = 'triangle';
    sadTone.frequency.setValueAtTime(300, now + 1.2);
    sadTone.frequency.exponentialRampToValueAtTime(100, now + 2.0);

    const sadGain = this.ctx.createGain();
    sadGain.gain.setValueAtTime(0.15, now + 1.2);
    sadGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    const vibrato = this.ctx.createOscillator();
    vibrato.frequency.value = 5;
    const vibratoGain = this.ctx.createGain();
    vibratoGain.gain.value = 10;

    vibrato.connect(vibratoGain);
    vibratoGain.connect(sadTone.frequency);

    sadTone.connect(sadGain);
    sadGain.connect(this.compressor);

    vibrato.start(now + 1.2);
    sadTone.start(now + 1.2);
    vibrato.stop(now + 2.1);
    sadTone.stop(now + 2.1);
  }

  // ============================================
  // FEVER MODE - Explosive activation
  // ============================================

  triggerFeverMode() {
    this._ensureContext();
    const now = this.ctx.currentTime;

    if (this.isFeverMode) return;
    this.isFeverMode = true;

    // EXPLOSION sound
    // Layer 1: Initial burst
    const burstBuffer = this._createNoiseBuffer(0.5);
    const burst = this.ctx.createBufferSource();
    burst.buffer = burstBuffer;

    const burstFilter = this.ctx.createBiquadFilter();
    burstFilter.type = 'lowpass';
    burstFilter.frequency.setValueAtTime(8000, now);
    burstFilter.frequency.exponentialRampToValueAtTime(200, now + 0.5);

    const burstGain = this.ctx.createGain();
    burstGain.gain.setValueAtTime(0.6, now);
    burstGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    burst.connect(burstFilter);
    burstFilter.connect(burstGain);
    burstGain.connect(this.compressor);

    burst.start(now);

    // Layer 2: Rising synth sweep
    const sweep = this.ctx.createOscillator();
    sweep.type = 'sawtooth';
    sweep.frequency.setValueAtTime(100, now);
    sweep.frequency.exponentialRampToValueAtTime(2000, now + 0.3);

    const sweepFilter = this.ctx.createBiquadFilter();
    sweepFilter.type = 'lowpass';
    sweepFilter.frequency.setValueAtTime(500, now);
    sweepFilter.frequency.exponentialRampToValueAtTime(4000, now + 0.3);

    const sweepGain = this.ctx.createGain();
    sweepGain.gain.setValueAtTime(0.3, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    sweep.connect(sweepFilter);
    sweepFilter.connect(sweepGain);
    sweepGain.connect(this.compressor);

    sweep.start(now);
    sweep.stop(now + 0.4);

    // Layer 3: Power chord
    const chordFreqs = [130.81, 196, 261.63, 329.63]; // C power chord with octave
    chordFreqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = freq;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now + 0.1);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.12);
      gain.gain.setValueAtTime(0.15, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.compressor);

      osc.start(now + 0.1);
      osc.stop(now + 0.85);
    });

    // Layer 4: "FEVER" voice-like synth
    const voiceFreqs = [400, 350, 500, 400, 300];
    const voiceTimes = [0.3, 0.45, 0.55, 0.65, 0.8];

    voiceFreqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;

      const formant = this.ctx.createBiquadFilter();
      formant.type = 'bandpass';
      formant.frequency.value = freq * 3;
      formant.Q.value = 5;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now + voiceTimes[i]);
      gain.gain.linearRampToValueAtTime(0.1, now + voiceTimes[i] + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + voiceTimes[i] + 0.12);

      osc.connect(formant);
      formant.connect(gain);
      gain.connect(this.compressor);

      osc.start(now + voiceTimes[i]);
      osc.stop(now + voiceTimes[i] + 0.15);
    });

    // Increase CRT intensity during fever mode
    if (this.crtHumGain) {
      this.crtHumGain.gain.linearRampToValueAtTime(0.08, now + 0.5);
    }

    // Visual feedback timing hint
    console.log('🔥 FEVER MODE ACTIVATED!');
  }

  deactivateFeverMode() {
    this._ensureContext();
    const now = this.ctx.currentTime;

    if (!this.isFeverMode) return;
    this.isFeverMode = false;

    // Wind-down sound
    const windDown = this.ctx.createOscillator();
    windDown.type = 'sawtooth';
    windDown.frequency.setValueAtTime(1000, now);
    windDown.frequency.exponentialRampToValueAtTime(100, now + 0.5);

    const windDownGain = this.ctx.createGain();
    windDownGain.gain.setValueAtTime(0.15, now);
    windDownGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    windDown.connect(windDownGain);
    windDownGain.connect(this.compressor);

    windDown.start(now);
    windDown.stop(now + 0.55);

    // Restore normal CRT level
    if (this.crtHumGain) {
      this.crtHumGain.gain.linearRampToValueAtTime(0.02, now + 0.5);
    }

    console.log('💨 Fever mode ended');
  }

  // ============================================
  // BACKGROUND MUSIC - Procedural arpeggios
  // ============================================

  startBackgroundMusic() {
    this._ensureContext();

    if (this.bgMusicPlaying) return;
    this.bgMusicPlaying = true;

    // Create gain node for music
    this.bgMusicGain = this.ctx.createGain();
    this.bgMusicGain.gain.value = 0.08;
    this.bgMusicGain.connect(this.compressor);

    // Chord progression (I - V - vi - IV in C)
    const chordProgressions = [
      [0, 4, 7],     // C major
      [7, 11, 14],   // G major
      [9, 12, 16],   // A minor
      [5, 9, 12],    // F major
    ];

    let chordIndex = 0;
    let noteIndex = 0;
    let baseInterval = 200; // Starting tempo in ms

    const playArpeggioNote = () => {
      if (!this.bgMusicPlaying) return;

      const chord = chordProgressions[chordIndex];
      const note = chord[noteIndex % chord.length];
      const octaveShift = Math.floor(noteIndex / chord.length) % 2;
      const freq = this.baseFreq * Math.pow(2, (note + octaveShift * 12) / 12);

      const now = this.ctx.currentTime;

      // Main arpeggio voice
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.bgMusicGain);

      osc.start(now);
      osc.stop(now + 0.2);

      // Subtle bass on root notes
      if (noteIndex === 0) {
        const bass = this.ctx.createOscillator();
        bass.type = 'sine';
        bass.frequency.value = freq / 2;

        const bassGain = this.ctx.createGain();
        bassGain.gain.setValueAtTime(0.1, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        bass.connect(bassGain);
        bassGain.connect(this.bgMusicGain);

        bass.start(now);
        bass.stop(now + 0.35);
      }

      noteIndex++;
      if (noteIndex >= 6) { // 6 notes per chord
        noteIndex = 0;
        chordIndex = (chordIndex + 1) % chordProgressions.length;
      }

      // Calculate next interval based on WPM
      const speedFactor = Math.max(0.3, 1 - (this.currentWPM / 150));
      const nextInterval = baseInterval * speedFactor;

      this.arpeggioInterval = setTimeout(playArpeggioNote, nextInterval);
    };

    playArpeggioNote();
    console.log('🎵 Background music started');
  }

  stopBackgroundMusic() {
    this.bgMusicPlaying = false;

    if (this.arpeggioInterval) {
      clearTimeout(this.arpeggioInterval);
      this.arpeggioInterval = null;
    }

    // Fade out music gain
    if (this.bgMusicGain && this.ctx) {
      this.bgMusicGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    }

    console.log('🔇 Background music stopped');
  }

  // ============================================
  // INTENSITY CONTROL - Dynamic sound adjustment
  // ============================================

  setIntensity(wpm, combo) {
    this._ensureContext();

    const previousWPM = this.currentWPM;
    this.currentWPM = wpm;
    this.currentCombo = combo;

    // Check for speed milestones
    const milestones = [30, 60, 90, 120];
    milestones.forEach(milestone => {
      if (previousWPM < milestone && wpm >= milestone) {
        this.playSpeedMilestone(milestone);
      }
    });

    // Adjust CRT hum intensity (louder with speed)
    if (this.crtHumGain) {
      const humLevel = 0.02 + (wpm / 150) * 0.06;
      this.crtHumGain.gain.linearRampToValueAtTime(
        Math.min(humLevel, 0.1),
        this.ctx.currentTime + 0.1
      );
    }

    // Adjust CRT noise (more static at high speed)
    if (this.crtNoiseGain) {
      const noiseLevel = 0.03 + (wpm / 120) * 0.07;
      this.crtNoiseGain.gain.linearRampToValueAtTime(
        Math.min(noiseLevel, 0.12),
        this.ctx.currentTime + 0.1
      );
    }

    // Adjust heartbeat intensity based on combo
    if (this.heartbeatGain) {
      const heartbeatLevel = Math.min(0.3, combo * 0.015);
      this.heartbeatGain.gain.linearRampToValueAtTime(
        heartbeatLevel,
        this.ctx.currentTime + 0.1
      );
      this._updateHeartbeatRate();
    }

    // Auto-trigger fever mode at high combo
    if (combo >= 20 && !this.isFeverMode) {
      this.triggerFeverMode();
    } else if (combo < 10 && this.isFeverMode) {
      this.deactivateFeverMode();
    }

    // Adjust background music volume based on intensity
    if (this.bgMusicGain) {
      const musicLevel = 0.05 + (wpm / 200) * 0.1;
      this.bgMusicGain.gain.linearRampToValueAtTime(
        Math.min(musicLevel, 0.15),
        this.ctx.currentTime + 0.2
      );
    }
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  _createNoiseBuffer(duration) {
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  _makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    return curve;
  }

  // ============================================
  // CLEANUP
  // ============================================

  dispose() {
    this.stopBackgroundMusic();

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    if (this.crtOscillators) {
      this.crtOscillators.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
    }

    if (this.crtNoise) {
      try { this.crtNoise.stop(); } catch (e) {}
    }

    if (this.ctx) {
      this.ctx.close();
    }

    this.initialized = false;
    console.log('🔌 Audio system disposed');
  }

  // Set master volume (0-1)
  setVolume(level) {
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(
        Math.max(0, Math.min(1, level)),
        this.ctx.currentTime + 0.1
      );
    }
  }
}

// ============================================
// MODULE EXPORTS
// ============================================

// Singleton instance
let audioInstance = null;

export async function initAudio() {
  if (!audioInstance) {
    audioInstance = new RetroTypingAudio();
  }
  await audioInstance.initAudio();
  return audioInstance;
}

export function playKeystroke(correct = true) {
  audioInstance?.playKeystroke(correct);
}

export function playWordComplete(comboMultiplier = 1) {
  audioInstance?.playWordComplete(comboMultiplier);
}

export function playError() {
  audioInstance?.playError();
}

export function playLevelComplete() {
  audioInstance?.playLevelComplete();
}

export function playLevelFail() {
  audioInstance?.playLevelFail();
}

export function setIntensity(wpm, combo) {
  audioInstance?.setIntensity(wpm, combo);
}

export function startBackgroundMusic() {
  audioInstance?.startBackgroundMusic();
}

export function stopBackgroundMusic() {
  audioInstance?.stopBackgroundMusic();
}

export function triggerFeverMode() {
  audioInstance?.triggerFeverMode();
}

export function deactivateFeverMode() {
  audioInstance?.deactivateFeverMode();
}

export function setVolume(level) {
  audioInstance?.setVolume(level);
}

export function dispose() {
  audioInstance?.dispose();
  audioInstance = null;
}

// Also export the class for advanced usage
export { RetroTypingAudio };

// Default export for convenience
export default {
  initAudio,
  playKeystroke,
  playWordComplete,
  playError,
  playLevelComplete,
  playLevelFail,
  setIntensity,
  startBackgroundMusic,
  stopBackgroundMusic,
  triggerFeverMode,
  deactivateFeverMode,
  setVolume,
  dispose
};
