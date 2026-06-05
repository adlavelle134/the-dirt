import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, formatTime, formatDate } from '../lib/supabase'

const RANK_CLASS = ['rank-gold', 'rank-silver', 'rank-bronze']
const RANK_LABEL = ['🥇', '🥈', '🥉']

export default function Scoreboard() {
  const navigate = useNavigate()
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const fetchScores = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true)
    setRefreshing(true)
    setError('')

    // Raw fetch test to bypass Supabase client
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      })
      const text = await res.text()
      if (!res.ok) {
        setError(`HTTP ${res.status}: ${text}`)
        setLoading(false)
        setRefreshing(false)
        return
      }
      const data = JSON.parse(text)
      setScores(data || [])
      setLoading(false)
      setRefreshing(false)
      return
    } catch (fetchErr) {
      setError(`FETCH ERROR: ${fetchErr.message}`)
      setLoading(false)
      setRefreshing(false)
      return
    }

    const { data, error: err } = await supabase
      .from('scores')
      .select('*')
      .order('time_ms', { ascending: true })
      .limit(50)

    if (err) {
      setError(JSON.stringify({ msg: err.message, code: err.code, details: err.details, hint: err.hint, url: import.meta.env.VITE_SUPABASE_URL }))
    } else {
      setScores(data || [])
    }
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => { fetchScores() }, [fetchScores])

  return (
    <div className="page">
      {/* Header */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <button className="btn btn-cyan btn-small" onClick={() => navigate('/')}>
          ← BACK
        </button>
        <button
          className="btn btn-purple btn-small"
          onClick={() => fetchScores(true)}
          disabled={refreshing}
          style={{ opacity: refreshing ? 0.5 : 1 }}
        >
          {refreshing ? '...' : '↻ REFRESH'}
        </button>
      </div>

      <h1 style={{
        fontFamily: 'var(--font-arcade)',
        fontSize: 'clamp(1rem, 5vw, 1.8rem)',
        color: 'var(--yellow)',
        textShadow: 'var(--glow-yellow)',
        textAlign: 'center',
        letterSpacing: '4px',
        marginBottom: '4px',
        marginTop: '8px',
      }}>
        HARDEST TO KILL
      </h1>

      <div className="divider" />

      {loading && (
        <div style={{ marginTop: '60px' }}>
          <p className="loading-text">LOADING...</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.55rem', color: 'var(--hot-pink)', letterSpacing: '2px' }}>
            {error}
          </p>
          <button className="btn btn-pink btn-small mt-4" onClick={() => fetchScores()}>RETRY</button>
        </div>
      )}

      {!loading && !error && scores.length === 0 && (
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-arcade)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', lineHeight: '2.5', letterSpacing: '2px' }}>
            NO SCORES YET.<br />BE THE FIRST!
          </p>
        </div>
      )}

      {!loading && scores.length > 0 && (
        <div className="arcade-panel w-full" style={{ maxWidth: '520px', overflowX: 'auto', padding: '12px' }}>
          <table className="score-table">
            <thead>
              <tr>
                <th>#</th>
                <th>NAME</th>
                <th>TIME</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, i) => (
                <tr key={score.id} className={i < 3 ? RANK_CLASS[i] : ''}>
                  <td style={{ paddingRight: '8px', whiteSpace: 'nowrap' }}>
                    {i + 1}{i < 3 ? ` ${RANK_LABEL[i]}` : ''}
                  </td>
                  <td style={{ letterSpacing: '3px', fontWeight: 'bold' }}>
                    {score.initials}
                  </td>
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
