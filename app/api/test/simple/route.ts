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
    
    return NextResponse.json({
      success: true,
      message: 'Simple API test working',
      timestamp: new Date().toISOString(),
      env: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing',
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing'
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
