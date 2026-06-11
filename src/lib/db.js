export async function fetchScores() {
  const res = await fetch('/api/scores')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchAllScores() {
  const res = await fetch('/api/admin')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function insertScore(initials, time_ms) {
  const res = await fetch('/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initials, time_ms }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `HTTP ${res.status}`)
  }
}

export async function deleteScore(id) {
  const res = await fetch(`/api/admin?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}

export async function deleteAllScores() {
  const res = await fetch('/api/admin?all=true', { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
}
