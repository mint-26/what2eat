-- what2eat Initial Schema Migration
-- Run this in the Supabase SQL Editor
-- Settings → API → Exposed Schemas → add "what2eat" after running

-- 1. Create schema
CREATE SCHEMA IF NOT EXISTS what2eat;

-- 2. Permissions
GRANT USAGE ON SCHEMA what2eat TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA what2eat TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA what2eat GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- 3. Tables

CREATE TABLE what2eat.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  display_name TEXT NOT NULL,
  role TEXT UNIQUE CHECK (role IN ('adrian', 'janina')),
  avatar_url TEXT,
  cook_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_selections stores the full selected meal per user per day
-- (no FK to daily_suggestions – keeps it simple for real-time sync)
CREATE TABLE what2eat.user_selections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  user_role TEXT NOT NULL CHECK (user_role IN ('adrian', 'janina')),
  meal_name TEXT NOT NULL,
  cuisine_type TEXT,
  recipe_json JSONB,
  meal_image_url TEXT,
  selected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, user_role)
);

CREATE TABLE what2eat.match_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  matched_meal_name TEXT NOT NULL,
  matched_recipe_json JSONB NOT NULL,
  matched_image_url TEXT,
  who_cooks TEXT NOT NULL CHECK (who_cooks IN ('adrian', 'janina')),
  match_type TEXT CHECK (match_type IN ('exact', 'compromise', 'random')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE what2eat.meal_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_name TEXT NOT NULL,
  date_cooked DATE NOT NULL UNIQUE,
  rating_adrian INTEGER CHECK (rating_adrian BETWEEN 1 AND 5),
  rating_janina INTEGER CHECK (rating_janina BETWEEN 1 AND 5),
  would_repeat BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE what2eat.shopping_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Seed profiles
INSERT INTO what2eat.profiles (display_name, role) VALUES
  ('Adrian', 'adrian'),
  ('Janina', 'janina')
ON CONFLICT (role) DO NOTHING;

-- 5. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE what2eat.user_selections;
ALTER PUBLICATION supabase_realtime ADD TABLE what2eat.match_results;

-- 6. Row-Level Security (optional but recommended)
-- ALTER TABLE what2eat.user_selections ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "allow all" ON what2eat.user_selections FOR ALL USING (true);
-- ALTER TABLE what2eat.match_results ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "allow all" ON what2eat.match_results FOR ALL USING (true);
-- ALTER TABLE what2eat.meal_history ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "allow all" ON what2eat.meal_history FOR ALL USING (true);
