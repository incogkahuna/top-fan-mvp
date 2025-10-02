'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string
  profileImageUrl: string | null
  totalPlays: number
  points: number
}

export default function LeaderboardPreview() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard')
        const data = await response.json()
        
        if (data.leaderboard) {
          setLeaderboard(data.leaderboard.slice(0, 3)) // Top 3 only
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mt-20 max-w-4xl mx-auto"
    >
      <div className="card text-center">
        <h2 className="text-3xl font-bold text-[#f5f1e8] mb-4">Sadie Jean Fan Leaderboard</h2>
        <p className="text-[#f5f1e8]/60 mb-6">
          Connect your Spotify and compete with other Sadie Jean fans. Only her songs count toward your score!
        </p>
        
        {/* Top 3 Preview */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E98B8B]"></div>
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#f5f1e8] mb-4">Top Fans</h3>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-[#f5f1e8]/5 rounded-lg border border-[#E98B8B]/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">#{user.rank}</span>
                    </div>
                    {user.profileImageUrl ? (
                      <img 
                        src={user.profileImageUrl} 
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full border border-[#E98B8B]/40"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-[#E98B8B] to-[#E98B8B]/80 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">♪</span>
                      </div>
                    )}
                    <div>
                      <p className="text-[#f5f1e8] font-medium">{user.displayName}</p>
                      <p className="text-sm text-[#f5f1e8]/60">{user.totalPlays} plays • {user.points} pts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#E98B8B]">#{user.rank}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-8">
            <div className="w-16 h-16 bg-[#E98B8B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-[#E98B8B] font-bold">#</span>
            </div>
            <p className="text-[#f5f1e8]/60">Be the first to join the leaderboard!</p>
          </div>
        )}

        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="flex items-center space-x-2 text-[#f5f1e8]/60">
            <div className="w-3 h-3 bg-[#E98B8B] rounded-full"></div>
            <span className="text-sm">Sadie Jean tracks only</span>
          </div>
          <div className="flex items-center space-x-2 text-[#f5f1e8]/60">
            <div className="w-3 h-3 bg-[#E98B8B] rounded-full"></div>
            <span className="text-sm">Real-time updates</span>
          </div>
          <div className="flex items-center space-x-2 text-[#f5f1e8]/60">
            <div className="w-3 h-3 bg-[#E98B8B] rounded-full"></div>
            <span className="text-sm">Fan competition</span>
          </div>
        </div>
        
        <Link href="/leaderboard" className="btn-primary text-lg px-8 py-4">
          View Full Leaderboard
        </Link>
      </div>
    </motion.div>
  )
}
