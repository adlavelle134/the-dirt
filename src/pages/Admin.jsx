import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, formatTime, formatDate } from '../lib/supabase'

export default function Admin() {
  const navigate = useNavigate()
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase
      .from('scores')
      .select('*')
      .order('time_ms', { ascending: true })

    if (err) setError('FAILED TO LOAD')
    else setScores(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  async function handleDelete(id) {
    setDeletingId(id)
    await supabase.from('scores').delete().eq('id', id)
    setScores(prev => prev.filter(s => s.id !== id))
    setDeletingId(null)
  }

  async function handleClearAll() {
    setConfirmClearAll(false)
    setLoading(true)
    await supabase.from('scores').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    setScores([])
    setLoading(false)
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <button className="btn btn-cyan btn-small" onClick={() => navigate('/')}>
          ← BACK
        </button>
        <button
          className="btn btn-danger btn-small"
          onClick={() => setConfirmClearAll(true)}
          style={{ borderColor: 'var(--hot-pink)', color: 'var(--hot-pink)' }}
        >
          CLEAR ALL
        </button>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-arcade)',
        fontSize: 'clamp(1rem, 4.5vw, 1.6rem)',
        color: 'var(--orange)',
        textShadow: 'var(--glow-orange)',
        textAlign: 'center',
        letterSpacing: '4px',
        marginBottom: '4px',
        marginTop: '8px',
      }}>
        ADMIN PANEL
      </h1>

      <div className="divider" />

      {loading && <p className="loading-text" style={{ marginTop: '40px' }}>LOADING...</p>}

      {error && (
        <p style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.55rem', color: 'var(--hot-pink)', marginTop: '20px', letterSpacing: '2px' }}>
          {error}
        </p>
      )}

      {!loading && (
        <div style={{ width: '100%', maxWidth: '560px', overflowX: 'auto' }}>
          <p style={{
            fontFamily: 'var(--font-arcade)',
            fontSize: '0.5rem',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '12px',
            letterSpacing: '1px',
          }}>
            {scores.length} ENTRIES TOTAL
          </p>

          {scores.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textAlign: 'center', marginTop: '40px' }}>
              NO SCORES
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>NAME</th>
                  <th>TIME</th>
                  <th>DATE</th>
                  <th>DEL</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((score, i) => (
                  <tr key={score.id}>
                    <td>{i + 1}</td>
                    <td style={{ letterSpacing: '3px' }}>{score.initials}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.6rem' }}>{formatTime(score.time_ms)}</td>
                    <td style={{ opacity: 0.6, fontSize: '0.42rem' }}>{formatDate(score.created_at)}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '6px 10px', fontSize: '0.45rem', minHeight: '32px' }}
                        onClick={() => handleDelete(score.id)}
                        disabled={deletingId === score.id}
                      >
                        {deletingId === score.id ? '...' : '✕'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Confirm Clear All Modal */}
      {confirmClearAll && (
        <div className="modal-overlay" onClick={() => setConfirmClearAll(false)}>
          <div className="modal arcade-panel arcade-panel-pink" onClick={e => e.stopPropagation()}>
            <p style={{
              fontFamily: 'var(--font-arcade)',
              fontSize: '0.6rem',
              color: 'var(--hot-pink)',
              textAlign: 'center',
              lineHeight: '2.2',
              marginBottom: '24px',
              letterSpacing: '2px',
            }}>
              DELETE ALL SCORES?<br />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.5rem' }}>THIS CANNOT BE UNDONE</span>
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-pink" style={{ flex: 1 }} onClick={handleClearAll}>
                DELETE ALL
              </button>
              <button className="btn btn-cyan" style={{ flex: 1 }} onClick={() => setConfirmClearAll(false)}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
