import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { unlockAudio } from '../lib/audio'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

export default function Home() {
  const navigate = useNavigate()
  const [showOptions, setShowOptions] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  function handleStart() {
    unlockAudio()
    navigate('/timer')
  }

  function handleOptionsSubmit(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setShowOptions(false)
      setPassword('')
      setPasswordError(false)
      navigate('/admin')
    } else {
      setPasswordError(true)
      setPassword('')
    }
  }

  function closeModal() {
    setShowOptions(false)
    setPassword('')
    setPasswordError(false)
  }

  return (
    <div className="page" style={{ justifyContent: 'flex-start', minHeight: '100vh' }}>

      {/* Nav buttons — sit in the sky at the very top */}
      <div style={{ width: '100%', display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
        <button className="btn btn-cyan" onClick={() => navigate('/course')}>
          Course Details
        </button>
        <button className="btn btn-pink" onClick={() => navigate('/scoreboard')}>
          Scoreboard
        </button>
      </div>

      {/* Title — stays in the sky */}
      <div style={{ textAlign: 'center', padding: '0 8px', marginTop: '24px' }}>
        <div style={{
          display: 'inline-block',
          border: '3px solid #8b0040',
          boxShadow: '0 0 0 1px #ff2d78, 0 0 16px 2px rgba(139,0,64,0.7), inset 0 0 20px rgba(0,0,0,0.6)',
          padding: '16px 32px 20px',
          background: 'rgba(10,0,18,0.85)',
        }}>
          <h1 className="neon-title" style={{ fontSize: 'clamp(2.8rem, 12vw, 5rem)', marginBottom: '4px' }}>
            THE
          </h1>
          <h1 className="neon-title" style={{ fontSize: 'clamp(2.8rem, 12vw, 5rem)', marginBottom: 0 }}>
            DIRT
          </h1>
        </div>
      </div>

      {/* Spacer — absorbs the mountain zone */}
      <div style={{ flex: 1 }} />

      {/* Description + START + OPTIONS — in the green ground zone */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', paddingBottom: '24px' }}>

        <div className="divider" style={{ margin: '0 auto', maxWidth: '300px' }} />
        <p style={{
          fontFamily: 'var(--font-arcade)',
          fontSize: 'clamp(0.45rem, 2.2vw, 0.6rem)',
          color: 'rgba(255,255,255,0.75)',
          lineHeight: '2.2',
          maxWidth: '340px',
          margin: '0 auto',
          letterSpacing: '1px',
          textAlign: 'center',
        }}>
          Tackle 11 obstacles at Sparrow Hawk Ranch<br />
          and claim your spot as the toughest<br />
          and hardest to kill.
        </p>

        <button className="btn btn-start" onClick={handleStart}>
          ▶ START
        </button>

        <button className="btn-options" onClick={() => setShowOptions(true)}>
          OPTIONS
        </button>

      </div>

      {/* Options Modal */}
      {showOptions && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal arcade-panel arcade-panel-pink" onClick={e => e.stopPropagation()}>
            <h2 style={{
              fontFamily: 'var(--font-arcade)',
              fontSize: '0.75rem',
              color: 'var(--hot-pink)',
              textShadow: 'var(--glow-pink)',
              textAlign: 'center',
              marginBottom: '24px',
              letterSpacing: '3px',
            }}>
              ADMIN ACCESS
            </h2>

            <form onSubmit={handleOptionsSubmit}>
              <input
                className="arcade-input"
                type="password"
                placeholder="ENTER PASSWORD"
                value={password}
                onChange={e => { setPassword(e.target.value); setPasswordError(false) }}
                autoFocus
              />
              {passwordError && (
                <p style={{
                  fontFamily: 'var(--font-arcade)',
                  fontSize: '0.5rem',
                  color: 'var(--hot-pink)',
                  textAlign: 'center',
                  marginTop: '10px',
                  letterSpacing: '2px',
                }}>
                  ACCESS DENIED
                </p>
              )}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-pink w-full" style={{ flex: 1 }}>
                  ENTER
                </button>
                <button type="button" className="btn btn-cyan" onClick={closeModal} style={{ flex: 1 }}>
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
