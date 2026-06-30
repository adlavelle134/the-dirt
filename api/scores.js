import { turso } from './_turso.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const { initials, variant } = req.query
      let rows
      if (initials && variant) {
        rows = await turso(
          'SELECT * FROM dirt_scores WHERE UPPER(initials) = ? AND variant = ? ORDER BY time_ms ASC',
          [initials.toUpperCase(), variant]
        )
      } else if (initials) {
        rows = await turso(
          'SELECT * FROM dirt_scores WHERE UPPER(initials) = ? ORDER BY time_ms ASC',
          [initials.toUpperCase()]
        )
      } else if (variant) {
        rows = await turso(
          'SELECT * FROM dirt_scores WHERE variant = ? ORDER BY time_ms ASC LIMIT 50',
          [variant]
        )
      } else {
        rows = await turso('SELECT * FROM dirt_scores ORDER BY time_ms ASC LIMIT 50')
      }
      return res.status(200).json(rows)
    }

    if (req.method === 'POST') {
      const { initials, time_ms, variant } = req.body
      const id = crypto.randomUUID()
      const created_at = new Date().toISOString()
      await turso(
        'INSERT INTO dirt_scores (id, initials, time_ms, created_at, variant) VALUES (?, ?, ?, ?, ?)',
        [id, initials, time_ms, created_at, variant || 'Standard 1.0']
      )
      return res.status(200).json({ ok: true })
    }

    return res.status(405).end()
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
