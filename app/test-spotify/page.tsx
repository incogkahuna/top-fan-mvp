'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function TestSpotifyPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnectSpotify = () => {
    window.location.href = '/api/auth/spotify'
  }

  const handleGetStats = async () => {
    if (!user) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/spotify/sadiejean?userId=${user.spotify_id}`)
      const data = await response.json()
      
      if (response.ok) {
        setStats(data.data)
      } else {
        setError(data.error || 'Failed to fetch stats')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckAuth = async () => {
    // For testing, we'll use a hardcoded user ID
    // In a real app, this would come from session management
    const testUserId = prompt('Enter Spotify User ID for testing:')
    if (!testUserId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/auth/me?userId=${testUserId}`)
      const data = await response.json()
      
      if (response.ok) {
        setUser(data)
      } else {
        setError(data.error || 'User not found')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-[#f5f1e8] mb-4">
            Spotify Integration Test
          </h1>
          <p className="text-[#f5f1e8]/60">
            Test the Spotify OAuth and Sadie Jean data fetching
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* Connection Test */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#282828] rounded-2xl p-6 border border-[#f5f1e8]/10"
          >
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-4">1. Connect Spotify</h2>
            <button
              onClick={handleConnectSpotify}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Connect to Spotify
            </button>
            <p className="text-[#f5f1e8]/60 text-sm mt-2">
              This will redirect you to Spotify OAuth
            </p>
          </motion.div>

          {/* Auth Check */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#282828] rounded-2xl p-6 border border-[#f5f1e8]/10"
          >
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-4">2. Check Auth Status</h2>
            <button
              onClick={handleCheckAuth}
              disabled={loading}
              className="bg-[#E98B8B] hover:bg-[#f09999] disabled:opacity-50 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              {loading ? 'Checking...' : 'Check Auth Status'}
            </button>
            <p className="text-[#f5f1e8]/60 text-sm mt-2">
              Check if user is authenticated (enter Spotify User ID for testing)
            </p>
            
            {user && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                <h3 className="text-green-400 font-medium">User Found:</h3>
                <p className="text-[#f5f1e8]">Name: {user.display_name}</p>
                <p className="text-[#f5f1e8]/60">ID: {user.spotify_id}</p>
                {user.email && <p className="text-[#f5f1e8]/60">Email: {user.email}</p>}
              </div>
            )}
          </motion.div>

          {/* Stats Fetch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#282828] rounded-2xl p-6 border border-[#f5f1e8]/10"
          >
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-4">3. Get Sadie Jean Stats</h2>
            <button
              onClick={handleGetStats}
              disabled={!user || loading}
              className="bg-[#E98B8B] hover:bg-[#f09999] disabled:opacity-50 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              {loading ? 'Loading...' : 'Get Sadie Jean Stats'}
            </button>
            <p className="text-[#f5f1e8]/60 text-sm mt-2">
              Fetch Sadie Jean listening data (requires authenticated user)
            </p>
            
            {stats && (
              <div className="mt-4 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                <h3 className="text-green-400 font-medium">Sadie Jean Stats:</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-[#f5f1e8] font-medium">Total Plays:</p>
                    <p className="text-[#f5f1e8]/60">{stats.totalPlays}</p>
                  </div>
                  <div>
                    <p className="text-[#f5f1e8] font-medium">Listening Time:</p>
                    <p className="text-[#f5f1e8]/60">{Math.round(stats.totalListeningTime / 60000)} minutes</p>
                  </div>
                </div>
                
                {stats.topTracks.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[#f5f1e8] font-medium">Top Tracks:</p>
                    <ul className="text-[#f5f1e8]/60 text-sm mt-1">
                      {stats.topTracks.slice(0, 3).map((track: any, index: number) => (
                        <li key={index}>
                          {index + 1}. {track.name} ({track.plays} plays)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-500/20 rounded-2xl p-6"
            >
              <h3 className="text-red-400 font-medium">Error:</h3>
              <p className="text-[#f5f1e8]">{error}</p>
            </motion.div>
          )}

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#282828] rounded-2xl p-6 border border-[#f5f1e8]/10"
          >
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-4">How to Test:</h2>
            <ol className="text-[#f5f1e8]/60 space-y-2">
              <li>1. Click "Connect to Spotify" to go through OAuth flow</li>
              <li>2. After connecting, you'll be redirected back with a success message</li>
              <li>3. Use "Check Auth Status" with your Spotify User ID</li>
              <li>4. Click "Get Sadie Jean Stats" to fetch your listening data</li>
            </ol>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
