'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setSpotifyUserId } from '@/lib/auth-storage'

export default function AuthSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const spotifyUserId = searchParams.get('spotify_user_id')
    const displayName = searchParams.get('display_name')
    const email = searchParams.get('email')
    const profileImage = searchParams.get('profile_image')
    const spotifyConnected = searchParams.get('spotify_connected')

    console.log('🔍 Auth Success Page - Received params:', {
      spotifyUserId,
      displayName,
      email,
      profileImage,
      spotifyConnected
    })

    if (spotifyUserId && spotifyConnected === 'true') {
      // Store the user ID in localStorage
      setSpotifyUserId(spotifyUserId)
      
      console.log('✅ Stored Spotify user ID in localStorage:', spotifyUserId)
      
      // Store additional user data in localStorage for immediate use
      if (typeof window !== 'undefined') {
        localStorage.setItem('spotify_user_data', JSON.stringify({
          spotify_id: spotifyUserId,
          display_name: displayName,
          email: email,
          profile_image: profileImage
        }))
      }
      
      // Redirect to profile page after a short delay
      setTimeout(() => {
        router.push('/profile')
      }, 1000)
    } else {
      // If no valid data, redirect to user page
      console.log('❌ No valid auth data, redirecting to /user')
      router.push('/user')
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="text-center">
        <div className="text-[#f5f1e8] text-xl mb-4">🎉 Successfully connected to Spotify!</div>
        <div className="text-[#f5f1e8]/60">Redirecting to your profile...</div>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E98B8B] mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
