'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Crown, Star, TrendingUp, Users } from 'lucide-react'

export default function Leaderboard() {
  const [timeFilter, setTimeFilter] = useState('month')
  const [artistFilter, setArtistFilter] = useState('all')

  // Mock leaderboard data
  const mockLeaderboard = [
    { rank: 1, name: 'MusicLover99', plays: 2847, avatar: '🎵', badge: 'Crown' },
    { rank: 2, name: 'Swiftie4Life', plays: 2654, avatar: '💖', badge: 'Medal' },
    { rank: 3, name: 'TopFan2024', plays: 2432, avatar: '⭐', badge: 'Trophy' },
    { rank: 4, name: 'MusicAddict', plays: 2210, avatar: '🎶', badge: null },
    { rank: 5, name: 'FanaticFan', plays: 1987, avatar: '🔥', badge: null },
    { rank: 6, name: 'PlaylistPro', plays: 1876, avatar: '🎧', badge: null },
    { rank: 7, name: 'BeatMaster', plays: 1754, avatar: '🥁', badge: null },
    { rank: 8, name: 'SoundSeeker', plays: 1632, avatar: '🎤', badge: null },
    { rank: 9, name: 'MelodyMaker', plays: 1510, avatar: '🎼', badge: null },
    { rank: 10, name: 'RhythmRider', plays: 1388, avatar: '🎹', badge: null },
  ]

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
                <p className="text-3xl font-bold text-white">#15</p>
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
                <p className="text-3xl font-bold text-white">2,847</p>
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
                <p className="text-3xl font-bold text-white">1,247</p>
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
          <div className="space-y-4">
            {mockLeaderboard.map((user, index) => (
              <motion.div
                key={user.rank}
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
                  <div className="text-2xl">{user.avatar}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                    <p className="text-sm text-gray-300">{user.plays.toLocaleString()} plays</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {user.badge && (
                    <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                      {user.badge === 'Crown' && <Crown className="h-4 w-4 text-yellow-400" />}
                      {user.badge === 'Medal' && <Medal className="h-4 w-4 text-gray-300" />}
                      {user.badge === 'Trophy' && <Trophy className="h-4 w-4 text-orange-400" />}
                      <span className="text-sm text-white">{user.badge}</span>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">#{user.rank}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Your Position */}
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
                <span className="text-lg font-bold text-spotify-green">#15</span>
              </div>
              <div className="text-2xl">🎵</div>
              <div>
                <h3 className="text-lg font-semibold text-white">You</h3>
                <p className="text-sm text-gray-300">1,247 plays</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-spotify-green font-semibold">Keep listening to climb!</p>
              <p className="text-sm text-gray-300">+89 plays this week</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
