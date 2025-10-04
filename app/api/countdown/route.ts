import { NextRequest, NextResponse } from 'next/server'

// In a real app, you'd store this in a database
// For now, we'll use a simple in-memory store
let countdownConfig = {
  targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  title: "Next Release",
  description: "Stay tuned for updates!",
  isActive: true
}

export async function GET() {
  try {
    return NextResponse.json(countdownConfig)
  } catch (error) {
    console.error('Error fetching countdown data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch countdown data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const { targetDate, title, description, isActive } = body
    
    if (!targetDate || !title || !description || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: targetDate, title, description, isActive' },
        { status: 400 }
      )
    }

    // Validate the date
    const parsedDate = new Date(targetDate)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Update the countdown configuration
    countdownConfig = {
      targetDate: parsedDate.toISOString(),
      title: title.trim(),
      description: description.trim(),
      isActive
    }

    return NextResponse.json({
      success: true,
      countdown: countdownConfig
    })
  } catch (error) {
    console.error('Error updating countdown data:', error)
    return NextResponse.json(
      { error: 'Failed to update countdown data' },
      { status: 500 }
    )
  }
}
