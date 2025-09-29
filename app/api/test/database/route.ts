import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Test if all required tables exist
    const requiredTables = ['users', 'listening_data', 'prizes', 'notifications', 'achievements']
    
    for (const table of requiredTables) {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(1)

      if (error && error.code === 'PGRST116') {
        return NextResponse.json({ 
          error: `Table '${table}' does not exist. Please run the database schema.` 
        }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true, message: 'Database schema is properly configured' })
  } catch (error) {
    return NextResponse.json({ error: 'Database schema test failed' }, { status: 500 })
  }
}
