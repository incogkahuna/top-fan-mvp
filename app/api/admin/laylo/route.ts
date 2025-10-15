import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Admin endpoints for Laylo management
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'stats') {
      return await getLayloAdminStats()
    } else if (action === 'users') {
      return await getLayloUsers()
    } else if (action === 'campaigns') {
      return await getLayloCampaigns()
    } else if (action === 'notifications') {
      return await getNotificationHistory()
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Laylo admin error:', error)
    return NextResponse.json(
      { error: 'Admin operation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'send-tour-notification') {
      return await sendTourNotification(request)
    } else if (action === 'create-campaign') {
      return await createCampaign(request)
    } else if (action === 'sync-users') {
      return await syncUsersToLaylo(request)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Laylo admin error:', error)
    return NextResponse.json(
      { error: 'Admin operation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Get comprehensive Laylo admin stats
async function getLayloAdminStats() {
  try {
    // Get user stats
    const { data: userStats } = await supabaseAdmin
      .from('users')
      .select('laylo_user_id, total_plays, created_at')
      .not('laylo_user_id', 'is', null)

    // Get notification stats
    const { data: notificationStats } = await supabaseAdmin
      .from('notifications')
      .select('type, target_count, sent_at')

    // Get leaderboard stats
    const { data: leaderboardStats } = await supabaseAdmin
      .from('users')
      .select('total_plays, total_listening_time')
      .not('total_plays', 'is', null)
      .order('total_plays', { ascending: false })
      .limit(10)

    // Calculate stats
    const totalLayloUsers = userStats?.length || 0
    const totalNotifications = notificationStats?.length || 0
    const totalNotified = notificationStats?.reduce((sum, n) => sum + (n.target_count || 0), 0) || 0
    const topFan = leaderboardStats?.[0]

    // Get recent activity
    const recentNotifications = notificationStats
      ?.filter(n => new Date(n.sent_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      ?.length || 0

    return NextResponse.json({
      stats: {
        totalLayloUsers,
        totalNotifications,
        totalNotified,
        recentNotifications,
        topFan: topFan ? {
          plays: topFan.total_plays,
          listeningTime: topFan.total_listening_time
        } : null
      }
    })
  } catch (error) {
    console.error('Error getting Laylo admin stats:', error)
    throw error
  }
}

// Get Laylo users with additional info
async function getLayloUsers() {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select(`
        spotify_id,
        display_name,
        email,
        laylo_user_id,
        laylo_synced_at,
        total_plays,
        total_listening_time,
        created_at
      `)
      .not('laylo_user_id', 'is', null)
      .order('total_plays', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      users: users || [],
      total: users?.length || 0
    })
  } catch (error) {
    console.error('Error getting Laylo users:', error)
    throw error
  }
}

// Get Laylo campaigns
async function getLayloCampaigns() {
  try {
    const response = await fetch('/api/laylo?type=campaigns')
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error getting Laylo campaigns:', error)
    throw error
  }
}

// Get notification history
async function getNotificationHistory() {
  try {
    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    return NextResponse.json({
      notifications: notifications || [],
      total: notifications?.length || 0
    })
  } catch (error) {
    console.error('Error getting notification history:', error)
    throw error
  }
}

// Send tour notification
async function sendTourNotification(request: NextRequest) {
  try {
    const body = await request.json()
    const { tourId, message, subject, targetUsers = 'all' }

    if (!message || !subject) {
      return NextResponse.json({ error: 'Missing message or subject' }, { status: 400 })
    }

    // Send via notifications API
    const response = await fetch('/api/laylo/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tourId,
        message,
        subject,
        targetUsers,
        notificationType: 'tour_update'
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send notification')
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Tour notification sent successfully',
      ...result
    })
  } catch (error) {
    console.error('Error sending tour notification:', error)
    throw error
  }
}

// Create campaign
async function createCampaign(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, subject, message, targetUsers = 'all' }

    if (!name || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create via Laylo API
    const response = await fetch('/api/laylo?action=create-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        subject,
        message,
        targetUsers
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create campaign')
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Campaign created successfully',
      ...result
    })
  } catch (error) {
    console.error('Error creating campaign:', error)
    throw error
  }
}

// Sync users to Laylo
async function syncUsersToLaylo(request: NextRequest) {
  try {
    const body = await request.json()
    const { limit = 10 } = body

    // Get users not yet synced to Laylo
    const { data: usersToSync, error } = await supabaseAdmin
      .from('users')
      .select('spotify_id, display_name, email, profile_image')
      .is('laylo_user_id', null)
      .not('email', 'is', null)
      .limit(limit)

    if (error) {
      throw error
    }

    if (!usersToSync || usersToSync.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users to sync',
        syncedCount: 0
      })
    }

    // Sync each user to Laylo
    let syncedCount = 0
    const errors = []

    for (const user of usersToSync) {
      try {
        const response = await fetch('/api/laylo?action=add-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            spotifyUserId: user.spotify_id,
            email: user.email,
            displayName: user.display_name,
            profileImage: user.profile_image
          })
        })

        if (response.ok) {
          syncedCount++
        } else {
          const error = await response.json()
          errors.push({ userId: user.spotify_id, error: error.message })
        }
      } catch (error) {
        errors.push({ userId: user.spotify_id, error: 'Sync failed' })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${syncedCount} users to Laylo`,
      syncedCount,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    console.error('Error syncing users to Laylo:', error)
    throw error
  }
}
