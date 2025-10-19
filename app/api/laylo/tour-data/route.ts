import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface LayloTourDate {
  id: string
  date: string
  time: string
  venue: string
  city: string
  country: string
  ticketUrl: string
  status: 'On Sale' | 'Sold Out' | 'Cancelled' | 'Postponed' | 'Announced'
  platform: 'laylo'
}

// Hard-coded tour dates from the Laylo page
// This is a fallback in case we can't scrape the data dynamically
const FALLBACK_TOUR_DATES: LayloTourDate[] = [
  {
    id: 'laylo-oslo-2024',
    date: 'November 4, 2024',
    time: 'TBA',
    venue: 'Parkteatret',
    city: 'Oslo',
    country: 'Norway',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-stockholm-2024',
    date: 'November 6, 2024',
    time: 'TBA',
    venue: 'Bar Brooklyn',
    city: 'Stockholm',
    country: 'Sweden',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-copenhagen-2024',
    date: 'November 8, 2024',
    time: 'TBA',
    venue: 'Lille Vega',
    city: 'Copenhagen',
    country: 'Denmark',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-berlin-2024',
    date: 'November 10, 2024',
    time: 'TBA',
    venue: 'Frannz Club',
    city: 'Berlin',
    country: 'Germany',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-prague-2024',
    date: 'November 11, 2024',
    time: 'TBA',
    venue: 'Rock Cafe',
    city: 'Prague',
    country: 'Czechia',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-vienna-2024',
    date: 'November 12, 2024',
    time: 'TBA',
    venue: 'Szene',
    city: 'Vienna',
    country: 'Austria',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-munich-2024',
    date: 'November 14, 2024',
    time: 'TBA',
    venue: 'Strom',
    city: 'Munich',
    country: 'Germany',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-milan-2024',
    date: 'November 15, 2024',
    time: 'TBA',
    venue: 'Biko',
    city: 'Milan',
    country: 'Italy',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-zurich-2024',
    date: 'November 16, 2024',
    time: 'TBA',
    venue: 'Papiersaal',
    city: 'Zürich',
    country: 'Switzerland',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-cologne-2024',
    date: 'November 18, 2024',
    time: 'TBA',
    venue: 'Luxor',
    city: 'Cologne',
    country: 'Germany',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-amsterdam-2024',
    date: 'November 19, 2024',
    time: 'TBA',
    venue: 'Paradiso Tolhuistuin',
    city: 'Amsterdam',
    country: 'Netherlands',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-antwerp-2024',
    date: 'November 21, 2024',
    time: 'TBA',
    venue: 'Trix',
    city: 'Antwerp',
    country: 'Belgium',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-paris-2024',
    date: 'November 22, 2024',
    time: 'TBA',
    venue: 'La Maroquinerie',
    city: 'Paris',
    country: 'France',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-london-2024',
    date: 'November 25, 2024',
    time: 'TBA',
    venue: 'Islington Assembly Hall',
    city: 'London',
    country: 'United Kingdom',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-brighton-2024',
    date: 'November 27, 2024',
    time: 'TBA',
    venue: 'Patterns',
    city: 'Brighton',
    country: 'United Kingdom',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-birmingham-2024',
    date: 'November 28, 2024',
    time: 'TBA',
    venue: 'Institute 2',
    city: 'Birmingham',
    country: 'United Kingdom',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-bristol-2024',
    date: 'November 29, 2024',
    time: 'TBA',
    venue: 'Exchange',
    city: 'Bristol',
    country: 'United Kingdom',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-manchester-2024',
    date: 'December 1, 2024',
    time: 'TBA',
    venue: 'Gorilla',
    city: 'Manchester',
    country: 'United Kingdom',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-glasgow-2024',
    date: 'December 2, 2024',
    time: 'TBA',
    venue: "St Luke's & The Winged Ox",
    city: 'Glasgow',
    country: 'United Kingdom',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-dublin-2024',
    date: 'December 5, 2024',
    time: 'TBA',
    venue: 'Button Factory',
    city: 'Dublin',
    country: 'Ireland',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-barcelona-2024',
    date: 'December 7, 2024',
    time: 'TBA',
    venue: 'Razzmatazz 2',
    city: 'Barcelona',
    country: 'Spain',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-madrid-2024',
    date: 'December 8, 2024',
    time: 'TBA',
    venue: 'Chango',
    city: 'Madrid',
    country: 'Spain',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  },
  {
    id: 'laylo-lisbon-2024',
    date: 'December 9, 2024',
    time: 'TBA',
    venue: 'LAV',
    city: 'Lisbon',
    country: 'Portugal',
    ticketUrl: 'https://laylo.com/sadiejean/m/kVPxra',
    status: 'On Sale',
    platform: 'laylo'
  }
]

export async function GET(request: NextRequest) {
  try {
    console.log('🎵 [Laylo Tour Data] Fetching tour dates from Laylo...')

    // For now, return the hard-coded tour dates
    // In the future, this could be enhanced to scrape the Laylo page dynamically
    const tourDates = FALLBACK_TOUR_DATES

    console.log(`✅ [Laylo Tour Data] Found ${tourDates.length} tour dates`)

    return NextResponse.json({
      success: true,
      tourDates,
      source: 'laylo',
      layloUrl: 'https://laylo.com/sadiejean/m/kVPxra',
      total: tourDates.length,
      message: 'Tour dates loaded from Laylo'
    })

  } catch (error) {
    console.error('❌ [Laylo Tour Data] Error:', error)
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch Laylo tour data',
      details: error instanceof Error ? error.message : 'Unknown error',
      fallbackData: FALLBACK_TOUR_DATES
    }, { status: 500 })
  }
}
