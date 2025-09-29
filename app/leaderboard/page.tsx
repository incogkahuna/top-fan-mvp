'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, Star, TrendingUp, Users, Music } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string
  profileImageUrl: string | null
  totalPlays: number
}

export default function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState('month')
  const [artistFilter, setArtistFilter] = useState('all')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch real leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/leaderboard')
        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
        } else {
          setLeaderboard(data.leaderboard || [])
        }
      } catch (err) {
        setError('Failed to load leaderboard')
        console.error('Leaderboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [timeFilter, artistFilter])

  // Calculate your stats
  const yourStats = {
    rank: leaderboard.findIndex(entry => entry.displayName === 'Daniel Horgan') + 1 || leaderboard.length + 1,
    totalPlays: leaderboard.find(entry => entry.displayName === 'Daniel Horgan')?.totalPlays || 0,
    totalPlayers: leaderboard.length
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-300" />
    if (rank === 3) return <Trophy className="h-6 w-6 text-orange-400" />
    return <span className="text-lg font-bold text-gray-400">#{rank}</span>
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-orange-400 to-orange-600'
    return 'from-gray-600 to-gray-800'
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-300">See how you stack up against other fans</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex bg-white/10 rounded-lg p-1">
            {['week', 'month', 'all'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-md transition-colors capitalize ${
                  timeFilter === filter
                    ? 'bg-spotify-green text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex bg-white/10 rounded-lg p-1">
            {['all', 'taylor-swift', 'ariana-grande', 'drake'].map((artist) => (
              <button
                key={artist}
                onClick={() => setArtistFilter(artist)}
                className={`px-4 py-2 rounded-md transition-colors capitalize ${
                  artistFilter === artist
                    ? 'bg-spotify-green text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {artist.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Your Rank</p>
                <p className="text-3xl font-bold text-white">
                  {loading ? '...' : `#${yourStats.rank}`}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-spotify-green" />
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
                <p className="text-gray-400 text-sm">Total Players</p>
                <p className="text-3xl font-bold text-white">
                  {loading ? '...' : yourStats.totalPlayers.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
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
                <p className="text-gray-400 text-sm">Your Plays</p>
                <p className="text-3xl font-bold text-white">
                  {loading ? '...' : yourStats.totalPlays.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Top Fans</h2>
          
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">Loading leaderboard...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-400">Error: {error}</div>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No players yet. Be the first to connect your Spotify!</p>
                </div>
              ) : (
                leaderboard.map((user, index) => (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-lg bg-gradient-to-r ${getRankColor(user.rank)} ${
                      user.rank <= 3 ? 'border-2 border-white/30' : 'border border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(user.rank)}
                      </div>
                      <div className="text-2xl">
                        {user.profileImageUrl ? (
                          <img 
                            src={user.profileImageUrl} 
                            alt={user.displayName}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          '🎵'
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{user.displayName}</h3>
                        <p className="text-sm text-gray-300">{user.totalPlays.toLocaleString()} plays</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.rank <= 3 && (
                        <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                          {user.rank === 1 && <Crown className="h-4 w-4 text-yellow-400" />}
                          {user.rank === 2 && <Medal className="h-4 w-4 text-gray-300" />}
                          {user.rank === 3 && <Trophy className="h-4 w-4 text-orange-400" />}
                          <span className="text-sm text-white">
                            {user.rank === 1 ? 'Crown' : user.rank === 2 ? 'Medal' : 'Trophy'}
                          </span>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">#{user.rank}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>

        {/* Your Position */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card mt-8"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Your Position</h3>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-spotify-green/20 to-blue-500/20 rounded-lg border border-spotify-green/30">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12">
                  <span className="text-lg font-bold text-spotify-green">#{yourStats.rank}</span>
                </div>
                <div className="text-2xl">🎵</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Daniel Horgan</h3>
                  <p className="text-sm text-gray-300">{yourStats.totalPlays.toLocaleString()} plays</p>
                </div>
              </div>
              <div className="text-right">
                {yourStats.totalPlays === 0 ? (
                  <>
                    <p className="text-spotify-green font-semibold">Connect Spotify to start!</p>
                    <p className="text-sm text-gray-300">Sync your listening data</p>
                  </>
                ) : (
                  <>
                    <p className="text-spotify-green font-semibold">Keep listening to climb!</p>
                    <p className="text-sm text-gray-300">You're doing great!</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
