'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, login } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const error = urlParams.get('error')
    
    if (success === 'connected') {
      // OAuth was successful, refresh user data
      checkAuthStatus()
    } else if (error) {
      setError(`Spotify connection failed: ${error}`)
    }
  }, [])

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        if (userData.user) {
          // User is authenticated, redirect to dashboard
          router.push('/dashboard')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSpotifyLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Redirect to Spotify OAuth
      window.location.href = '/api/auth/spotify'
    } catch (err) {
      setError('Failed to connect to Spotify')
      console.error('Spotify login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-spotify-green rounded-full flex items-center justify-center">
              <Music className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Top Fan</h1>
          <p className="text-gray-300">Gamify Your Spotify Experience</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-300">Connect your Spotify account to get started</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center space-x-3"
            >
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}

          <button
            onClick={handleSpotifyLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
              loading
                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                : 'bg-spotify-green hover:bg-green-600 text-white hover:scale-105'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Music className="h-5 w-5" />
                <span>Connect with Spotify</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              By connecting, you agree to our Terms of Service and Privacy Policy
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
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <h3 className="text-white font-semibold mb-2">Track Your Listening</h3>
            <p className="text-gray-300 text-sm">See your most played songs and artists</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <h3 className="text-white font-semibold mb-2">Compete with Friends</h3>
            <p className="text-gray-300 text-sm">Climb the leaderboards and earn achievements</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <h3 className="text-white font-semibold mb-2">Discover New Music</h3>
            <p className="text-gray-300 text-sm">Get personalized recommendations</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
