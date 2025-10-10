'use client'

import { useState, useEffect } from 'react'
import { getSpotifyUserId, setSpotifyUserId, removeSpotifyUserId } from './auth-storage'

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
  const [isHydrated, setIsHydrated] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Handle hydration and mounting
  useEffect(() => {
    setIsHydrated(true)
    setMounted(true)
  }, [])

  // Check if user is connected on mount (only after hydration and mounting)
  useEffect(() => {
    if (isHydrated && mounted) {
      checkAuthStatus()
    }
  }, [isHydrated, mounted])

  const checkAuthStatus = async () => {
    try {
      // Only access localStorage after hydration
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      const spotifyUserId = getSpotifyUserId()
      
      if (!spotifyUserId) {
        setIsLoading(false)
        return
      }
      
      const response = await fetch(`/api/auth/me?userId=${spotifyUserId}`)
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // Clear invalid storage
        removeSpotifyUserId()
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      // Clear storage on error
      removeSpotifyUserId()
    } finally {
      setIsLoading(false)
    }
  }

  const connectSpotify = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'https://accounts.spotify.com/authorize?scope=user-read-recently-played%20user-top-read%20user-read-private&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3002%2Fapi%2Fauth%2Fspotify%2Fcallback&client_id=3d8d032ed282470cac128ad3e41ccf6a'
    }
  }

  const disconnectSpotify = async () => {
    try {
      // Clear all auth storage
      removeSpotifyUserId()
      
      // Also clear sessionStorage for good measure
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('spotify_user_id')
      }
      
      // Try to call logout API (optional)
      try {
        await fetch('/api/auth/logout', { method: 'POST' })
      } catch (apiError) {
        // Ignore API errors
      }
      
      // Clear user state
      setUser(null)
      
      // Reload to reset auth state
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    } catch (error) {
      console.error('Error disconnecting Spotify:', error)
    }
  }

  return {
    user,
    isLoading,
    isConnected: !!user,
    connectSpotify,
    disconnectSpotify,
  }
}
