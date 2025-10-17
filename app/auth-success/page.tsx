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
    <div className="min-h-screen bg-[#282828] flex items-center justify-center p-4">
      <div className="text-center bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full">
        <div className="text-[#f5f1e8] text-2xl font-bold mb-4">🎉 Successfully Connected!</div>
        <div className="text-[#f5f1e8]/80 mb-6">Redirecting to your profile...</div>
        <div className="mt-4 mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E98B8B] border-t-transparent mx-auto"></div>
        </div>
        <a 
          href="/profile"
          className="inline-block bg-[#E98B8B] hover:bg-[#f0a0a0] text-white font-medium py-3 px-6 rounded-full transition-colors duration-200"
        >
          Click here if not redirected
        </a>
      </div>
    </div>
  )
}
