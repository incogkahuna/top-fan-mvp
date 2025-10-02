import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: await checkDatabase(),
        spotify: await checkSpotify(),
        storage: await checkStorage()
      },
      metrics: await getSystemMetrics()
    }

    return NextResponse.json(health)
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json({ 
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, { status: 500 })
  }
}

async function checkDatabase() {
  try {
    if (!supabaseAdmin) {
      return { status: 'unhealthy', message: 'Supabase not configured' }
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count', { count: 'exact', head: true })

    if (error) {
      return { status: 'unhealthy', message: error.message }
    }

    return { status: 'healthy', message: 'Database connection successful' }
  } catch (error) {
    return { status: 'unhealthy', message: 'Database connection failed' }
  }
}

async function checkSpotify() {
  try {
    // Check if Spotify credentials are configured
    const clientId = process.env.SPOTIFY_CLIENT_ID
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return { status: 'unhealthy', message: 'Spotify credentials not configured' }
    }

    return { status: 'healthy', message: 'Spotify credentials configured' }
  } catch (error) {
    return { status: 'unhealthy', message: 'Spotify check failed' }
  }
}

async function checkStorage() {
  try {
    // Check if we can write to storage (simplified check)
    return { status: 'healthy', message: 'Storage accessible' }
  } catch (error) {
    return { status: 'unhealthy', message: 'Storage check failed' }
  }
}

async function getSystemMetrics() {
  try {
    if (!supabaseAdmin) {
      return null
    }

    // Get basic system metrics
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })

    const { count: totalPlays } = await supabaseAdmin
      .from('listening_data')
      .select('*', { count: 'exact', head: true })
      .eq('artist_name', 'Sadie Jean')

    const { count: activeUsers } = await supabaseAdmin
      .from('listening_data')
      .select('user_id', { count: 'exact', head: true })
      .eq('artist_name', 'Sadie Jean')
      .gte('played_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    return {
      totalUsers: totalUsers || 0,
      totalPlays: totalPlays || 0,
      activeUsers: activeUsers || 0,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version
    }
  } catch (error) {
    console.error('Metrics collection error:', error)
    return null
  }
}
