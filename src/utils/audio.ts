// Web Audio API Sound Synthesizer (Zero-latency, 0 external files)

class SoundFX {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mp_portfolio_sfx')
      if (saved !== null) {
        this.enabled = saved === 'true'
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public toggle(): boolean {
    this.enabled = !this.enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('mp_portfolio_sfx', String(this.enabled))
    }
    if (this.enabled) {
      this.initCtx()
      this.playHoverTick(900)
    }
    return this.enabled
  }

  // Futuristic digital tick for button/link hover
  public playHoverTick(freq = 1100) {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.ctx.currentTime + 0.025)

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.035)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Heavy mechanical bass thud for opening modals or selecting projects
  public playSelectThud() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(150, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(36, this.ctx.currentTime + 0.16)

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.2)
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // High-speed digital whoosh for section warping/transitions
  public playWarpSwoosh() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.25)
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(350, this.ctx.currentTime)
      filter.frequency.exponentialRampToValueAtTime(2800, this.ctx.currentTime + 0.12)
      filter.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.25)
      filter.Q.setValueAtTime(3.5, this.ctx.currentTime)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.16, this.ctx.currentTime + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)

      noise.start()
      noise.stop(this.ctx.currentTime + 0.26)
    } catch {
      // Fallback
    }
  }

  // High-tech terminal telemetry beep
  public playTelemetryBeep() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(1700, this.ctx.currentTime)

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.04)
    } catch {
      // Fallback
    }
  }
}

export const sfx = new SoundFX()
