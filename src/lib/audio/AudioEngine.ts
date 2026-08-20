export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5; // Master volume
    this.masterGain.connect(this.ctx.destination);
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getCurrentTime(): number {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  stopAll() {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
      this.masterGain = null;
    }
  }

  playPianoNote(frequency: number, startTime: number, duration: number) {
    if (!this.ctx || !this.masterGain) return;

    // Create an envelope
    const gainNode = this.ctx.createGain();
    gainNode.connect(this.masterGain);

    // Filter for a softer piano sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, startTime);
    filter.frequency.exponentialRampToValueAtTime(400, startTime + duration);
    filter.connect(gainNode);

    // Triangle wave for the body
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, startTime);
    osc1.connect(filter);

    // Sine wave for the fundamental
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency, startTime);
    osc2.connect(filter);

    // Envelope
    gainNode.gain.setValueAtTime(0, startTime);
    // Attack
    gainNode.gain.linearRampToValueAtTime(0.8, startTime + 0.02);
    // Decay
    gainNode.gain.exponentialRampToValueAtTime(0.3, startTime + 0.3);
    // Sustain -> Release
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
  }

  playClick(startTime: number) {
     if (!this.ctx || !this.masterGain) return;
     const osc = this.ctx.createOscillator();
     const gain = this.ctx.createGain();
     osc.connect(gain);
     gain.connect(this.masterGain);
     
     osc.type = 'square';
     osc.frequency.setValueAtTime(800, startTime);
     
     gain.gain.setValueAtTime(0.1, startTime);
     gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
     
     osc.start(startTime);
     osc.stop(startTime + 0.05);
  }
}

export const audioEngine = new AudioEngine();
