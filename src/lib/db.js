const TURSO_URL = import.meta.env.VITE_TURSO_URL
const TURSO_TOKEN = import.meta.env.VITE_TURSO_TOKEN

function toArg(val) {
  if (val === null || val === undefined) return { type: 'null' }
  if (typeof val === 'number') return { type: 'integer', value: String(val) }
  return { type: 'text', value: String(val) }
}

async function sql(query, args = []) {
  const res = await fetch(`${TURSO_URL}/v2/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TURSO_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        { type: 'execute', stmt: { sql: query, args: args.map(toArg) } },
        { type: 'close' },
      ],
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text}`)
  }

  const data = await res.json()
  const result = data.results?.[0]

  if (result?.type === 'error') {
    throw new Error(result.error?.message || 'Query error')
  }

  const cols = result?.response?.result?.cols?.map(c => c.name) || []
  const rows = (result?.response?.result?.rows || []).map(row =>
    Object.fromEntries(cols.map((col, i) => [col, row[i]?.value ?? null]))
  )

  return rows
}

export async function fetchScores() {
  return sql('SELECT * FROM dirt_scores ORDER BY time_ms ASC LIMIT 50')
}

export async function fetchAllScores() {
  return sql('SELECT * FROM dirt_scores ORDER BY time_ms ASC')
}

export async function insertScore(initials, time_ms) {
  const id = crypto.randomUUID()
  const created_at = new Date().toISOString()
  await sql(
    'INSERT INTO dirt_scores (id, initials, time_ms, created_at) VALUES (?, ?, ?, ?)',
    [id, initials, time_ms, created_at]
  )
}

export async function deleteScore(id) {
  await sql('DELETE FROM dirt_scores WHERE id = ?', [id])
}

export async function deleteAllScores() {
  await sql('DELETE FROM dirt_scores')
}
