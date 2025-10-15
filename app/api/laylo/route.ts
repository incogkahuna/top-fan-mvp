import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface LayloUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  customFields?: Record<string, any>
}

interface LayloCampaign {
  id: string
  name: string
  status: string
  createdAt: string
  sentAt?: string
}

// Get Laylo API configuration
function getLayloConfig() {
  const apiKey = process.env.LAYLO_API_KEY
  if (!apiKey) {
    throw new Error('LAYLO_API_KEY not configured')
  }
  
  return {
    apiKey,
    baseUrl: 'https://api.laylo.com/v1'
  }
}

// Add user to Laylo fan list
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'add-user') {
      return await addUserToLaylo(request)
    } else if (action === 'send-notification') {
      return await sendLayloNotification(request)
    } else if (action === 'create-campaign') {
      return await createLayloCampaign(request)
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Laylo API error:', error)
    return NextResponse.json(
      { error: 'Laylo integration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Get Laylo data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    
    if (type === 'tours') {
      return await getLayloTours()
    } else if (type === 'users') {
      return await getLayloUsers()
    } else if (type === 'campaigns') {
      return await getLayloCampaigns()
    } else if (type === 'stats') {
      return await getLayloStats()
    }
    
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
  } catch (error) {
    console.error('Laylo API error:', error)
    return NextResponse.json(
      { error: 'Laylo integration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Add authenticated Spotify user to Laylo
async function addUserToLaylo(request: NextRequest) {
  try {
    const config = getLayloConfig()
    const body = await request.json()
    const { spotifyUserId, email, displayName, profileImage } = body
    
    if (!spotifyUserId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Check if user already exists in our database
    const { data: existingUser } = await supabaseAdmin!
      .from('users')
      .select('*')
      .eq('spotify_id', spotifyUserId)
      .single()
    
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }
    
    // Prepare Laylo user data
    const layloUser: LayloUser = {
      id: spotifyUserId,
      email: email,
      firstName: displayName?.split(' ')[0] || 'Fan',
      lastName: displayName?.split(' ').slice(1).join(' ') || '',
      customFields: {
        spotify_id: spotifyUserId,
        profile_image: profileImage,
        joined_via: 'spotify_auth',
        leaderboard_rank: existingUser.total_plays || 0,
        listening_time: existingUser.total_listening_time || 0
      }
    }
    
    // Add user to Laylo
    const response = await fetch(`${config.baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(layloUser)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Laylo API error: ${response.status} - ${errorData.message || 'Unknown error'}`)
    }
    
    const layloResponse = await response.json()
    
    // Update our database with Laylo user ID
    await supabaseAdmin!
      .from('users')
      .update({ 
        laylo_user_id: layloResponse.id,
        laylo_synced_at: new Date().toISOString()
      })
      .eq('spotify_id', spotifyUserId)
    
    return NextResponse.json({
      success: true,
      message: 'User added to Laylo successfully',
      layloUserId: layloResponse.id
    })
  } catch (error) {
    console.error('Error adding user to Laylo:', error)
    throw error
  }
}

// Send notification to Laylo users
async function sendLayloNotification(request: NextRequest) {
  try {
    const config = getLayloConfig()
    const body = await request.json()
    const { message, subject, targetUsers } = body
    
    if (!message || !subject) {
      return NextResponse.json({ error: 'Missing message or subject' }, { status: 400 })
    }
    
    const notificationData = {
      subject,
      message,
      targetUsers: targetUsers || 'all', // 'all' or specific user IDs
      type: 'tour_update'
    }
    
    const response = await fetch(`${config.baseUrl}/notifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificationData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Laylo API error: ${response.status} - ${errorData.message || 'Unknown error'}`)
    }
    
    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
      notificationId: result.id
    })
  } catch (error) {
    console.error('Error sending Laylo notification:', error)
    throw error
  }
}

// Create Laylo campaign
async function createLayloCampaign(request: NextRequest) {
  try {
    const config = getLayloConfig()
    const body = await request.json()
    const { name, subject, message, targetUsers } = body
    
    if (!name || !subject || !message) {
      return NextResponse.json({ error: 'Missing required campaign fields' }, { status: 400 })
    }
    
    const campaignData = {
      name,
      subject,
      message,
      targetUsers: targetUsers || 'all',
      type: 'email',
      status: 'draft'
    }
    
    const response = await fetch(`${config.baseUrl}/campaigns`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(campaignData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Laylo API error: ${response.status} - ${errorData.message || 'Unknown error'}`)
    }
    
    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      message: 'Campaign created successfully',
      campaignId: result.id
    })
  } catch (error) {
    console.error('Error creating Laylo campaign:', error)
    throw error
  }
}

// Get Laylo tours
async function getLayloTours() {
  try {
    const config = getLayloConfig()
    
    const response = await fetch(`${config.baseUrl}/tours`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
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
      layloId: tour.id,
      capacity: tour.capacity,
      sold: tour.sold,
      price: tour.price
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
          layloId: 'laylo-1',
          capacity: 500,
          sold: 150,
          price: '$25'
        },
        {
          id: '2',
          date: 'March 22, 2025',
          time: '9:00 PM',
          venue: 'The Fillmore',
          city: 'San Francisco, CA',
          ticketLink: 'https://laylo.com/early20storture/sf',
          status: 'Sold Out',
          layloId: 'laylo-2',
          capacity: 1200,
          sold: 1200,
          price: '$30'
        }
      ],
      error: 'Using sample data due to API error'
    })
  }
}

// Get Laylo users
async function getLayloUsers() {
  try {
    const config = getLayloConfig()
    
    const response = await fetch(`${config.baseUrl}/users`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Laylo API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json({ 
      users: data.users || [],
      total: data.total || 0
    })
  } catch (error) {
    console.error('Error fetching Laylo users:', error)
    return NextResponse.json({ 
      users: [],
      total: 0,
      error: 'Failed to fetch users'
    })
  }
}

// Get Laylo campaigns
async function getLayloCampaigns() {
  try {
    const config = getLayloConfig()
    
    const response = await fetch(`${config.baseUrl}/campaigns`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Laylo API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json({ 
      campaigns: data.campaigns || [],
      total: data.total || 0
    })
  } catch (error) {
    console.error('Error fetching Laylo campaigns:', error)
    return NextResponse.json({ 
      campaigns: [],
      total: 0,
      error: 'Failed to fetch campaigns'
    })
  }
}

// Get Laylo statistics
async function getLayloStats() {
  try {
    const config = getLayloConfig()
    
    const response = await fetch(`${config.baseUrl}/stats`, {
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Laylo API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json({ 
      stats: data,
      connected: true
    })
  } catch (error) {
    console.error('Error fetching Laylo stats:', error)
    // Return sample stats when Laylo API is not configured or fails
    return NextResponse.json({ 
      stats: {
        totalUsers: 42,
        totalCampaigns: 8,
        openRate: 0.23,
        clickRate: 0.15
      },
      connected: true,
      message: 'Using sample data - configure LAYLO_API_KEY for real stats'
    })
  }
}
