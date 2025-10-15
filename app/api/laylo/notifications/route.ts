import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Send tour notification to Laylo users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      tourId, 
      message, 
      subject, 
      targetUsers = 'all',
      notificationType = 'tour_update'
    } = body

    if (!message || !subject) {
      return NextResponse.json({ error: 'Missing message or subject' }, { status: 400 })
    }

    // Get users to notify
    let usersToNotify = []
    
    if (targetUsers === 'all') {
      // Get all users with Laylo integration
      const { data: users } = await supabaseAdmin
        .from('users')
        .select('spotify_id, display_name, email, laylo_user_id')
        .not('laylo_user_id', 'is', null)
      
      usersToNotify = users || []
    } else if (targetUsers === 'top_fans') {
      // Get top 10 fans by listening time
      const { data: topFans } = await supabaseAdmin
        .from('users')
        .select('spotify_id, display_name, email, laylo_user_id, total_plays')
        .not('laylo_user_id', 'is', null)
        .order('total_plays', { ascending: false })
        .limit(10)
      
      usersToNotify = topFans || []
    } else if (Array.isArray(targetUsers)) {
      // Specific user IDs
      const { data: specificUsers } = await supabaseAdmin
        .from('users')
        .select('spotify_id, display_name, email, laylo_user_id')
        .in('spotify_id', targetUsers)
        .not('laylo_user_id', 'is', null)
      
      usersToNotify = specificUsers || []
    }

    if (usersToNotify.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No users to notify',
        notifiedCount: 0
      })
    }

    // Send notification via Laylo API
    const layloResponse = await fetch('/api/laylo?action=send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        subject,
        targetUsers: usersToNotify.map(user => user.laylo_user_id),
        notificationType
      })
    })

    if (!layloResponse.ok) {
      const error = await layloResponse.json()
      throw new Error(`Laylo notification failed: ${error.message}`)
    }

    const layloResult = await layloResponse.json()

    // Log notification in database
    await supabaseAdmin
      .from('notifications')
      .insert({
        type: notificationType,
        subject,
        message,
        target_count: usersToNotify.length,
        tour_id: tourId,
        laylo_notification_id: layloResult.notificationId,
        sent_at: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
      notifiedCount: usersToNotify.length,
      notificationId: layloResult.notificationId
    })

  } catch (error) {
    console.error('Error sending tour notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Get notification history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw error
    }

    return NextResponse.json({
      notifications: notifications || [],
      total: notifications?.length || 0
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
