import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { syncUserListeningData } from '@/lib/sync-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🆕 User setup request received:', {
      spotify_id: body.spotify_id,
      display_name: body.display_name,
      email: body.email,
      has_custom_handle: !!body.custom_handle,
      has_bio: !!body.bio,
      has_profile_image: !!body.profile_image,
      has_access_token: !!body.access_token,
      has_refresh_token: !!body.refresh_token,
      expires_at: body.expires_at
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
          custom_avatar_url: body.custom_profile_image,
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
      custom_avatar_url: body.custom_profile_image,
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
    console.log('✅ User data saved to database:', {
      spotify_id: newUser.spotify_id,
      display_name: newUser.display_name,
      email: newUser.email,
      custom_handle: newUser.custom_handle,
      bio: newUser.bio
    })

    // Automatically sync user's listening data after profile creation
    console.log('🔄 Starting automatic sync for new user:', newUser.spotify_id)
    
    try {
      // Use immediate sync for faster response
      const syncResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/api/user/immediate-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotify_id: newUser.spotify_id })
      })
      
      if (syncResponse.ok) {
        const syncData = await syncResponse.json()
        console.log('✅ Automatic sync completed:', syncData.sync_results)
      } else {
        console.log('⚠️ Automatic sync failed (non-critical):', syncResponse.statusText)
      }
    } catch (syncError) {
      console.log('⚠️ Automatic sync error (non-critical):', syncError)
      // Don't fail profile creation if sync fails
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Profile created successfully',
      user_id: newUser.id,
      user_data: {
        spotify_id: newUser.spotify_id,
        display_name: newUser.display_name,
        email: newUser.email
      }
    })

  } catch (error) {
    console.error('❌ User setup error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
