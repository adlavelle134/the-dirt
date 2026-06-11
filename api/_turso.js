function toArg(val) {
  if (val === null || val === undefined) return { type: 'null' }
  if (typeof val === 'number') return { type: 'integer', value: String(val) }
  return { type: 'text', value: String(val) }
}

export async function turso(query, args = []) {
  const url = process.env.VITE_TURSO_URL
  const token = process.env.VITE_TURSO_TOKEN

  const res = await fetch(`${url}/v2/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
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
    throw new Error(`Turso ${res.status}: ${text}`)
  }

  const data = await res.json()
  const result = data.results?.[0]

  if (result?.type === 'error') {
    throw new Error(result.error?.message || 'Query error')
  }

  const cols = result?.response?.result?.cols?.map(c => c.name) || []
  return (result?.response?.result?.rows || []).map(row =>
    Object.fromEntries(cols.map((col, i) => [col, row[i]?.value ?? null]))
  )
}
