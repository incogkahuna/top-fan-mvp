import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAdminSession } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  // Check admin authentication
  const authResult = verifyAdminSession(request)
  
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.error || 'Admin authentication required' }, 
      { status: 401 }
    )
  }

  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Get all content types
    const content = {
      songs: await getSongs(),
      photos: await getPhotos(),
      tourDates: await getTourDates(),
      announcements: await getAnnouncements()
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error('Content management error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { type, data } = body

    let result

    switch (type) {
      case 'song':
        result = await addSong(data)
        break
      case 'photo':
        result = await addPhoto(data)
        break
      case 'tourDate':
        result = await addTourDate(data)
        break
      case 'announcement':
        result = await addAnnouncement(data)
        break
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Content creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getSongs() {
  // In a real app, this would come from a songs table
  return [
    {
      id: 1,
      title: 'Early 20\'s Torture',
      artist: 'Sadie Jean',
      duration: '3:45',
      plays: 1234,
      addedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Slow Burn',
      artist: 'Sadie Jean',
      duration: '4:12',
      plays: 987,
      addedDate: '2024-01-10'
    }
  ]
}

async function getPhotos() {
  // In a real app, this would come from a photos table
  return [
    {
      id: 1,
      title: 'Studio Session',
      url: '/photos/studio-1.jpg',
      uploadDate: '2024-01-20',
      views: 456
    },
    {
      id: 2,
      title: 'Live Performance',
      url: '/photos/live-1.jpg',
      uploadDate: '2024-01-18',
      views: 789
    }
  ]
}

async function getTourDates() {
  // In a real app, this would come from a tour_dates table
  return [
    {
      id: 1,
      venue: 'The Roxy',
      city: 'Los Angeles, CA',
      date: '2024-03-15',
      ticketsAvailable: 200,
      status: 'on-sale'
    },
    {
      id: 2,
      venue: 'Bowery Ballroom',
      city: 'New York, NY',
      date: '2024-03-22',
      ticketsAvailable: 150,
      status: 'sold-out'
    }
  ]
}

async function getAnnouncements() {
  // In a real app, this would come from an announcements table
  return [
    {
      id: 1,
      title: 'New Album Coming Soon',
      content: 'We\'re excited to announce our debut album will be released this spring!',
      publishDate: '2024-01-25',
      isActive: true
    },
    {
      id: 2,
      title: 'Tour Dates Announced',
      content: 'Check out our upcoming tour dates and get your tickets!',
      publishDate: '2024-01-20',
      isActive: true
    }
  ]
}

async function addSong(data: any) {
  // In a real app, this would insert into a songs table
  return { success: true, id: Date.now() }
}

async function addPhoto(data: any) {
  // In a real app, this would handle file upload and insert into photos table
  return { success: true, id: Date.now() }
}

async function addTourDate(data: any) {
  // In a real app, this would insert into tour_dates table
  return { success: true, id: Date.now() }
}

async function addAnnouncement(data: any) {
  // In a real app, this would insert into announcements table
  return { success: true, id: Date.now() }
}
