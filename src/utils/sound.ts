// Lightweight Web Audio API sound synthesizer with volume & theme controls
export type SoundTheme = 'standard' | 'playful' | 'minimal';

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public volume: number = 0.6; // 0.0 to 1.0
  public theme: SoundTheme = 'standard';

  constructor() {
    try {
      const savedVolume = localStorage.getItem('toan_truc_quan_sound_volume');
      if (savedVolume !== null) this.volume = parseFloat(savedVolume);

      const savedTheme = localStorage.getItem('toan_truc_quan_sound_theme');
      if (savedTheme === 'standard' || savedTheme === 'playful' || savedTheme === 'minimal') {
        this.theme = savedTheme;
      }

      const savedEnabled = localStorage.getItem('toan_truc_quan_sound_enabled');
      if (savedEnabled !== null) this.enabled = savedEnabled === 'true';
    } catch {}
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('toan_truc_quan_sound_volume', String(this.volume));
    } catch {}
  }

  public setTheme(thm: SoundTheme) {
    this.theme = thm;
    try {
      localStorage.setItem('toan_truc_quan_sound_theme', thm);
    } catch {}
  }

  public setEnabled(en: boolean) {
    this.enabled = en;
    try {
      localStorage.setItem('toan_truc_quan_sound_enabled', String(en));
    } catch {}
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private getEffectiveGain(baseGain: number): number {
    return baseGain * this.volume;
  }

  playPop(pitch = 440) {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const waveType = this.theme === 'minimal' ? 'sine' : this.theme === 'playful' ? 'triangle' : 'sine';
      osc.type = waveType;

      const multiplier = this.theme === 'playful' ? 2 : 1.5;
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * multiplier, this.ctx.currentTime + 0.06);

      const effectiveGain = this.getEffectiveGain(0.12);
      gain.gain.setValueAtTime(effectiveGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  playSuccess() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Frequency variations based on theme
      const notes =
        this.theme === 'playful'
          ? [587.33, 739.99, 880.0, 1174.66] // D5, F#5, A5, D6
          : this.theme === 'minimal'
          ? [523.25, 659.25] // C5, E5 (short)
          : [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      const waveType = this.theme === 'minimal' ? 'sine' : 'triangle';
      const effectiveGain = this.getEffectiveGain(0.1);

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = waveType;
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(effectiveGain, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.22);
      });
    } catch {}
  }

  playClick() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const startFreq = this.theme === 'playful' ? 900 : 750;
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.03);

      const effectiveGain = this.getEffectiveGain(0.08);
      gain.gain.setValueAtTime(effectiveGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {}
  }

  playFlip() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = this.theme === 'minimal' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(350, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + 0.07);

      const effectiveGain = this.getEffectiveGain(0.09);
      gain.gain.setValueAtTime(effectiveGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {}
  }

  playError() {
    if (!this.enabled || this.volume <= 0) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = this.theme === 'minimal' ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.15);

      const effectiveGain = this.getEffectiveGain(0.1);
      gain.gain.setValueAtTime(effectiveGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }
}

export const sound = new SoundManager();
