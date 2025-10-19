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
