'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // const { user, login } = useAuth() // DISABLED FOR DEBUGGING
  const user = null
  const login = () => {}
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/leaderboard')
    }
  }, [user, router])

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    
    if (error) {
      setError(`Spotify connection failed: ${error}`)
    }
  }, [])

  const handleSpotifyLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Direct redirect to Spotify OAuth
      window.location.href = '/api/auth/spotify'
    } catch (err) {
      setError('Failed to connect to Spotify')
      console.error('Spotify login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#282828] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-[#E98B8B] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">♪</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#f5f1e8] mb-2">Early 20's Torture</h1>
          <p className="text-[#f5f1e8]/60">Connect to track your Sadie Jean listening</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-black mb-2">Join the Leaderboard</h2>
            <p className="text-gray-600">Connect your Spotify to compete with other Sadie Jean fans</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-700 text-center">{error}</p>
            </motion.div>
          )}

          <button
            onClick={handleSpotifyLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-full font-medium transition-all duration-200 ${
              loading
                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                : 'bg-white text-black hover:bg-pink-200'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <span className="text-lg">♪</span>
                <span>Connect with Spotify</span>
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Only your Sadie Jean listening will be tracked
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 gap-4"
        >
          <div className="bg-[#f5f1e8]/5 rounded-lg p-4 text-center">
            <h3 className="text-[#f5f1e8] font-semibold mb-2">Track Sadie Jean Plays</h3>
            <p className="text-[#f5f1e8]/60 text-sm">See your most played Sadie Jean songs</p>
          </div>
          <div className="bg-[#f5f1e8]/5 rounded-lg p-4 text-center">
            <h3 className="text-[#f5f1e8] font-semibold mb-2">Compete with Fans</h3>
            <p className="text-[#f5f1e8]/60 text-sm">Climb the Sadie Jean leaderboard</p>
          </div>
          <div className="bg-[#f5f1e8]/5 rounded-lg p-4 text-center">
            <h3 className="text-[#f5f1e8] font-semibold mb-2">Earn Points</h3>
            <p className="text-[#f5f1e8]/60 text-sm">Get bonus points for listening sessions</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
