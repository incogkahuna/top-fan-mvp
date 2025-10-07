'use client'

import { useState, useEffect } from 'react'

interface SpotifyUser {
  spotify_id: string
  display_name: string
  email?: string
  profile_image?: string
}

interface UseSpotifyAuthReturn {
  user: SpotifyUser | null
  isLoading: boolean
  isConnected: boolean
  connectSpotify: () => void
  disconnectSpotify: () => void
}

export function useSpotifyAuth(): UseSpotifyAuthReturn {
  const [user, setUser] = useState<SpotifyUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  console.log('🔍 useSpotifyAuth hook initialized, user state:', user, 'isLoading:', isLoading)

  // Check if user is connected on mount
  useEffect(() => {
    console.log('🔍 useSpotifyAuth useEffect triggered')
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const spotifyUserId = localStorage.getItem('spotify_user_id')
      
      if (!spotifyUserId) {
        console.log('🔍 No spotify_user_id in localStorage')
        setIsLoading(false)
        return
      }
      
      console.log('🔍 Checking auth for user ID:', spotifyUserId)
      const response = await fetch(`/api/auth/me?userId=${spotifyUserId}`)
      
      if (response.ok) {
        const userData = await response.json()
        console.log('✅ User authenticated:', userData.display_name)
        console.log('✅ Setting user state:', userData)
        setUser(userData)
      } else {
        console.log('❌ Auth check failed:', response.status)
        const errorData = await response.json().catch(() => ({}))
        console.log('❌ Error details:', errorData)
        // Clear invalid localStorage
        localStorage.removeItem('spotify_user_id')
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      // Clear localStorage on error
      localStorage.removeItem('spotify_user_id')
    } finally {
      setIsLoading(false)
    }
  }

  const connectSpotify = () => {
    window.location.href = '/api/auth/spotify'
  }

  const disconnectSpotify = async () => {
    try {
      // Clear localStorage first
      localStorage.removeItem('spotify_user_id')
      
      // Try to call logout API (optional)
      try {
        await fetch('/api/auth/logout', { method: 'POST' })
      } catch (apiError) {
        console.log('Logout API call failed, but continuing with local logout')
      }
      
      // Clear user state
      setUser(null)
      
      // Reload page to reset everything
      window.location.reload()
    } catch (error) {
      console.error('Error disconnecting Spotify:', error)
    }
  }

  return {
    user,
    isLoading,
    isConnected: !!user,
    connectSpotify,
    disconnectSpotify
  }
}
