-- Test user creation to see what's failing
-- Run this in your Supabase SQL Editor

-- Check the current table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Try to insert a test user manually to see what error we get
INSERT INTO users (
  music_id,
  display_name, 
  email,
  spotify_id,
  spotify_access_token,
  spotify_refresh_token,
  token_expires_at,
  spotify_scope,
  profile_image
) VALUES (
  'test_music_id_123',
  'Test User',
  'test@example.com', 
  'test_spotify_id_456',
  'test_access_token',
  'test_refresh_token',
  NOW() + INTERVAL '1 hour',
  'test_scope',
  'https://example.com/image.jpg'
);

-- Check if it worked
SELECT * FROM users WHERE spotify_id = 'test_spotify_id_456';

-- Clean up test data
DELETE FROM users WHERE spotify_id = 'test_spotify_id_456';
