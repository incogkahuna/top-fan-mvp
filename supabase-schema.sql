-- Top Fan MVP Database Schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  spotify_id VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  profile_image_url TEXT,
  total_plays INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User tokens table (for storing Spotify access tokens)
CREATE TABLE user_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Listening data table
CREATE TABLE listening_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  track_id VARCHAR(255) NOT NULL,
  track_name VARCHAR(500) NOT NULL,
  artist_name VARCHAR(500) NOT NULL,
  played_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_ms INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, track_id, played_at)
);

-- Prizes table
CREATE TABLE prizes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  points_required INTEGER NOT NULL,
  category VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User prizes table (tracking earned prizes)
CREATE TABLE user_prizes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prize_id UUID REFERENCES prizes(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_spent INTEGER NOT NULL,
  UNIQUE(user_id, prize_id)
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('achievement', 'ranking', 'prize', 'milestone', 'social', 'reminder')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  points_awarded INTEGER NOT NULL,
  criteria JSONB NOT NULL, -- Store achievement criteria as JSON
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements table
CREATE TABLE user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for better performance
CREATE INDEX idx_listening_data_user_id ON listening_data(user_id);
CREATE INDEX idx_listening_data_played_at ON listening_data(played_at);
CREATE INDEX idx_listening_data_artist_name ON listening_data(artist_name);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_user_prizes_user_id ON user_prizes(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_tokens_updated_at BEFORE UPDATE ON user_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prizes_updated_at BEFORE UPDATE ON prizes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample prizes
INSERT INTO prizes (title, description, points_required, category) VALUES
('Early Access to New Album', 'Get exclusive early access to the next album release', 500, 'Music'),
('Exclusive Merchandise', 'Limited edition t-shirt and poster set', 300, 'Merchandise'),
('Virtual Meet & Greet', '30-minute virtual session with the artist', 1000, 'Experience'),
('Signed Vinyl Record', 'Limited edition signed vinyl of latest album', 750, 'Collectible'),
('Backstage Pass', 'Exclusive backstage access to next concert', 2000, 'Experience'),
('Co-writing Session', 'Collaborate on writing a song with the artist', 5000, 'Experience');

-- Insert sample achievements
INSERT INTO achievements (name, description, points_awarded, criteria) VALUES
('First Week Warrior', 'Listen to music 7 days in a row', 25, '{"consecutive_days": 7}'),
('Super Fan', 'Be in the top 10% of all listeners', 100, '{"percentile": 90}'),
('Playlist Master', 'Create 5 playlists', 50, '{"playlist_count": 5}'),
('Marathon Listener', 'Listen for 10 hours in a single day', 75, '{"daily_hours": 10}'),
('Social Butterfly', 'Share 10 tracks', 30, '{"shares": 10}'),
('Dedicated Fan', 'Listen to 1000 tracks total', 100, '{"total_tracks": 1000}');

-- Create a function to calculate user rankings
CREATE OR REPLACE FUNCTION calculate_user_rankings()
RETURNS TABLE (
  user_id UUID,
  display_name VARCHAR(255),
  total_plays BIGINT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.display_name,
    COUNT(ld.id) as total_plays,
    ROW_NUMBER() OVER (ORDER BY COUNT(ld.id) DESC) as rank
  FROM users u
  LEFT JOIN listening_data ld ON u.id = ld.user_id
  GROUP BY u.id, u.display_name
  ORDER BY total_plays DESC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get leaderboard data
CREATE OR REPLACE FUNCTION get_leaderboard(
  time_range_days INTEGER DEFAULT 30,
  artist_filter VARCHAR DEFAULT NULL
)
RETURNS TABLE (
  user_id UUID,
  display_name VARCHAR(255),
  profile_image_url TEXT,
  total_plays BIGINT,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.display_name,
    u.profile_image_url,
    COUNT(ld.id) as total_plays,
    ROW_NUMBER() OVER (ORDER BY COUNT(ld.id) DESC) as rank
  FROM users u
  LEFT JOIN listening_data ld ON u.id = ld.user_id
  WHERE ld.played_at >= NOW() - INTERVAL '1 day' * time_range_days
    AND (artist_filter IS NULL OR ld.artist_name = artist_filter)
  GROUP BY u.id, u.display_name, u.profile_image_url
  ORDER BY total_plays DESC;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_prizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic - in production you'd want more sophisticated policies)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view their own tokens" ON user_tokens FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view their own listening data" ON listening_data FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view their own notifications" ON notifications FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view their own prizes" ON user_prizes FOR ALL USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR ALL USING (auth.uid()::text = user_id::text);

-- Public read access for leaderboards and prizes
CREATE POLICY "Anyone can view prizes" ON prizes FOR SELECT USING (true);
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (true);
