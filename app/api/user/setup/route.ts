import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🆕 User setup request received:', {
      spotify_id: body.spotify_id,
      display_name: body.display_name,
      email: body.email,
      has_custom_handle: !!body.custom_handle,
      has_bio: !!body.bio
    })

    if (!supabaseAdmin) {
      console.error('❌ Supabase admin client not configured')
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Validate required fields
    if (!body.spotify_id || !body.display_name || !body.email) {
      return NextResponse.json({ 
        error: 'Missing required fields: spotify_id, display_name, email' 
      }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('spotify_id', body.spotify_id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('❌ Error checking existing user:', fetchError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (existingUser) {
      console.log('🔄 User already exists, updating profile:', body.spotify_id)
      
      // Update existing user with new profile data
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          display_name: body.display_name,
          email: body.email,
          profile_image: body.profile_image,
          custom_handle: body.custom_handle,
          bio: body.bio,
          privacy_settings: body.privacy_settings,
          spotify_access_token: body.access_token,
          spotify_refresh_token: body.refresh_token,
          token_expires_at: new Date(parseInt(body.expires_at)).toISOString(),
          spotify_scope: body.scope,
          updated_at: new Date().toISOString()
        })
        .eq('spotify_id', body.spotify_id)
      
      if (updateError) {
        console.error('❌ Error updating user:', updateError)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
      }

      console.log('✅ User profile updated successfully')
      return NextResponse.json({ 
        success: true, 
        message: 'Profile updated successfully',
        user_id: existingUser.id
      })
    }

    // Create new user
    console.log('🆕 Creating new user:', body.spotify_id)
    
    const userData = {
      spotify_id: body.spotify_id,
      display_name: body.display_name,
      email: body.email,
      profile_image: body.profile_image,
      custom_handle: body.custom_handle,
      bio: body.bio,
      privacy_settings: body.privacy_settings,
      spotify_access_token: body.access_token,
      spotify_refresh_token: body.refresh_token,
      token_expires_at: new Date(parseInt(body.expires_at)).toISOString(),
      spotify_scope: body.scope,
      total_plays: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (createError) {
      console.error('❌ Error creating user:', createError)
      console.error('❌ User data that failed:', userData)
      return NextResponse.json({ 
        error: 'Failed to create profile',
        details: createError.message
      }, { status: 500 })
    }

    console.log('✅ New user created successfully:', newUser.id)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile created successfully',
      user_id: newUser.id
    })

  } catch (error) {
    console.error('❌ User setup error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
