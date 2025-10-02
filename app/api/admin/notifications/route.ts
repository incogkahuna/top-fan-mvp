import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    // Get recent notifications
    const { data: notifications, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Notifications fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
    }

    return NextResponse.json(notifications || [])
  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { title, message, type, targetUsers } = body

    // Create notification
    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        title,
        message,
        type: type || 'info',
        target_users: targetUsers || null, // null means all users
        created_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Notification creation error:', error)
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
    }

    return NextResponse.json(notification[0])
  } catch (error) {
    console.error('Notification creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
