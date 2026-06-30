export const VARIANTS = ['Standard 1.0', 'Endurance 1.0']

export async function fetchScores(variant) {
  const params = variant ? `?variant=${encodeURIComponent(variant)}` : ''
  const res = await fetch(`/api/scores${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchPersonalBest(initials, variant) {
  const params = new URLSearchParams({ initials })
  if (variant) params.set('variant', variant)
  const res = await fetch(`/api/scores?${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchAllScores(variant) {
  const params = variant && variant !== 'All' ? `?variant=${encodeURIComponent(variant)}` : ''
  const res = await fetch(`/api/admin${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function insertScore(initials, time_ms, variant) {
  const res = await fetch('/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ initials, time_ms, variant: variant || 'Standard 1.0' }),
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
