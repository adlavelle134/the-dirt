import { createClient } from '@libsql/client/web'

const client = createClient({
  url: import.meta.env.VITE_TURSO_URL,
  authToken: import.meta.env.VITE_TURSO_TOKEN,
})

function toRows(result) {
  return result.rows.map(row => ({
    id: row.id,
    initials: row.initials,
    time_ms: Number(row.time_ms),
    created_at: row.created_at,
  }))
}

export async function fetchScores() {
  const result = await client.execute(
    'SELECT * FROM dirt_scores ORDER BY time_ms ASC LIMIT 50'
  )
  return toRows(result)
}

export async function fetchAllScores() {
  const result = await client.execute(
    'SELECT * FROM dirt_scores ORDER BY time_ms ASC'
  )
  return toRows(result)
}

export async function insertScore(initials, time_ms) {
  const id = crypto.randomUUID()
  const created_at = new Date().toISOString()
  await client.execute({
    sql: 'INSERT INTO dirt_scores (id, initials, time_ms, created_at) VALUES (?, ?, ?, ?)',
    args: [id, initials, time_ms, created_at],
  })
}

export async function deleteScore(id) {
  await client.execute({
    sql: 'DELETE FROM dirt_scores WHERE id = ?',
    args: [id],
  })
}

export async function deleteAllScores() {
  await client.execute('DELETE FROM dirt_scores')
}
