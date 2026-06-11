import { turso } from './_turso.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const rows = await turso('SELECT * FROM dirt_scores ORDER BY time_ms ASC')
      return res.status(200).json(rows)
    }

    if (req.method === 'DELETE') {
      const { id, all } = req.query
      if (all === 'true') {
        await turso('DELETE FROM dirt_scores')
      } else if (id) {
        await turso('DELETE FROM dirt_scores WHERE id = ?', [id])
      } else {
        return res.status(400).json({ error: 'Missing id or all param' })
      }
      return res.status(200).json({ ok: true })
    }

    return res.status(405).end()
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
