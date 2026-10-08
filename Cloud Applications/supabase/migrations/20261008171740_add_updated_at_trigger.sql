/*
# Add updated_at auto-trigger for apps table

1. Changes
- Adds a trigger that auto-updates `updated_at` on every row update.

2. Notes
- Keeps tile metadata timestamps current without frontend logic.
*/

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS apps_updated_at ON apps;
CREATE TRIGGER apps_updated_at
BEFORE UPDATE ON apps
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
