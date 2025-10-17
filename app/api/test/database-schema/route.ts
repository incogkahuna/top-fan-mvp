import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 })
    }

    // Check if we can connect to the database
    const { data: connectionTest, error: connectionError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)

    if (connectionError) {
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: connectionError 
      }, { status: 500 })
    }

    // Get the table structure - try a simple query first
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1)

    return NextResponse.json({ 
      success: true,
      connectionTest,
      tableInfo: tableInfo || 'Could not get table structure'
    })

  } catch (error) {
    console.error('❌ Database schema test error:', error)
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error 
    }, { status: 500 })
  }
}
