import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchPersonalBest, VARIANTS } from '../lib/db'
import { formatTime, formatDate } from '../lib/supabase'

export default function PersonalBest() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('entry')
  const [initials, setInitials] = useState(['', '', ''])
  const [variant, setVariant] = useState(VARIANTS[0])
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRefs = [useRef(null), useRef(null), useRef(null)]

  function handleInitialChange(idx, e) {
    const val = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(-1)
    const next = [...initials]
    next[idx] = val
    setInitials(next)
    if (val && idx < 2) inputRefs[idx + 1].current?.focus()
  }

  function handleInitialKeyDown(idx, e) {
    if (e.key === 'Backspace' && !initials[idx] && idx > 0) {
      inputRefs[idx - 1].current?.focus()
    }
  }

  async function handleSearch() {
    const trimmed = initials.join('').trim()
    if (trimmed.length === 0) {
      setError('ENTER YOUR INITIALS')
      return
    }
    setLoading(true)
    setError('')
    try {
      const rows = await fetchPersonalBest(trimmed, variant)
      setScores(rows)
      setPhase('results')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (phase === 'entry') {
    return (
      <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="arcade-panel arcade-panel-pink" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '0.5rem',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '2px',
            marginBottom: '24px',
          }}>
            MY PERSONAL BEST
          </p>

          <h3 style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: 'clamp(0.7rem, 3vw, 1rem)',
            color: 'var(--hot-pink)',
            letterSpacing: '3px',
            marginBottom: '24px',
          }}>
            ENTER YOUR INITIALS
          </h3>

          <label style={{
            display: 'block',
            fontFamily: 'var(--font-arcade)',
            fontSize: '0.5rem',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '2px',
            marginBottom: '10px',
          }}>
            SELECT VARIANT
          </label>
          <select
            className="arcade-select"
            value={variant}
            onChange={e => setVariant(e.target.value)}
            style={{ marginBottom: '24px' }}
          >
            {VARIANTS.map(v => <option key={v} value={v}>{v}</option>)}
          </select>

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

          {error && (
            <p style={{
              fontFamily: 'var(--font-arcade)',
              fontSize: '0.5rem',
              color: 'var(--hot-pink)',
              marginTop: '16px',
              letterSpacing: '2px',
            }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '28px' }}>
            <button className="btn btn-cyan btn-small" onClick={() => navigate('/scoreboard')}>
              ← BACK
            </button>
            <button
              className="btn btn-pink"
              style={{ fontSize: '0.7rem', padding: '14px 24px' }}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? '...' : 'SEARCH'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const name = initials.join('').toUpperCase()

  return (
    <div className="page">
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '8px' }}>
        <button className="btn btn-cyan btn-small" onClick={() => navigate('/scoreboard')}>
          ← SCOREBOARD
        </button>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-arcade)',
        fontSize: 'clamp(1rem, 5vw, 1.8rem)',
        color: 'var(--yellow)',
        textAlign: 'center',
        letterSpacing: '4px',
        marginBottom: '4px',
        marginTop: '28px',
      }}>
        YOU VS YOU
      </h1>

      <p style={{
        fontFamily: 'var(--font-arcade)',
        fontSize: '0.55rem',
        color: 'var(--hot-pink)',
        letterSpacing: '3px',
        marginBottom: '4px',
      }}>
        {name}
      </p>
      <p style={{
        fontFamily: 'var(--font-arcade)',
        fontSize: '0.45rem',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: '2px',
        marginBottom: '8px',
      }}>
        {variant}
      </p>

      <div className="divider" />

      {scores.length === 0 ? (
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '0.55rem',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: '2.5',
            letterSpacing: '2px',
          }}>
            NO SCORES FOUND.<br />GET OUT THERE!
          </p>
          <button
            className="btn btn-pink btn-small"
            style={{ marginTop: '24px' }}
            onClick={() => { setInitials(['', '', '']); setPhase('entry') }}
          >
            TRY AGAIN
          </button>
        </div>
      ) : (
        <div className="arcade-panel w-full" style={{ maxWidth: '520px', overflowX: 'auto', padding: '12px' }}>
          <table className="score-table">
            <thead>
              <tr>
                <th>#</th>
                <th>TIME</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, i) => (
                <tr key={score.id} className={i === 0 ? 'rank-gold' : ''}>
                  <td style={{ paddingRight: '8px' }}>{i + 1}{i === 0 ? ' 🥇' : ''}</td>
                  <td style={{ letterSpacing: '2px', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                    {formatTime(score.time_ms)}
                  </td>
                  <td style={{ opacity: 0.7, fontSize: '0.45rem', letterSpacing: '0.5px' }}>
                    {formatDate(score.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '32px' }}>
        <button className="btn btn-start" style={{ fontSize: '0.7rem', padding: '16px 32px' }} onClick={() => navigate('/timer')}>
          ▶ PLAY AGAIN
        </button>
      </div>
    </div>
  )
}
