/*
# Create apps table for the Veridian dashboard

1. New Tables
- `apps` — stores registered external applications shown as dashboard tiles
  - `id` (uuid, primary key)
  - `name` (text, not null) — display name of the application
  - `description` (text, nullable) — short description shown on the tile
  - `url` (text, not null) — the hosted URL of the application
  - `icon` (text, not null, default 'AppWindow') — lucide-react icon name
  - `category` (text, nullable) — optional grouping label
  - `sort_order` (int, default 0) — ordering for tiles
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- RLS enabled on `apps`.
- No auth in this app, so all CRUD is open to `anon, authenticated` (intentionally public/shared data).

3. Notes
- Single-tenant design — no user_id, no auth integration.
- The frontend will read/write through the Supabase anon key.
*/

CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  url text NOT NULL,
  icon text NOT NULL DEFAULT 'AppWindow',
  category text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_apps" ON apps;
CREATE POLICY "anon_select_apps" ON apps FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_apps" ON apps;
CREATE POLICY "anon_insert_apps" ON apps FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_apps" ON apps;
CREATE POLICY "anon_update_apps" ON apps FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_apps" ON apps;
CREATE POLICY "anon_delete_apps" ON apps FOR DELETE
TO anon, authenticated USING (true);
