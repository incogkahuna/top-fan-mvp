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

  // Debug logging removed for clean deployment

  // Check if user is connected on mount
  useEffect(() => {
    // Debug logging removed for clean deployment
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const spotifyUserId = localStorage.getItem('spotify_user_id')
      
      if (!spotifyUserId) {
        // Debug logging removed for clean deployment
        setIsLoading(false)
        return
      }
      
      // Debug logging removed for clean deployment
      const response = await fetch(`/api/auth/me?userId=${spotifyUserId}`)
      
      if (response.ok) {
        const userData = await response.json()
        // Debug logging removed for clean deployment
        setUser(userData)
      } else {
        // Debug logging removed for clean deployment
        const errorData = await response.json().catch(() => ({}))
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
        // Debug logging removed for clean deployment
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
