/**
 * Ancient Shiloh 3D - Biblical Web Audio Soundscape
 * Synthesizes ancient Kinnor (Hebrew harp/lyre) arpeggios, desert evening wind,
 * and sacred sanctuary chimes using Web Audio API oscillators and biquad filters.
 */

export class BiblicalAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.notes = [293.66, 329.63, 349.23, 392.00, 440.00, 523.25, 587.33]; // D4, E4, F4, G4, A4, C5, D5 (Ancient modal scale)
    this.timer = null;
    this.windNode = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Start ambient wind & harp loop
    this.startDesertWind();
    this.startKinnorHarpArpeggios();
    this.isPlaying = true;
  }

  startDesertWind() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Resonant low-pass filter to sound like gentle desert night breeze
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);

    whiteNoise.start();
    this.windNode = whiteNoise;
  }

  startKinnorHarpArpeggios() {
    if (!this.ctx) return;

    const playHarpPluck = (freq, delay = 0, duration = 2.4) => {
      const startTime = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Kinnor harp has warm, bright plucked string timbre
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Sub-harmonic overtone for resonance
      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq * 2, startTime);
      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.3, startTime);
      subOsc.connect(subGain);
      subGain.connect(gain);

      // Pluck ADSR envelope
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      subOsc.start(startTime);
      osc.stop(startTime + duration);
      subOsc.stop(startTime + duration);
    };

    // Sacred melodic progression pattern
    const patterns = [
      [0, 2, 4, 6],       // D, F, A, D
      [1, 3, 5, 4],       // E, G, C, A
      [2, 4, 5, 6],       // F, A, C, D
      [4, 3, 2, 0]        // A, G, F, D
    ];

    let patternIdx = 0;
    const loop = () => {
      if (!this.isPlaying || this.isMuted) return;

      const p = patterns[patternIdx % patterns.length];
      patternIdx++;

      p.forEach((noteIdx, i) => {
        const freq = this.notes[noteIdx % this.notes.length];
        playHarpPluck(freq, i * 0.45, 2.5);
      });

      // Occasional sanctuary chime on Root note
      if (patternIdx % 2 === 0) {
        playHarpPluck(587.33, 1.8, 3.8); // High D5 chime
      }

      this.timer = setTimeout(loop, 4000);
    };

    loop();
  }

  playPrayerChime() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const chords = [440.00, 554.37, 659.25, 880.00]; // Heavenly A Major
    chords.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 3.0);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 3.0);
    });
  }

  toggleMute() {
    if (!this.ctx) return false;
    this.isMuted = !this.isMuted;
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime);
    }
    return !this.isMuted;
  }
}
