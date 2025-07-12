-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create streaks table
CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('smoking', 'drinking', 'porn')),
  current_streak INTEGER DEFAULT 0,
  goal INTEGER NOT NULL CHECK (goal IN (30, 66, 99)),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_check_in TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create streak_attempts table
CREATE TABLE IF NOT EXISTS streak_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  streak_id UUID REFERENCES streaks(id) ON DELETE CASCADE,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create motivational_quotes table
CREATE TABLE IF NOT EXISTS motivational_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_streaks_user_id ON streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_type ON streaks(type);
CREATE INDEX IF NOT EXISTS idx_streaks_active ON streaks(is_active);
CREATE INDEX IF NOT EXISTS idx_streak_attempts_streak_id ON streak_attempts(streak_id);
CREATE INDEX IF NOT EXISTS idx_quotes_category ON motivational_quotes(category);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE motivational_quotes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Streaks policies
CREATE POLICY "Users can view own streaks" ON streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streaks" ON streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streaks" ON streaks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own streaks" ON streaks
  FOR DELETE USING (auth.uid() = user_id);

-- Streak attempts policies
CREATE POLICY "Users can view own streak attempts" ON streak_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM streaks 
      WHERE streaks.id = streak_attempts.streak_id 
      AND streaks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own streak attempts" ON streak_attempts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM streaks 
      WHERE streaks.id = streak_attempts.streak_id 
      AND streaks.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own streak attempts" ON streak_attempts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM streaks 
      WHERE streaks.id = streak_attempts.streak_id 
      AND streaks.user_id = auth.uid()
    )
  );

-- Motivational quotes are public
CREATE POLICY "Anyone can view motivational quotes" ON motivational_quotes
  FOR SELECT USING (true);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streaks_updated_at 
  BEFORE UPDATE ON streaks 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample motivational quotes
INSERT INTO motivational_quotes (text, author, image_url, category) VALUES
('"The only way to do great work is to love what you do."', 'Steve Jobs', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlqF2Byb-ei3zgNu45F_3USYf8G3qm2Pt9sqhsC8HeA-nEA9E0S4-6tE2q855wXKkp9aRrbp59_a11ZHUGK2A0o6d6FegHZZU5OKM6ozYNhv1Rlc4gtkIC9-HWgnpMkB3m0-OyUCgAkwVevOjg1TL8gvJeqqz-5ulC--MObvTHyGBA455XwYxJNnbM9LrZO23wzHoWlFRqwEgr3Pv4iqkpaK7EXpZCeK7YHPc46fl3y-BOQUtm1VZkMLdai-DD9wyl264e5LhZWB8', 'motivation'),
('"The mind is everything. What you think you become."', 'Buddha', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBX3ZwCLie7AhSA42On8_lC3aRsGAZRCNes74qC7EqxtweSsYX5KWftqnFUMPtaP733iao2n498g6I8PYH2_L1OcBaJSu1f8svq9NGLuXNbMwCm6sY47x1OKc-kTtzK3In-tMKSzuLp-Ku6144cwOepqN2YVQPGfqrRyydF23FIiw2e6koGl4-tVPtVw6dCjQ5kQTwkP8ZLer_UlFHvE_BdXM0wQ42udLNGdJjY3MFlCQqTCxsek8I97ig06dAnGNQQJ78NqK4P300', 'mindfulness'),
('"Believe you can and you''re halfway there."', 'Theodore Roosevelt', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBzzaurXYcD9ZS40TVKeXz1af8puQuOCu6LjzX7fNskXUEZ12oqN0jPMA3-6yReG9vTdtZOk2YWLOTp0kZ3hnuINNVmlD3Rde2MPdoAripTitQO1fa7HPR6n8z2YD9WE-X7xz-WpyQY2JLWRqaHtKGR7phd7KH-2RLeQKLlrfreU71244B2ZRknfDX3H7dKmCQiW43AyTj-eiIlWP3MpBqOUXfaX212NPJe94LNpY3UqO1E5QFmBQVOSp9nc5g0kQagaDVnQIXMTo', 'confidence'),
('"Success is not final, failure is not fatal: it is the courage to continue that counts."', 'Winston Churchill', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'perseverance'),
('"The future belongs to those who believe in the beauty of their dreams."', 'Eleanor Roosevelt', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', 'dreams'),
('"What you get by achieving your goals is not as important as what you become by achieving your goals."', 'Zig Ziglar', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', 'growth');

-- Create a function to calculate streak duration
CREATE OR REPLACE FUNCTION calculate_streak_duration(start_date TIMESTAMP WITH TIME ZONE)
RETURNS INTEGER AS $$
BEGIN
  RETURN EXTRACT(DAY FROM (NOW() - start_date));
END;
$$ LANGUAGE plpgsql;

-- Create a view for streak statistics
CREATE VIEW streak_stats AS
SELECT 
  s.id,
  s.user_id,
  s.type,
  s.current_streak,
  s.goal,
  s.start_date,
  s.last_check_in,
  calculate_streak_duration(s.start_date) as days_since_start,
  ROUND((s.current_streak::DECIMAL / s.goal::DECIMAL) * 100, 2) as progress_percentage
FROM streaks s
WHERE s.is_active = true; 