-- Add profile-related columns to the users table
-- Run this in your Supabase SQL editor

-- Add custom handle column (unique username)
ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_handle VARCHAR(50) UNIQUE;

-- Add bio/description column
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add custom avatar URL column (for uploaded profile pictures)
ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_avatar_url TEXT;

-- Add privacy settings column (JSON for flexible settings)
ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{}';

-- Create index on custom_handle for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_custom_handle ON users(custom_handle);

-- Add comments for documentation
COMMENT ON COLUMN users.custom_handle IS 'User-defined unique handle/username';
COMMENT ON COLUMN users.bio IS 'User bio/description text';
COMMENT ON COLUMN users.custom_avatar_url IS 'URL for custom uploaded profile picture';
COMMENT ON COLUMN users.privacy_settings IS 'JSON object containing user privacy preferences';
