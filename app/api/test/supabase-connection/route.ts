import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic connection
    if (!supabase || !supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Supabase not configured',
        details: {
          supabase: !!supabase,
          supabaseAdmin: !!supabaseAdmin,
          env: {
            url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
          }
        }
      }, { status: 500 })
    }

    // Test database connection
    const { data: testData, error: testError } = await supabaseAdmin
      .from('users')
      .select('count', { count: 'exact', head: true })

    if (testError) {
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: testError.message,
        suggestion: 'Make sure you have run the database schema in your Supabase SQL editor'
      }, { status: 500 })
    }

    // Test if tables exist
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'listening_data', 'user_tokens'])

    if (tablesError) {
      return NextResponse.json({ 
        error: 'Could not check tables',
        details: tablesError.message
      }, { status: 500 })
    }

    const requiredTables = ['users', 'listening_data', 'user_tokens']
    const existingTables = tables?.map(t => t.table_name) || []
    const missingTables = requiredTables.filter(table => !existingTables.includes(table))

    if (missingTables.length > 0) {
      return NextResponse.json({ 
        error: 'Missing required tables',
        missingTables,
        suggestion: 'Please run the database schema SQL in your Supabase SQL editor'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Supabase connection successful!',
      details: {
        userCount: testData || 0,
        tables: existingTables,
        connection: 'healthy'
      }
    })

  } catch (error) {
    return NextResponse.json({ 
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
