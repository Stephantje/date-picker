# 💕 Date Picker — Setup Guide

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the SQL Editor, run:

```sql
create table dates (
  id uuid default gen_random_uuid() primary key,
  activity text not null,
  date date not null,
  time time not null,
  created_at timestamptz default now()
);
```

3. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Local Development

```bash
# Copy and fill in your keys
cp .env.local.example .env.local

npm install
npm run dev
```

## 3. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

When prompted, add environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Or add them in **Vercel Dashboard → Project → Settings → Environment Variables**.

## 4. View Submissions

In your Supabase dashboard, go to **Table Editor → dates** to see all date bookings! 🗓️
