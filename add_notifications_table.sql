-- Add notifications table for Laylo integration
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  target_count INTEGER DEFAULT 0,
  tour_id VARCHAR(100),
  laylo_notification_id VARCHAR(100),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON notifications(sent_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_tour_id ON notifications(tour_id);

-- Add laylo_user_id column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS laylo_user_id VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS laylo_synced_at TIMESTAMP WITH TIME ZONE;

-- Add index for laylo_user_id
CREATE INDEX IF NOT EXISTS idx_users_laylo_user_id ON users(laylo_user_id);
