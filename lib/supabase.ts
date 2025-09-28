import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  spotify_id: string
  display_name: string
  email: string
  profile_image_url?: string
  created_at: string
  updated_at: string
}

export interface ListeningData {
  id: string
  user_id: string
  track_id: string
  track_name: string
  artist_name: string
  played_at: string
  duration_ms: number
  created_at: string
}

export interface LeaderboardEntry {
  user_id: string
  display_name: string
  profile_image_url?: string
  total_plays: number
  rank: number
}

export interface Prize {
  id: string
  title: string
  description: string
  points_required: number
  category: string
  is_active: boolean
  created_at: string
}

export interface UserPrize {
  id: string
  user_id: string
  prize_id: string
  earned_at: string
  points_spent: number
}

export interface Notification {
  id: string
  user_id: string
  type: 'achievement' | 'ranking' | 'prize' | 'milestone' | 'social' | 'reminder'
  title: string
  message: string
  is_read: boolean
  created_at: string
}
