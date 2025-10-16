import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Ticketing platform integrations
interface TicketingEvent {
  id: string
  title: string
  date: string
  time: string
  venue: string
  city: string
  state: string
  country: string
  ticketUrl: string
  price?: string
  status: 'On Sale' | 'Sold Out' | 'Cancelled' | 'Postponed' | 'Announced'
  capacity?: number
  sold?: number
  imageUrl?: string
  description?: string
  platform: 'ticketmaster' | 'eventbrite' | 'dice' | 'manual'
}

// Get events from Ticketmaster API
async function getTicketmasterEvents(): Promise<TicketingEvent[]> {
  try {
    const apiKey = process.env.TICKETMASTER_API_KEY
    if (!apiKey) {
      console.log('Ticketmaster API key not configured')
      return []
    }

    // Search for events by artist name
    const response = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&keyword=Early%20Twenties%20Torture&size=50`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`)
    }

    const data = await response.json()
    
    return data._embedded?.events?.map((event: any) => ({
      id: event.id,
      title: event.name,
      date: new Date(event.dates.start.localDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: event.dates.start.localTime ? 
        new Date(`2000-01-01T${event.dates.start.localTime}`).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }) : 'TBA',
      venue: event._embedded?.venues?.[0]?.name || 'TBA',
      city: event._embedded?.venues?.[0]?.city?.name || 'TBA',
      state: event._embedded?.venues?.[0]?.state?.name || '',
      country: event._embedded?.venues?.[0]?.country?.name || 'United States',
      ticketUrl: event.url || '#',
      price: event.priceRanges?.[0] ? 
        `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}` : 'TBA',
      status: event.dates.status?.code === 'onsale' ? 'On Sale' : 
              event.dates.status?.code === 'cancelled' ? 'Cancelled' : 
              event.dates.status?.code === 'postponed' ? 'Postponed' : 'Announced',
      imageUrl: event.images?.[0]?.url,
      description: event.info,
      platform: 'ticketmaster' as const
    })) || []

  } catch (error) {
    console.error('Error fetching Ticketmaster events:', error)
    return []
  }
}

// Get events from Eventbrite API
async function getEventbriteEvents(): Promise<TicketingEvent[]> {
  try {
    const apiKey = process.env.EVENTBRITE_API_KEY
    if (!apiKey) {
      console.log('Eventbrite API key not configured')
      return []
    }

    // Search for events by organizer (you'd need to set up your organizer ID)
    const organizerId = process.env.EVENTBRITE_ORGANIZER_ID
    if (!organizerId) {
      console.log('Eventbrite organizer ID not configured')
      return []
    }

    const response = await fetch(
      `https://www.eventbriteapi.com/v3/organizers/${organizerId}/events/?status=live&expand=venue`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Eventbrite API error: ${response.status}`)
    }

    const data = await response.json()
    
    return data.events?.map((event: any) => ({
      id: event.id,
      title: event.name?.text || 'Event',
      date: new Date(event.start?.local || event.start?.utc).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: event.start?.local ? 
        new Date(event.start.local).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }) : 'TBA',
      venue: event.venue?.name || 'TBA',
      city: event.venue?.address?.city || 'TBA',
      state: event.venue?.address?.region || '',
      country: event.venue?.address?.country || 'United States',
      ticketUrl: event.url || '#',
      price: event.is_free ? 'Free' : 'See event for pricing',
      status: event.status === 'live' ? 'On Sale' : 'Announced',
      imageUrl: event.logo?.url,
      description: event.description?.text,
      platform: 'eventbrite' as const
    })) || []

  } catch (error) {
    console.error('Error fetching Eventbrite events:', error)
    return []
  }
}

// Get manual events from database (your custom tour dates)
async function getManualEvents(): Promise<TicketingEvent[]> {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase')
    
    if (!supabaseAdmin) {
      console.log('Supabase not configured')
      return []
    }

    const { data: tourDates, error } = await supabaseAdmin
      .from('tour_dates')
      .select('*')
      .eq('is_active', true)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching manual events:', error)
      return []
    }

    return tourDates?.map((tour: any) => ({
      id: tour.id,
      title: `${tour.venue} - Early Twenties Torture`,
      date: new Date(tour.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: tour.time ? 
        new Date(`2000-01-01T${tour.time}`).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }) : 'TBA',
      venue: tour.venue,
      city: tour.city,
      state: tour.state || '',
      country: tour.country || 'United States',
      ticketUrl: tour.ticket_link || '#',
      price: tour.ticket_price ? `$${tour.ticket_price.toFixed(2)}` : 'TBA',
      status: tour.status as any,
      capacity: tour.capacity,
      sold: tour.sold,
      description: tour.description,
      platform: 'manual' as const
    })) || []

  } catch (error) {
    console.error('Error fetching manual events:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get('source') || 'all'

    let events: TicketingEvent[] = []

    if (source === 'all' || source === 'ticketmaster') {
      const ticketmasterEvents = await getTicketmasterEvents()
      events.push(...ticketmasterEvents)
    }

    if (source === 'all' || source === 'eventbrite') {
      const eventbriteEvents = await getEventbriteEvents()
      events.push(...eventbriteEvents)
    }

    if (source === 'all' || source === 'manual') {
      const manualEvents = await getManualEvents()
      events.push(...manualEvents)
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json({
      events,
      total: events.length,
      sources: {
        ticketmaster: events.filter(e => e.platform === 'ticketmaster').length,
        eventbrite: events.filter(e => e.platform === 'eventbrite').length,
        manual: events.filter(e => e.platform === 'manual').length
      }
    })

  } catch (error) {
    console.error('Ticketing API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch ticketing data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
