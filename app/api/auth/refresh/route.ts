import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { refreshAccessToken } from '@/lib/spotify-api'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Get the user ID from the request body or from session
    const body = await request.json().catch(() => ({}))
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's current tokens
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('user_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', userId)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ 
        error: 'No valid tokens found for user. Please reconnect to music service.',
        code: 'NO_TOKENS'
      }, { status: 404 })
    }

    if (!tokenData.refresh_token) {
      return NextResponse.json({ 
        error: 'No refresh token available. Please reconnect to music service.',
        code: 'NO_REFRESH_TOKEN'
      }, { status: 400 })
    }

    try {
      // Attempt to refresh the access token
      const refreshResult = await refreshAccessToken(tokenData.refresh_token)
      
      // Update the token in database
      const { error: updateError } = await supabaseAdmin
        .from('user_tokens')
        .update({
          access_token: refreshResult.access_token,
          expires_at: new Date(Date.now() + refreshResult.expires_in * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Failed to update refreshed token:', updateError)
        return NextResponse.json({ 
          error: 'Token refreshed but failed to save. Please try again.',
          code: 'UPDATE_FAILED'
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Token refreshed successfully',
        expiresAt: new Date(Date.now() + refreshResult.expires_in * 1000).toISOString()
      })

    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError)
      
      // If refresh fails, the refresh token might be invalid
      // Clean up the invalid tokens
      await supabaseAdmin
        .from('user_tokens')
        .delete()
        .eq('user_id', userId)

      return NextResponse.json({ 
        error: 'Token refresh failed. Please reconnect to music service.',
        code: 'REFRESH_FAILED',
        details: refreshError instanceof Error ? refreshError.message : 'Unknown error'
      }, { status: 401 })
    }

  } catch (error) {
    console.error('Token refresh endpoint error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET endpoint to check token status without refreshing
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Get user's current tokens
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('user_tokens')
      .select('access_token, refresh_token, expires_at, updated_at')
      .eq('user_id', userId)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json({ 
        error: 'No tokens found for user',
        code: 'NO_TOKENS'
      }, { status: 404 })
    }

    // Check if token is expired
    const now = new Date()
    const expiresAt = new Date(tokenData.expires_at)
    const isExpired = now >= expiresAt
    const timeUntilExpiry = Math.max(0, expiresAt.getTime() - now.getTime())
    const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60))

    return NextResponse.json({
      success: true,
      tokenStatus: {
        isExpired,
        expiresAt: tokenData.expires_at,
        timeUntilExpiry: timeUntilExpiry,
        minutesUntilExpiry: minutesUntilExpiry,
        hasRefreshToken: !!tokenData.refresh_token,
        lastUpdated: tokenData.updated_at
      }
    })

  } catch (error) {
    console.error('Token status check error:', error)
    return NextResponse.json({ 
      error: 'Failed to check token status',
      code: 'STATUS_CHECK_FAILED',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
