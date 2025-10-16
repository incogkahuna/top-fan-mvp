import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // First, check if the table exists by trying to select from it
    const { data: allTours, error: allError } = await supabaseAdmin
      .from('tour_dates')
      .select('*')

    if (allError) {
      return NextResponse.json({ 
        error: 'Database error', 
        details: allError.message,
        code: allError.code 
      }, { status: 500 })
    }

    // Check active tours
    const { data: activeTours, error: activeError } = await supabaseAdmin
      .from('tour_dates')
      .select('*')
      .eq('is_active', true)

    // Check future tours
    const today = new Date().toISOString().split('T')[0]
    const { data: futureTours, error: futureError } = await supabaseAdmin
      .from('tour_dates')
      .select('*')
      .eq('is_active', true)
      .gte('date', today)

    return NextResponse.json({
      success: true,
      debug: {
        totalTours: allTours?.length || 0,
        activeTours: activeTours?.length || 0,
        futureTours: futureTours?.length || 0,
        today: today,
        allToursData: allTours,
        activeToursData: activeTours,
        futureToursData: futureTours
      }
    })
  } catch (error) {
    console.error('Tour dates test error:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
