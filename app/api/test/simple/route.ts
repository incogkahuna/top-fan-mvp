import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    // Check if this is a photos request
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    if (type === 'photos') {
      return handlePhotosRequest()
    }
    
    if (type === 'laylo-tours') {
      return handleLayloToursRequest()
    }
    
    return NextResponse.json({
      success: true,
      message: 'Simple API test working',
      timestamp: new Date().toISOString(),
      env: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing',
        layloApiKey: process.env.LAYLO_API_KEY ? 'Set' : 'Missing'
      },
      supabaseClient: supabaseAdmin ? 'Connected' : 'Not connected'
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Simple test failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

async function handlePhotosRequest() {
  try {
    const photosDir = path.join(process.cwd(), 'public', 'photos')
    
    // Check if photos directory exists
    if (!fs.existsSync(photosDir)) {
      return NextResponse.json({ photos: [] })
    }

    // Read all files in the photos directory
    const files = fs.readdirSync(photosDir)
    
    // Filter for image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const photos = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        return imageExtensions.includes(ext)
      })
      .map(file => ({
        id: file,
        filename: file,
        url: `/photos/${file}`,
        alt: file.replace(/\.[^/.]+$/, '') // Remove extension for alt text
      }))
      .sort((a, b) => a.filename.localeCompare(b.filename))

    return NextResponse.json({ photos })
  } catch (error) {
    console.error('Error reading photos:', error)
    return NextResponse.json({ photos: [] })
  }
}

async function handleLayloToursRequest() {
  try {
    const layloApiKey = process.env.LAYLO_API_KEY
    
    if (!layloApiKey) {
      // Return sample data if no API key is configured
      return NextResponse.json({
        tours: [
          {
            id: '1',
            date: 'March 15, 2025',
            time: '8:00 PM',
            venue: 'The Roxy Theatre',
            city: 'Los Angeles, CA',
            ticketLink: 'https://laylo.com/early20storture/la',
            status: 'On Sale',
            layloId: 'laylo-1'
          },
          {
            id: '2',
            date: 'March 22, 2025',
            time: '9:00 PM',
            venue: 'The Fillmore',
            city: 'San Francisco, CA',
            ticketLink: 'https://laylo.com/early20storture/sf',
            status: 'Sold Out',
            layloId: 'laylo-2'
          }
        ],
        message: 'Using sample data - configure LAYLO_API_KEY for real data'
      })
    }

    // Make request to Laylo API
    const response = await fetch('https://api.laylo.com/v1/tours', {
      headers: {
        'Authorization': `Bearer ${layloApiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Laylo API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Transform Laylo data to our format
    const tours = data.tours?.map((tour: any) => ({
      id: tour.id,
      date: tour.date,
      time: tour.time,
      venue: tour.venue,
      city: tour.city,
      ticketLink: tour.ticketLink,
      status: tour.status,
      layloId: tour.layloId
    })) || []

    return NextResponse.json({ tours })
  } catch (error) {
    console.error('Error fetching Laylo tours:', error)
    // Return sample data on error
    return NextResponse.json({
      tours: [
        {
          id: '1',
          date: 'March 15, 2025',
          time: '8:00 PM',
          venue: 'The Roxy Theatre',
          city: 'Los Angeles, CA',
          ticketLink: 'https://laylo.com/early20storture/la',
          status: 'On Sale',
          layloId: 'laylo-1'
        }
      ],
      error: 'Using sample data due to API error'
    })
  }
}
