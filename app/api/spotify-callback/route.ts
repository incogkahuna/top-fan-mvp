import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    console.log('Spotify callback received:', { code: code?.substring(0, 20), error })

    if (error) {
      console.log('Spotify error:', error)
      return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/test/callback?error=' + error)
    }

    if (!code) {
      console.log('No code received')
      return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/test/callback?error=no_code')
    }

    console.log('Success! Code received:', code.substring(0, 20))
    // Success - redirect to test callback page with the code
    return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/test/callback?code=' + code)
    
  } catch (error) {
    console.error('Spotify callback error:', error)
    return NextResponse.redirect('https://earlytwentiesstorture.vercel.app/test/callback?error=callback_error')
  }
}
