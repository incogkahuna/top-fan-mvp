import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Get all tour dates
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { data: tourDates, error } = await supabaseAdmin
      .from('tour_dates')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching tour dates:', error)
      return NextResponse.json({ error: 'Failed to fetch tour dates' }, { status: 500 })
    }

    return NextResponse.json({ tourDates })
  } catch (error) {
    console.error('Tour dates API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Create new tour date
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const tourData = await request.json()

    // Validate required fields
    if (!tourData.date || !tourData.venue || !tourData.city) {
      return NextResponse.json({ 
        error: 'Missing required fields: date, venue, city' 
      }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('tour_dates')
      .insert([{
        date: tourData.date,
        time: tourData.time || null,
        venue: tourData.venue,
        city: tourData.city,
        state: tourData.state || null,
        country: tourData.country || 'United States',
        ticket_link: tourData.ticket_link || null,
        ticket_price: tourData.ticket_price || null,
        capacity: tourData.capacity || null,
        sold: tourData.sold || 0,
        status: tourData.status || 'On Sale',
        description: tourData.description || null,
        is_active: tourData.is_active !== false
      }])
      .select()

    if (error) {
      console.error('Error creating tour date:', error)
      return NextResponse.json({ error: 'Failed to create tour date' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      tourDate: data[0] 
    })
  } catch (error) {
    console.error('Create tour date API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
