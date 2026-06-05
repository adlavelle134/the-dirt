# THE DIRT

Ranch-style outdoor gym obstacle course timer and leaderboard. OutRun 80s arcade aesthetic.

## Setup

1. Copy `.env.example` to `.env` and fill in your values.
2. Run `npm install` then `npm run dev`.

## Supabase Setup

Create a table called `scores`:

```sql
create table scores (
  id uuid primary key default uuid_generate_v4(),
  initials text not null check (char_length(initials) <= 3),
  time_ms integer not null,
  created_at timestamptz default now()
);
```

### Row Level Security (RLS)

Enable RLS and add these policies so anonymous users can read and submit scores:

```sql
-- Enable RLS
alter table scores enable row level security;

-- Allow anyone to read scores (leaderboard)
create policy "Public read" on scores
  for select using (true);

-- Allow anyone to insert scores (submit a run)
create policy "Public insert" on scores
  for insert with check (true);

-- Allow anyone to delete (needed for admin panel — consider restricting in production)
create policy "Public delete" on scores
  for delete using (true);
```

> Note: The admin panel uses client-side password auth (`VITE_ADMIN_PASSWORD`). For a gym kiosk this is sufficient. Do not store sensitive data in this table.

## Deployment

Deploy to Vercel — `vercel.json` is pre-configured with SPA rewrites.

Set these environment variables in Vercel project settings:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_PASSWORD`
