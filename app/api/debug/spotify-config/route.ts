import { NextResponse } from 'next/server'

export async function GET() {
  // Temporarily allow in production for debugging
  // if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DEBUG) {
  //   return NextResponse.json({ error: 'Debug endpoint disabled in production' }, { status: 403 })
  // }

  return NextResponse.json({
    spotify: {
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ? '***SET***' : 'NOT SET',
      client_secret: process.env.SPOTIFY_CLIENT_SECRET ? '***SET***' : 'NOT SET',
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI || 'NOT SET',
    },
    nextauth: {
      url: process.env.NEXTAUTH_URL || 'NOT SET',
    },
    vercel: {
      url: process.env.VERCEL_URL || 'NOT SET',
    },
    environment: process.env.NODE_ENV,
    all_env_vars: Object.keys(process.env).filter(key => 
      key.includes('SPOTIFY') || key.includes('NEXTAUTH') || key.includes('SUPABASE')
    )
  })
}
