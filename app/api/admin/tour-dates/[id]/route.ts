import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Update tour date
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { id } = params
    const tourData = await request.json()

    // Validate required fields
    if (!tourData.date || !tourData.venue || !tourData.city) {
      return NextResponse.json({ 
        error: 'Missing required fields: date, venue, city' 
      }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('tour_dates')
      .update({
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
        is_active: tourData.is_active !== false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating tour date:', error)
      return NextResponse.json({ error: 'Failed to update tour date' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Tour date not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      tourDate: data[0] 
    })
  } catch (error) {
    console.error('Update tour date API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Delete tour date
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { id } = params

    const { error } = await supabaseAdmin
      .from('tour_dates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting tour date:', error)
      return NextResponse.json({ error: 'Failed to delete tour date' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Tour date deleted successfully'
    })
  } catch (error) {
    console.error('Delete tour date API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
