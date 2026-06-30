import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { VARIANTS } from '../lib/db'
import { unlockAudio } from '../lib/audio'

export default function SelectVariant() {
  const navigate = useNavigate()
  const [variant, setVariant] = useState(VARIANTS[0])

  function handleBegin() {
    unlockAudio()
    navigate('/timer', { state: { variant } })
  }

  return (
    <div className="page" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="arcade-panel arcade-panel-pink" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>

        <h1 style={{
          fontFamily: 'var(--font-arcade)',
          fontSize: 'clamp(0.9rem, 4vw, 1.3rem)',
          color: 'var(--yellow)',
          letterSpacing: '3px',
          marginBottom: '32px',
        }}>
          CHOOSE YOUR<br />CHALLENGE
        </h1>

        <div className="divider" />

        <label style={{
          display: 'block',
          fontFamily: 'var(--font-arcade)',
          fontSize: '0.5rem',
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '2px',
          marginBottom: '12px',
          marginTop: '24px',
        }}>
          SELECT VARIANT
        </label>

        <select
          className="arcade-select"
          value={variant}
          onChange={e => setVariant(e.target.value)}
        >
          {VARIANTS.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
          <button className="btn btn-cyan btn-small" style={{ flex: 1 }} onClick={() => navigate('/')}>
            ← BACK
          </button>
          <button className="btn btn-start" style={{ flex: 2, fontSize: '0.8rem', padding: '16px' }} onClick={handleBegin}>
            ▶ BEGIN
          </button>
        </div>

      </div>
    </div>
  )
}
