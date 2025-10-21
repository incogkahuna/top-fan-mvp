import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Hard-coded tour dates from Laylo (same as in /api/laylo/tour-data)
const LAYLO_TOUR_DATES = [
  {
    id: 'laylo-oslo-2024',
    date: '2024-11-04',
    time: null,
    venue: 'Parkteatret',
    city: 'Oslo',
    state: null,
    country: 'Norway',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-oslo-2024'
  },
  {
    id: 'laylo-stockholm-2024',
    date: '2024-11-06',
    time: null,
    venue: 'Bar Brooklyn',
    city: 'Stockholm',
    state: null,
    country: 'Sweden',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-stockholm-2024'
  },
  {
    id: 'laylo-copenhagen-2024',
    date: '2024-11-08',
    time: null,
    venue: 'Lille Vega',
    city: 'Copenhagen',
    state: null,
    country: 'Denmark',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-copenhagen-2024'
  },
  {
    id: 'laylo-berlin-2024',
    date: '2024-11-10',
    time: null,
    venue: 'Frannz Club',
    city: 'Berlin',
    state: null,
    country: 'Germany',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-berlin-2024'
  },
  {
    id: 'laylo-prague-2024',
    date: '2024-11-11',
    time: null,
    venue: 'Rock Cafe',
    city: 'Prague',
    state: null,
    country: 'Czechia',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-prague-2024'
  },
  {
    id: 'laylo-vienna-2024',
    date: '2024-11-12',
    time: null,
    venue: 'Szene',
    city: 'Vienna',
    state: null,
    country: 'Austria',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-vienna-2024'
  },
  {
    id: 'laylo-munich-2024',
    date: '2024-11-14',
    time: null,
    venue: 'Strom',
    city: 'Munich',
    state: null,
    country: 'Germany',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-munich-2024'
  },
  {
    id: 'laylo-milan-2024',
    date: '2024-11-15',
    time: null,
    venue: 'Biko',
    city: 'Milan',
    state: null,
    country: 'Italy',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-milan-2024'
  },
  {
    id: 'laylo-zurich-2024',
    date: '2024-11-16',
    time: null,
    venue: 'Papiersaal',
    city: 'Zürich',
    state: null,
    country: 'Switzerland',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-zurich-2024'
  },
  {
    id: 'laylo-cologne-2024',
    date: '2024-11-18',
    time: null,
    venue: 'Luxor',
    city: 'Cologne',
    state: null,
    country: 'Germany',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-cologne-2024'
  },
  {
    id: 'laylo-amsterdam-2024',
    date: '2024-11-19',
    time: null,
    venue: 'Paradiso Tolhuistuin',
    city: 'Amsterdam',
    state: null,
    country: 'Netherlands',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-amsterdam-2024'
  },
  {
    id: 'laylo-antwerp-2024',
    date: '2024-11-21',
    time: null,
    venue: 'Trix',
    city: 'Antwerp',
    state: null,
    country: 'Belgium',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-antwerp-2024'
  },
  {
    id: 'laylo-paris-2024',
    date: '2024-11-22',
    time: null,
    venue: 'La Maroquinerie',
    city: 'Paris',
    state: null,
    country: 'France',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-paris-2024'
  },
  {
    id: 'laylo-london-2024',
    date: '2024-11-25',
    time: null,
    venue: 'Islington Assembly Hall',
    city: 'London',
    state: null,
    country: 'United Kingdom',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-london-2024'
  },
  {
    id: 'laylo-brighton-2024',
    date: '2024-11-27',
    time: null,
    venue: 'Patterns',
    city: 'Brighton',
    state: null,
    country: 'United Kingdom',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-brighton-2024'
  },
  {
    id: 'laylo-birmingham-2024',
    date: '2024-11-28',
    time: null,
    venue: 'Institute 2',
    city: 'Birmingham',
    state: null,
    country: 'United Kingdom',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-birmingham-2024'
  },
  {
    id: 'laylo-bristol-2024',
    date: '2024-11-29',
    time: null,
    venue: 'Exchange',
    city: 'Bristol',
    state: null,
    country: 'United Kingdom',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-bristol-2024'
  },
  {
    id: 'laylo-manchester-2024',
    date: '2024-12-01',
    time: null,
    venue: 'Gorilla',
    city: 'Manchester',
    state: null,
    country: 'United Kingdom',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-manchester-2024'
  },
  {
    id: 'laylo-glasgow-2024',
    date: '2024-12-02',
    time: null,
    venue: "St Luke's & The Winged Ox",
    city: 'Glasgow',
    state: null,
    country: 'United Kingdom',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-glasgow-2024'
  },
  {
    id: 'laylo-dublin-2024',
    date: '2024-12-05',
    time: null,
    venue: 'Button Factory',
    city: 'Dublin',
    state: null,
    country: 'Ireland',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-dublin-2024'
  },
  {
    id: 'laylo-barcelona-2024',
    date: '2024-12-07',
    time: null,
    venue: 'Razzmatazz 2',
    city: 'Barcelona',
    state: null,
    country: 'Spain',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-barcelona-2024'
  },
  {
    id: 'laylo-madrid-2024',
    date: '2024-12-08',
    time: null,
    venue: 'Chango',
    city: 'Madrid',
    state: null,
    country: 'Spain',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-madrid-2024'
  },
  {
    id: 'laylo-lisbon-2024',
    date: '2024-12-09',
    time: null,
    venue: 'LAV',
    city: 'Lisbon',
    state: null,
    country: 'Portugal',
    ticket_link: 'https://laylo.com/sadiejean/m/kVPxra',
    ticket_price: null,
    capacity: null,
    sold: 0,
    status: 'On Sale',
    description: null,
    is_active: true,
    laylo_id: 'laylo-lisbon-2024'
  }
]

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    console.log('🔄 [Sync Laylo] Starting sync of Laylo tour dates to database...')

    // First, clear existing Laylo tour dates to avoid duplicates
    const { error: deleteError } = await supabaseAdmin
      .from('tour_dates')
      .delete()
      .not('laylo_id', 'is', null)

    if (deleteError) {
      console.error('Error clearing existing Laylo tour dates:', deleteError)
      return NextResponse.json({ error: 'Failed to clear existing tour dates' }, { status: 500 })
    }

    // Insert all Laylo tour dates
    const { data, error } = await supabaseAdmin
      .from('tour_dates')
      .insert(LAYLO_TOUR_DATES)
      .select()

    if (error) {
      console.error('Error inserting Laylo tour dates:', error)
      return NextResponse.json({ error: 'Failed to insert tour dates' }, { status: 500 })
    }

    console.log(`✅ [Sync Laylo] Successfully synced ${data.length} tour dates from Laylo`)

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${data.length} tour dates from Laylo`,
      tourDates: data,
      total: data.length
    })

  } catch (error) {
    console.error('Sync Laylo tour dates error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
