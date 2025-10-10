'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Music, Settings, Award, LogOut, Headphones, Trophy, Star } from 'lucide-react'
import { useSpotifyAuth } from '@/lib/useSpotifyAuth'
import { useRouter } from 'next/navigation'
import { setSpotifyUserId } from '@/lib/auth-storage'

export default function UserPage() {
  const { user, isLoading: authLoading, isConnected, connectSpotify } = useSpotifyAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Handle Spotify callback parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const spotifyConnected = urlParams.get('spotify_connected')
      const spotifyUserId = urlParams.get('spotify_user_id')
      const error = urlParams.get('error')
      const message = urlParams.get('message')
      
      if (error) {
        setErrorMessage(message || 'Authentication failed. Please try again.')
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname)
        return
      }
      
      if (spotifyConnected === 'true' && spotifyUserId) {
        setSuccessMessage('Successfully connected to Spotify!')
        // Store the user ID using enhanced storage
        setSpotifyUserId(spotifyUserId)
        
        // Clean up URL parameters
        window.history.replaceState({}, document.title, window.location.pathname)
        
        // Trigger auth status check
        window.location.reload()
      }
    }
  }, [])

  // Redirect to profile page if connected
  useEffect(() => {
    // Only redirect if we're not loading and we have a confirmed user
    if (!authLoading && isConnected && user) {
      router.push('/profile')
    }
  }, [isConnected, user, authLoading, router])

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-[#f5f1e8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E98B8B] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Show redirect state if connected
  if (isConnected && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a] text-[#f5f1e8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E98B8B] mx-auto mb-4"></div>
          <p>Redirecting to profile...</p>
        </div>
      </div>
    )
  }

  // Show connect page if not authenticated
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f1e8] p-6 sm:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Error/Success Messages */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div>
                <h3 className="font-bold text-red-400">Authentication Error</h3>
                <p className="text-red-300">{errorMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center">
              <div className="text-green-400 mr-3">✅</div>
              <div>
                <h3 className="font-bold text-green-400">Success!</h3>
                <p className="text-green-300">{successMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#f5f1e8] mb-4">
            Your Profile
          </h1>
          <p className="text-xl text-[#f5f1e8]/70 max-w-2xl mx-auto">
            Connect your Spotify account to track your Sadie Jean listening stats, 
            customize your profile, and compete on the leaderboard.
          </p>
        </motion.div>

        {/* Connect Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-[#282828] rounded-2xl p-8 sm:p-12 border border-[#f5f1e8]/10 text-center mb-8"
        >
          <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-6">
            <Music className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-[#f5f1e8] mb-4">
            Connect Your Spotify
          </h2>
          
          <p className="text-lg text-[#f5f1e8]/70 mb-8 max-w-xl mx-auto">
            Link your Spotify account to unlock your personal dashboard, 
            view your Sadie Jean listening stats, and join the community.
          </p>

          <a
            href="https://accounts.spotify.com/authorize?scope=user-read-recently-played%20user-top-read%20user-read-private&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A3002%2Fapi%2Fauth%2Fspotify%2Fcallback&client_id=3d8d032ed282470cac128ad3e41ccf6a"
            className="inline-block bg-[#1DB954] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1ed760] transition-colors hover:scale-105 transform"
          >
            Connect Spotify
          </a>

          <p className="text-sm text-[#f5f1e8]/50 mt-4">
            We only track your Sadie Jean plays and respect your privacy
          </p>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-[#282828] rounded-xl p-6 border border-[#f5f1e8]/10 text-center">
            <div className="w-12 h-12 bg-[#E98B8B] rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#f5f1e8] mb-2">Music Stats</h3>
            <p className="text-[#f5f1e8]/70">
              Track your Sadie Jean plays, top tracks, and listening time
            </p>
          </div>

          <div className="bg-[#282828] rounded-xl p-6 border border-[#f5f1e8]/10 text-center">
            <div className="w-12 h-12 bg-[#E98B8B] rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#f5f1e8] mb-2">Leaderboard</h3>
            <p className="text-[#f5f1e8]/70">
              Compete with other Sadie Jean fans and climb the ranks
            </p>
          </div>

          <div className="bg-[#282828] rounded-xl p-6 border border-[#f5f1e8]/10 text-center">
            <div className="w-12 h-12 bg-[#E98B8B] rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#f5f1e8] mb-2">Profile</h3>
            <p className="text-[#f5f1e8]/70">
              Customize your handle, bio, and profile picture
            </p>
          </div>
        </motion.div>

        {/* Privacy Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="bg-[#1f1a16] rounded-xl p-6 border border-[#f5f1e8]/10 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-[#f5f1e8] mb-2">Privacy & Security</h3>
            <p className="text-[#f5f1e8]/70 text-sm">
              We only access your Spotify data to track Sadie Jean plays for the leaderboard. 
              You can disconnect anytime and we'll delete your data.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
