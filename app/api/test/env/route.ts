import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      supabaseUrl: process.env.SUPABASE_URL ? 'Set' : 'Missing',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      nextAuthUrl: process.env.NEXTAUTH_URL ? 'Set' : 'Missing',
      vercelUrl: process.env.VERCEL_URL ? 'Set' : 'Missing'
    }

    // Don't expose actual values for security
    return NextResponse.json({ 
      success: true,
      environment: envCheck
    })

  } catch (error) {
    console.error('❌ Environment test error:', error)
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error 
    }, { status: 500 })
  }
}
