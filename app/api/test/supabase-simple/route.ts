import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection...')
    
    if (!supabaseAdmin) {
      console.log('Supabase admin client is null')
      return NextResponse.json({ 
        error: 'Supabase not configured',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }, { status: 500 })
    }

    console.log('Supabase admin client exists, testing connection...')
    
    // Simple test query
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      console.log('Supabase query error:', error)
      return NextResponse.json({ 
        error: 'Supabase query failed', 
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    console.log('Supabase connection successful')
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection working',
      data: data
    })
  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
