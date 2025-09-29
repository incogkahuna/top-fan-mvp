'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, Trophy, Star, Crown, Lock, CheckCircle, Clock, AlertCircle } from 'lucide-react'

interface Prize {
  id: string
  title: string
  description: string
  points_required: number
  category: string
  is_active: boolean
}

export default function Prizes() {
  const [activeCategory, setActiveCategory] = useState('available')
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userPoints, setUserPoints] = useState(0)

  // Fetch real prizes data from database
  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        setLoading(true)
        
        // Get prizes from database
        const response = await fetch('/api/test/database')
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }

        // For now, we'll show empty state since we need to implement prizes API
        setPrizes([])
        setUserPoints(0)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load prizes')
        console.error('Prizes fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrizes()
  }, [])

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Prizes & Rewards</h1>
          <p className="text-gray-300">Earn points by listening and unlock exclusive rewards</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading prizes...</div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-red-400 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Error: {error}</span>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Your Points</p>
                    <p className="text-3xl font-bold text-white">{userPoints.toLocaleString()}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-400" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Prizes Earned</p>
                    <p className="text-3xl font-bold text-white">0</p>
                  </div>
                  <Trophy className="h-8 w-8 text-spotify-green" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Available Prizes</p>
                    <p className="text-3xl font-bold text-white">0</p>
                  </div>
                  <Gift className="h-8 w-8 text-purple-400" />
                </div>
              </motion.div>
            </div>

            {/* Empty State */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="text-center py-16">
                <Gift className="h-20 w-20 mx-auto mb-6 text-gray-500 opacity-50" />
                <h3 className="text-2xl font-semibold text-white mb-4">No Prizes Available Yet</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Prizes and rewards will be added soon. Start listening to music to earn points!
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span>Earn points by listening</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4" />
                    <span>Unlock exclusive rewards</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
