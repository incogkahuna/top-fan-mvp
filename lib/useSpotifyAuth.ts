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
        // Check if there's user data stored directly in localStorage
        const storedUserData = localStorage.getItem('spotify_user_data')
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData)
            setUser(userData)
            // Also store the user ID properly
            setSpotifyUserId(userData.spotify_id)
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError)
            localStorage.removeItem('spotify_user_data')
          }
        }
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
        localStorage.removeItem('spotify_user_data')
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      // Clear storage on error
      removeSpotifyUserId()
      localStorage.removeItem('spotify_user_data')
    } finally {
      setIsLoading(false)
    }
  }

  const connectSpotify = () => {
    if (typeof window !== 'undefined') {
      // Use the Spotify auth API route instead of hardcoded URL
      window.location.href = '/api/auth/spotify'
    }
  }

  const disconnectSpotify = async () => {
    try {
      // Clear all auth storage
      removeSpotifyUserId()
      
      // Clear additional user data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('spotify_user_data')
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
