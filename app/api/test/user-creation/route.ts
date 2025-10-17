import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 })
    }

    // Test user data that matches what we're trying to insert
    const testUserId = 'test_spotify_id_' + Date.now()
    const testUserData = {
      display_name: 'Test User',
      email: 'test@example.com',
      spotify_id: testUserId,
      spotify_access_token: 'test_access_token',
      spotify_refresh_token: 'test_refresh_token',
      token_expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      spotify_scope: 'test_scope',
      profile_image: 'https://example.com/image.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('🧪 Testing user creation with data:', testUserData)

    // Try to insert the test user
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(testUserData)
      .select()

    if (error) {
      console.error('❌ User creation test failed:', error)
      return NextResponse.json({ 
        error: 'User creation failed', 
        details: error,
        testData: testUserData
      }, { status: 500 })
    }

    console.log('✅ User creation test succeeded:', data)

    // Clean up test data
    await supabaseAdmin
      .from('users')
      .delete()
      .eq('spotify_id', testUserId)

    return NextResponse.json({ 
      success: true, 
      message: 'User creation test passed',
      createdUser: data[0]
    })

  } catch (error) {
    console.error('❌ User creation test error:', error)
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error 
    }, { status: 500 })
  }
}
