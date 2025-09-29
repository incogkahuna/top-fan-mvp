'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Music, Trophy, Users, BarChart3, Bell, Award } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-spotify-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <Music className="h-8 w-8 text-spotify-green" />
          <span className="text-2xl font-bold text-white">Top Fan</span>
        </div>
        <div className="flex space-x-4">
          <Link href="/login" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-6">
            Become the <span className="gradient-text">Top Fan</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Gamify your Spotify listening experience. Compete with other fans, 
            earn rewards, and help your favorite artists understand their audience.
          </p>
          <Link href="/login" className="btn-primary text-lg px-8 py-3">
            Connect with Spotify
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card"
          >
            <Trophy className="h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Leaderboards</h3>
            <p className="text-gray-300">
              Compete with other fans and climb the rankings based on your listening habits.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="card"
          >
            <Award className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Rewards</h3>
            <p className="text-gray-300">
              Earn exclusive prizes, early access to music, and special fan experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="card"
          >
            <BarChart3 className="h-12 w-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Artist Insights</h3>
            <p className="text-gray-300">
              Help artists understand their audience with anonymized listening data.
            </p>
          </motion.div>
        </div>

        {/* Mock Data Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="card max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-spotify-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Music className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Connect Spotify</h3>
              <p className="text-gray-300">Link your Spotify account securely</p>
            </div>
            <div className="text-center">
              <div className="bg-spotify-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Compete</h3>
              <p className="text-gray-300">Listen to your favorite artists and climb rankings</p>
            </div>
            <div className="text-center">
              <div className="bg-spotify-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Win Rewards</h3>
              <p className="text-gray-300">Earn exclusive prizes and experiences</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
