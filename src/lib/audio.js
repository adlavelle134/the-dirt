let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function playTone(frequency, duration, type = 'square', volume = 0.3, startTime = 0) {
  const ac = getCtx()
  const t = ac.currentTime + startTime
  const osc = ac.createOscillator()
  const gain = ac.createGain()

  osc.connect(gain)
  gain.connect(ac.destination)

  osc.type = type
  osc.frequency.setValueAtTime(frequency, t)

  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(volume, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration)

  osc.start(t)
  osc.stop(t + duration + 0.05)
}

// Countdown beep — ascending pitch per second (1=low, 5=high)
export function playCountdownBeep(second) {
  const freqs = [220, 277, 330, 392, 494]
  const freq = freqs[Math.min(second - 1, freqs.length - 1)]
  playTone(freq, 0.15, 'square', 0.35)
}

// "GO!" — two-tone flourish
export function playGoTone() {
  const ac = getCtx()
  const notes = [523, 784, 1047]
  notes.forEach((freq, i) => {
    playTone(freq, 0.25, 'square', 0.4, i * 0.12)
  })
  // Extra high sustain
  playTone(1047, 0.5, 'sine', 0.3, 0.36)
}

// Subtle tick every second while timer runs
export function playTick() {
  playTone(880, 0.04, 'sine', 0.06)
}

// Stop sound — sharp staccato blip
export function playStop() {
  const ac = getCtx()
  const t = ac.currentTime
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(440, t)
  osc.frequency.exponentialRampToValueAtTime(110, t + 0.1)
  gain.gain.setValueAtTime(0.5, t)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
  osc.start(t)
  osc.stop(t + 0.15)
}

// Victory jingle — 5-note ascending chiptune
export function playVictoryJingle() {
  const melody = [
    { freq: 523, dur: 0.12, delay: 0 },
    { freq: 659, dur: 0.12, delay: 0.13 },
    { freq: 784, dur: 0.12, delay: 0.26 },
    { freq: 1047, dur: 0.2,  delay: 0.39 },
    { freq: 1319, dur: 0.4,  delay: 0.6 },
  ]
  melody.forEach(({ freq, dur, delay }) => {
    playTone(freq, dur, 'square', 0.35, delay)
  })
  // Harmony
  const harmony = [
    { freq: 659,  dur: 0.12, delay: 0 },
    { freq: 784,  dur: 0.12, delay: 0.13 },
    { freq: 988,  dur: 0.12, delay: 0.26 },
    { freq: 1319, dur: 0.2,  delay: 0.39 },
  ]
  harmony.forEach(({ freq, dur, delay }) => {
    playTone(freq, dur, 'sine', 0.15, delay)
  })
}

// Unlock audio context on first user interaction
export function unlockAudio() {
  getCtx()
}
