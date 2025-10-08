import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'
    const type = searchParams.get('type') || 'all'

    let data

    switch (type) {
      case 'users':
        data = await exportUsers()
        break
      case 'listening':
        data = await exportListeningData()
        break
      case 'analytics':
        data = await exportAnalytics()
        break
      case 'all':
      default:
        data = await exportAllData()
        break
    }

    if (format === 'csv') {
      const csv = convertToCSV(data)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="export-${type}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function exportUsers() {
  const { data: users, error } = await supabaseAdmin!
    .from('users')
    .select(`
      id,
      display_name,
      email,
      profile_image_url,
      created_at,
      updated_at
    `)

  if (error) throw error
  return users
}

async function exportListeningData() {
  const { data: listeningData, error } = await supabaseAdmin!
    .from('listening_data')
    .select(`
      *,
      users!inner(display_name, email)
    `)
    .eq('artist_name', 'Sadie Jean')

  if (error) throw error
  return listeningData
}

async function exportAnalytics() {
  const { data: users, error: usersError } = await supabaseAdmin!
    .from('users')
    .select('id, display_name, created_at')

  if (usersError) throw usersError

  const { data: listeningData, error: listeningError } = await supabaseAdmin!
    .from('listening_data')
    .select('*')
    .eq('artist_name', 'Sadie Jean')

  if (listeningError) throw listeningError

  // Calculate analytics
  const analytics = {
    totalUsers: users?.length || 0,
    totalPlays: listeningData?.length || 0,
    uniqueSongs: new Set(listeningData?.map(track => track.track_name)).size || 0,
    totalListeningTime: listeningData?.reduce((sum, track) => sum + (track.duration_ms || 0), 0) || 0,
    averagePlaysPerUser: users?.length ? (listeningData?.length || 0) / users.length : 0,
    topTracks: getTopTracks(listeningData || []),
    userGrowth: getUserGrowth(users || []),
    listeningPatterns: getListeningPatterns(listeningData || [])
  }

  return analytics
}

async function exportAllData() {
  const [users, listeningData] = await Promise.all([
    exportUsers(),
    exportListeningData()
  ])

  return {
    users,
    listeningData,
    exportDate: new Date().toISOString(),
    totalRecords: users.length + listeningData.length
  }
}

function getTopTracks(data: any[]) {
  const trackCounts: { [key: string]: number } = {}
  
  data.forEach(track => {
    trackCounts[track.track_name] = (trackCounts[track.track_name] || 0) + 1
  })

  return Object.entries(trackCounts)
    .map(([name, plays]) => ({ name, plays }))
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 20)
}

function getUserGrowth(users: any[]) {
  const growthByMonth: { [key: string]: number } = {}
  
  users.forEach(user => {
    const date = new Date(user.created_at)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    growthByMonth[monthKey] = (growthByMonth[monthKey] || 0) + 1
  })

  return Object.entries(growthByMonth).map(([month, count]) => ({
    month,
    newUsers: count
  }))
}

function getListeningPatterns(data: any[]) {
  const hourlyPatterns: { [key: number]: number } = {}
  const dailyPatterns: { [key: string]: number } = {}
  
  data.forEach(track => {
    const date = new Date(track.played_at)
    const hour = date.getHours()
    const day = date.toDateString()
    
    hourlyPatterns[hour] = (hourlyPatterns[hour] || 0) + 1
    dailyPatterns[day] = (dailyPatterns[day] || 0) + 1
  })

  return {
    hourly: Object.entries(hourlyPatterns).map(([hour, plays]) => ({
      hour: parseInt(hour),
      plays
    })),
    daily: Object.entries(dailyPatterns).map(([day, plays]) => ({
      day,
      plays
    }))
  }
}

function convertToCSV(data: any): string {
  if (!Array.isArray(data) || data.length === 0) {
    return 'No data available'
  }

  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      }).join(',')
    )
  ]

  return csvRows.join('\n')
}
