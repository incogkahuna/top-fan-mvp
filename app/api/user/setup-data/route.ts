import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for temporary user setup data
// In production, this could be Redis or a database
const userSetupData = new Map<string, any>()

// Clean up old data (older than 10 minutes)
setInterval(() => {
  const now = Date.now()
  userSetupData.forEach((data, key) => {
    if (now - data.timestamp > 10 * 60 * 1000) { // 10 minutes
      userSetupData.delete(key)
    }
  })
}, 5 * 60 * 1000) // Clean up every 5 minutes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.spotify_id) {
      return NextResponse.json({ error: 'spotify_id is required' }, { status: 400 })
    }
    
    console.log('💾 Storing user setup data for:', body.spotify_id)
    
    // Store the data
    userSetupData.set(body.spotify_id, {
      ...body,
      timestamp: Date.now()
    })
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('❌ Error storing user setup data:', error)
    return NextResponse.json({ error: 'Failed to store data' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const spotifyId = searchParams.get('spotify_id')
    
    if (!spotifyId) {
      return NextResponse.json({ error: 'spotify_id is required' }, { status: 400 })
    }
    
    console.log('🔍 Retrieving user setup data for:', spotifyId)
    
    const data = userSetupData.get(spotifyId)
    
    if (!data) {
      return NextResponse.json({ error: 'Setup data not found or expired' }, { status: 404 })
    }
    
    // Check if data is expired (older than 10 minutes)
    if (Date.now() - data.timestamp > 10 * 60 * 1000) {
      userSetupData.delete(spotifyId)
      return NextResponse.json({ error: 'Setup data expired' }, { status: 410 })
    }
    
    console.log('✅ User setup data retrieved:', {
      spotify_id: data.spotify_id,
      display_name: data.display_name,
      email: data.email,
      has_access_token: !!data.access_token
    })
    
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('❌ Error retrieving user setup data:', error)
    return NextResponse.json({ error: 'Failed to retrieve data' }, { status: 500 })
  }
}
