import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { insertScore } from '../lib/db'
import { formatTime } from '../lib/supabase'
import { playCountdownBeep, playGoTone, playTick, playStop, playVictoryJingle } from '../lib/audio'

const PHASES = { COUNTDOWN: 'countdown', RUNNING: 'running', ENTRY: 'entry', SAVING: 'saving', SAVED: 'saved' }

export default function Timer() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(PHASES.COUNTDOWN)
  const [countdown, setCountdown] = useState(5)
  const [countdownLabel, setCountdownLabel] = useState('5')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [initials, setInitials] = useState(['', '', ''])
  const [saveError, setSaveError] = useState('')
  const [showDiscard, setShowDiscard] = useState(false)

  const startTimeRef = useRef(null)
  const animFrameRef = useRef(null)
  const tickIntervalRef = useRef(null)
  const inputRefs = [useRef(null), useRef(null), useRef(null)]

  // Countdown phase
  useEffect(() => {
    if (phase !== PHASES.COUNTDOWN) return
    let remaining = 5

    const tick = () => {
      if (remaining > 0) {
        setCountdownLabel(String(remaining))
        playCountdownBeep(6 - remaining) // ascending: 1st beep=lowest
        remaining--
        setTimeout(tick, 1000)
      } else {
        setCountdownLabel('GO!')
        playGoTone()
        setTimeout(() => {
          startTimeRef.current = performance.now()
          setPhase(PHASES.RUNNING)
        }, 700)
      }
    }

    const initialDelay = setTimeout(() => {
      tick()
    }, 200)

    return () => clearTimeout(initialDelay)
  }, [phase])

  // Running phase — rAF loop + tick sound
  useEffect(() => {
    if (phase !== PHASES.RUNNING) return

    const frame = () => {
      setElapsedMs(Math.floor(performance.now() - startTimeRef.current))
      animFrameRef.current = requestAnimationFrame(frame)
    }
    animFrameRef.current = requestAnimationFrame(frame)

    let lastTick = 0
    tickIntervalRef.current = setInterval(() => {
      const now = Math.floor((performance.now() - startTimeRef.current) / 1000)
      if (now > lastTick) {
        lastTick = now
        playTick()
      }
    }, 500)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      clearInterval(tickIntervalRef.current)
    }
  }, [phase])

  const handleStop = useCallback(() => {
    const finalMs = Math.floor(performance.now() - startTimeRef.current)
    cancelAnimationFrame(animFrameRef.current)
    clearInterval(tickIntervalRef.current)
    setElapsedMs(finalMs)
    playStop()
    setPhase(PHASES.ENTRY)
    setTimeout(() => inputRefs[0].current?.focus(), 100)
  }, [])

  // Initials input handling
  function handleInitialChange(idx, e) {
    const val = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(-1)
    const next = [...initials]
    next[idx] = val
    setInitials(next)
    if (val && idx < 2) {
      inputRefs[idx + 1].current?.focus()
    }
  }

  function handleInitialKeyDown(idx, e) {
    if (e.key === 'Backspace' && !initials[idx] && idx > 0) {
      inputRefs[idx - 1].current?.focus()
    }
  }

  async function handleSubmit() {
    const trimmed = initials.join('').trim().toUpperCase()
    if (trimmed.length === 0) {
      setSaveError('ENTER YOUR INITIALS')
      return
    }
    setSaveError('')
    setPhase(PHASES.SAVING)
    playVictoryJingle()

    try {
      await insertScore(trimmed.padEnd(3, '_').slice(0, 3), elapsedMs)
    } catch (err) {
      setSaveError(err.message)
      setPhase(PHASES.ENTRY)
      return
    }

    setPhase(PHASES.SAVED)
    setTimeout(() => navigate('/scoreboard'), 2000)
  }

  function handleDiscard() {
    cancelAnimationFrame(animFrameRef.current)
    clearInterval(tickIntervalRef.current)
    navigate('/')
  }

  // ── COUNTDOWN ──
  if (phase === PHASES.COUNTDOWN) {
    const isGo = countdownLabel === 'GO!'
    return (
      <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div
          className="countdown-number"
          key={countdownLabel}
          style={{
            color: isGo ? 'var(--yellow)' : 'var(--cyan)',
            textShadow: isGo ? 'var(--glow-yellow)' : 'var(--glow-cyan)',
            fontSize: isGo ? 'clamp(3rem, 18vw, 7rem)' : 'clamp(6rem, 30vw, 12rem)',
          }}
        >
          {countdownLabel}
        </div>
        <p style={{
          fontFamily: 'var(--font-arcade)',
          fontSize: '0.5rem',
          color: 'rgba(255,255,255,0.3)',
          marginTop: '40px',
          letterSpacing: '3px',
          textAlign: 'center',
        }}>
          GET READY...
        </p>
      </div>
    )
  }

  // ── RUNNING ──
  if (phase === PHASES.RUNNING) {
    return (
      <div className="page" style={{ justifyContent: 'center', alignItems: 'center', gap: '48px' }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '0.5rem',
            color: 'var(--hot-pink)',
            textShadow: 'var(--glow-pink)',
            textAlign: 'center',
            letterSpacing: '4px',
            marginBottom: '12px',
            animation: 'blink 1s step-end infinite',
          }}>
            ● REC
          </p>
          <div className="timer-display">
            {formatTime(elapsedMs)}
          </div>
        </div>
        <button className="btn btn-pink" style={{ fontSize: '1rem', padding: '20px 48px', letterSpacing: '4px' }} onClick={handleStop}>
          ■ STOP
        </button>
      </div>
    )
  }

  // ── SCORE ENTRY ──
  if (phase === PHASES.ENTRY) {
    return (
      <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="arcade-panel arcade-panel-pink" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '0.75rem',
            color: 'var(--hot-pink)',
            textShadow: 'var(--glow-pink)',
            letterSpacing: '3px',
            marginBottom: '8px',
          }}>
            YOUR TIME
          </h2>

          <div className="timer-display" style={{ fontSize: 'clamp(1.5rem, 7vw, 2.5rem)', marginBottom: '24px' }}>
            {formatTime(elapsedMs)}
          </div>

          <div className="divider" />

          <h3 style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '0.6rem',
            color: 'var(--cyan)',
            letterSpacing: '3px',
            marginBottom: '20px',
            marginTop: '4px',
          }}>
            ENTER INITIALS
          </h3>

          <div className="initials-container">
            {[0, 1, 2].map(idx => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                className="initial-input"
                type="text"
                inputMode="text"
                maxLength={1}
                value={initials[idx]}
                onChange={e => handleInitialChange(idx, e)}
                onKeyDown={e => handleInitialKeyDown(idx, e)}
              />
            ))}
          </div>

          {saveError && (
            <p style={{
              fontFamily: 'var(--font-arcade)',
              fontSize: '0.45rem',
              color: 'var(--hot-pink)',
              marginTop: '12px',
              letterSpacing: '1px',
              lineHeight: '1.8',
              wordBreak: 'break-word',
              textAlign: 'center',
            }}>
              {saveError}
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
            <button className="btn btn-start" style={{ flex: 2, fontSize: '0.75rem', padding: '16px' }} onClick={handleSubmit}>
              SUBMIT
            </button>
            <button className="btn btn-cyan btn-small" style={{ flex: 1 }} onClick={() => setShowDiscard(true)}>
              DISCARD
            </button>
          </div>
        </div>

        {showDiscard && (
          <div className="modal-overlay" onClick={() => setShowDiscard(false)}>
            <div className="modal arcade-panel" onClick={e => e.stopPropagation()}>
              <p style={{
                fontFamily: 'var(--font-arcade)',
                fontSize: '0.6rem',
                color: 'white',
                textAlign: 'center',
                lineHeight: '2',
                marginBottom: '20px',
              }}>
                DISCARD THIS RUN?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-pink" style={{ flex: 1 }} onClick={handleDiscard}>
                  YES
                </button>
                <button className="btn btn-cyan" style={{ flex: 1 }} onClick={() => setShowDiscard(false)}>
                  NO
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── SAVING ──
  if (phase === PHASES.SAVING) {
    return (
      <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="timer-display" style={{ fontSize: 'clamp(1.5rem, 7vw, 2.5rem)', marginBottom: '24px' }}>
          {formatTime(elapsedMs)}
        </div>
        <p className="loading-text">SAVING SCORE...</p>
      </div>
    )
  }

  // ── SAVED ──
  if (phase === PHASES.SAVED) {
    return (
      <div className="page" style={{ justifyContent: 'center', alignItems: 'center', gap: '32px' }}>
        <div className="timer-display" style={{ fontSize: 'clamp(1.5rem, 7vw, 2.5rem)' }}>
          {formatTime(elapsedMs)}
        </div>
        <div className="saved-message">★ SCORE SAVED! ★</div>
        <p style={{
          fontFamily: 'var(--font-arcade)',
          fontSize: '0.5rem',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '2px',
        }}>
          LOADING SCOREBOARD...
        </p>
      </div>
    )
  }

  return null
}
