import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    console.log('Spotify callback received:', { 
      code: code?.substring(0, 20) + '...', 
      error, 
      state,
      url: request.url 
    })

    const baseUrl = process.env.NEXTAUTH_URL || 'https://earlytwentiesstorture.vercel.app'

    if (error) {
      console.error('Spotify OAuth error:', error)
      return NextResponse.redirect(`${baseUrl}/test/callback?error=spotify_${error}`)
    }

    if (!code) {
      console.error('No authorization code received from Spotify')
      return NextResponse.redirect(`${baseUrl}/test/callback?error=no_code`)
    }

    console.log('Success! Code received:', code.substring(0, 20))
    
    // For testing purposes, redirect to test callback page
    return NextResponse.redirect(`${baseUrl}/test/callback?code=${code}&success=true`)
    
  } catch (error) {
    console.error('Spotify callback error:', error)
    const baseUrl = process.env.NEXTAUTH_URL || 'https://earlytwentiesstorture.vercel.app'
    return NextResponse.redirect(`${baseUrl}/test/callback?error=callback_error&details=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error')}`)
  }
}