import { supabaseAdmin } from '@/lib/supabase'

export interface SpotifyTokens {
  access_token: string
  refresh_token: string
  expires_at: number
  scope: string
}

export interface SpotifyUser {
  spotify_id: string
  display_name: string
  email?: string
  profile_image?: string
}

// Store tokens in Supabase
export async function storeSpotifyTokens(
  userId: string,
  tokens: SpotifyTokens,
  userProfile: SpotifyUser
) {
  try {
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured')
    }
    
    // First, check if user exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('spotify_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError)
      throw fetchError
    }

    const userData = {
      spotify_id: userId,
      display_name: userProfile.display_name,
      email: userProfile.email,
      profile_image: userProfile.profile_image,
      spotify_access_token: tokens.access_token,
      spotify_refresh_token: tokens.refresh_token,
      token_expires_at: new Date(tokens.expires_at).toISOString(),
      spotify_scope: tokens.scope,
      updated_at: new Date().toISOString()
    }

    if (existingUser) {
      // Update existing user
      const { error } = await supabaseAdmin
        .from('users')
        .update(userData)
        .eq('spotify_id', userId)
      
      if (error) throw error
    } else {
      // Create new user
      const { error } = await supabaseAdmin
        .from('users')
        .insert({
          ...userData,
          created_at: new Date().toISOString()
        })
      
      if (error) throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error storing Spotify tokens:', error)
    throw error
  }
}

// Get user tokens
export async function getSpotifyTokens(userId: string): Promise<SpotifyTokens | null> {
  try {
    if (!supabaseAdmin) {
      return null
    }
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('spotify_access_token, spotify_refresh_token, token_expires_at, spotify_scope')
      .eq('spotify_id', userId)
      .single()

    if (error || !data) {
      return null
    }

    return {
      access_token: data.spotify_access_token,
      refresh_token: data.spotify_refresh_token,
      expires_at: new Date(data.token_expires_at).getTime(),
      scope: data.spotify_scope
    }
  } catch (error) {
    console.error('Error getting Spotify tokens:', error)
    return null
  }
}

// Refresh access token
export async function refreshSpotifyToken(refreshToken: string): Promise<SpotifyTokens | null> {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    })

    if (!response.ok) {
      console.error('Token refresh failed:', response.status, response.statusText)
      return null
    }

    const data = await response.json()
    const expiresAt = Date.now() + (data.expires_in * 1000)

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken, // Keep existing refresh token if not provided
      expires_at: expiresAt,
      scope: data.scope
    }
  } catch (error) {
    console.error('Error refreshing Spotify token:', error)
    return null
  }
}

// Get valid access token (refresh if needed)
export async function getValidAccessToken(userId: string): Promise<string | null> {
  try {
    let tokens = await getSpotifyTokens(userId)
    
    if (!tokens) {
      return null
    }

    // Check if token is expired (with 5 minute buffer)
    if (Date.now() >= (tokens.expires_at - 300000)) {
      console.log('Token expired, refreshing...')
      const newTokens = await refreshSpotifyToken(tokens.refresh_token)
      
      if (!newTokens) {
        return null
      }

      // Update stored tokens
      await storeSpotifyTokens(userId, newTokens, {
        spotify_id: userId,
        display_name: '', // We don't need to update profile here
      })
      
      tokens = newTokens
    }

    return tokens.access_token
  } catch (error) {
    console.error('Error getting valid access token:', error)
    return null
  }
}
