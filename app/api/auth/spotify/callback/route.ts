import { NextRequest, NextResponse } from 'next/server'
import { storeSpotifyTokens, fetchSpotifyUserProfile } from '@/lib/spotify-tokens'
import { supabaseAdmin } from '@/lib/supabase'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  scope: string
  expires_in: number
  refresh_token: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    
    // Check if this is a mobile device
    const userAgent = request.headers.get('user-agent') || ''
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())

    console.log('Spotify callback received:', { code: !!code, state, error, isMobile })

    if (error) {
      console.error('Spotify auth error:', error)
      const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
      const redirectPath = isMobile ? '/mobile-redirect' : '/profile'
      return NextResponse.redirect(`${baseUrl}${redirectPath}?error=spotify_auth_failed&message=${encodeURIComponent(error)}`)
    }

    if (!code) {
      console.error('No authorization code received')
      const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
      const redirectPath = isMobile ? '/mobile-redirect' : '/profile'
      return NextResponse.redirect(`${baseUrl}${redirectPath}?error=no_auth_code&message=${encodeURIComponent('No authorization code received')}`)
    }

    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.json(
        { error: 'Spotify configuration missing' },
        { status: 500 }
      )
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      })
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('Token exchange failed:', errorData)
      const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
      const redirectPath = isMobile ? '/mobile-redirect' : '/test-redirect'
      return NextResponse.redirect(`${baseUrl}${redirectPath}?error=token_exchange_failed`)
    }

    const tokens: SpotifyTokenResponse = await tokenResponse.json()
    
    console.log('✅ Token exchange successful:', {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      scope: tokens.scope,
      expiresIn: tokens.expires_in
    })

    // Get user profile to identify the user
    console.log('🔍 Fetching user profile with token:', tokens.access_token.substring(0, 20) + '...')
    
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })
    
    console.log('📊 User profile response status:', userResponse.status, userResponse.statusText)

    if (!userResponse.ok) {
      console.error('Failed to get user profile:', {
        status: userResponse.status,
        statusText: userResponse.statusText,
        url: userResponse.url
      })
      
      // Try to get more details about the error
      let errorDetails = ''
      try {
        const errorData = await userResponse.text()
        console.error('User profile error details:', errorData)
        errorDetails = errorData
      } catch (e) {
        console.error('Could not parse error response:', e)
      }
      
      const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
      const redirectPath = isMobile ? '/mobile-redirect' : '/test-redirect'
      return NextResponse.redirect(`${baseUrl}${redirectPath}?error=user_profile_failed&details=${encodeURIComponent(errorDetails)}&status=${userResponse.status}`)
    }

    const userProfile = await userResponse.json()

            // Fetch comprehensive user profile from Spotify
            const comprehensiveProfile = await fetchSpotifyUserProfile(tokens.access_token)
            
            if (!comprehensiveProfile) {
              console.error('❌ Failed to fetch comprehensive user profile')
              const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
              const redirectPath = isMobile ? '/mobile-redirect' : '/test-redirect'
              return NextResponse.redirect(`${baseUrl}${redirectPath}?error=comprehensive_profile_failed&message=Failed to fetch comprehensive user profile`)
            }

            // Store tokens and comprehensive user data in database
            try {
              const expiresAt = Date.now() + (tokens.expires_in * 1000)
              
              await storeSpotifyTokens(
                userProfile.id,
                {
                  access_token: tokens.access_token,
                  refresh_token: tokens.refresh_token,
                  expires_at: expiresAt,
                  scope: tokens.scope
                },
                comprehensiveProfile
              )
              
              console.log('✅ User authenticated and tokens stored:', {
                spotifyId: userProfile.id,
                displayName: userProfile.display_name,
                hasAccessToken: !!tokens.access_token,
                hasRefreshToken: !!tokens.refresh_token
              })

              // Also store comprehensive user data in temporary storage for profile setup
              try {
                const baseUrl = process.env.NEXTAUTH_URL || 'http://127.0.0.1:3002'
                const setupDataResponse = await fetch(`${baseUrl}/api/user/setup-data`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    spotify_id: comprehensiveProfile.spotify_id,
                    display_name: comprehensiveProfile.display_name,
                    email: comprehensiveProfile.email,
                    profile_image: comprehensiveProfile.profile_image,
                    country: comprehensiveProfile.country,
                    followers: comprehensiveProfile.followers,
                    product: comprehensiveProfile.product,
                    spotify_url: comprehensiveProfile.external_urls?.spotify,
                    spotify_href: comprehensiveProfile.href,
                    spotify_uri: comprehensiveProfile.uri,
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    expires_at: expiresAt.toString(),
                    scope: tokens.scope
                  })
                })
                
                if (setupDataResponse.ok) {
                  console.log('✅ User setup data stored in temporary storage')
                } else {
                  console.error('❌ Failed to store user setup data:', await setupDataResponse.text())
                }
              } catch (setupError) {
                console.error('❌ Error storing setup data:', setupError)
                // Don't fail the entire flow for this
              }
              
            } catch (storageError) {
              console.error('❌ CRITICAL: Failed to store tokens:', storageError)
              console.error('❌ This means the user will not be able to access their profile!')
              
              // Redirect to error page instead of continuing
              const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
              const redirectPath = isMobile ? '/mobile-redirect' : '/auth-success'
              return NextResponse.redirect(`${baseUrl}${redirectPath}?error=storage_failed&message=${encodeURIComponent('Failed to save user data. Please try again.')}`)
            }

    // Redirect to appropriate page based on device type
    // Enhanced debug logging for base URL calculation
    console.log('🔍 Vercel Debug - NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    console.log('🔍 Vercel Debug - VERCEL_URL:', process.env.VERCEL_URL);
    console.log('🔍 Vercel Debug - Request Host:', request.headers.get('host'));
    
    // Use 127.0.0.1:3002 for local development
    const baseUrl = process.env.NEXTAUTH_URL || 'http://127.0.0.1:3002';

    console.log('🔍 Vercel Debug - Calculated baseUrl:', baseUrl);
    
    // Check if user is new (no custom_handle or bio) to determine redirect
    let isNewUser = true // Default to new user
    if (supabaseAdmin) {
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('custom_handle, bio')
        .eq('spotify_id', userProfile.id)
        .single()
      
      isNewUser = !existingUser?.custom_handle && !existingUser?.bio
    }
    
    const redirectPath = isMobile 
      ? '/mobile-redirect' 
      : (isNewUser ? '/profile-setup' : '/auth-success')
    
    const redirectUrl = isNewUser 
      ? `${baseUrl}${redirectPath}?spotify_id=${userProfile.id}`
      : `${baseUrl}${redirectPath}?spotify_connected=true&spotify_user_id=${userProfile.id}&display_name=${encodeURIComponent(userProfile.display_name || '')}&email=${encodeURIComponent(userProfile.email || '')}&profile_image=${encodeURIComponent(userProfile.images?.[0]?.url || '')}`
    
    console.log('🚀 Redirecting to:', redirectUrl, isNewUser ? '(new user)' : '(existing user)')
    return NextResponse.redirect(redirectUrl)
  } catch (error) {
    console.error('Spotify callback error:', error)
    const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://127.0.0.1:3002')
    const userAgent = request.headers.get('user-agent') || ''
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
    const redirectPath = isMobile ? '/mobile-redirect' : '/profile'
    return NextResponse.redirect(`${baseUrl}${redirectPath}?error=callback_failed`)
  }
}
