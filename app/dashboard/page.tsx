'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Music, Trophy, TrendingUp, Clock, Award, Users } from 'lucide-react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const mockStats = {
    totalPlays: 1247,
    rank: 15,
    totalFans: 2847,
    weeklyPlays: 89,
    favoriteArtist: 'Taylor Swift',
    topTrack: 'Anti-Hero',
    achievements: [
      { name: 'First Week Warrior', description: 'Listened 7 days in a row', earned: true },
      { name: 'Super Fan', description: 'Top 10% of listeners', earned: true },
      { name: 'Playlist Master', description: 'Created 5 playlists', earned: false },
    ]
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Dashboard</h1>
          <p className="text-gray-300">Track your progress and compete with other fans</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Plays</p>
                <p className="text-3xl font-bold text-white">{mockStats.totalPlays.toLocaleString()}</p>
              </div>
              <Music className="h-8 w-8 text-spotify-green" />
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
                <p className="text-gray-400 text-sm">Current Rank</p>
                <p className="text-3xl font-bold text-white">#{mockStats.rank}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-400" />
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
                <p className="text-gray-400 text-sm">Weekly Plays</p>
                <p className="text-3xl font-bold text-white">{mockStats.weeklyPlays}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Fans</p>
                <p className="text-3xl font-bold text-white">{mockStats.totalFans.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'achievements', label: 'Achievements' },
            { id: 'recent', label: 'Recent Activity' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-spotify-green text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Top Artist</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Music className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{mockStats.favoriteArtist}</p>
                  <p className="text-gray-400">Your #1 artist this month</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Top Track</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Music className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{mockStats.topTrack}</p>
                  <p className="text-gray-400">Most played this week</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {mockStats.achievements.map((achievement, index) => (
              <div
                key={index}
                className={`card ${achievement.earned ? 'border-spotify-green' : 'border-gray-600'}`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Award className={`h-6 w-6 ${achievement.earned ? 'text-spotify-green' : 'text-gray-500'}`} />
                  <h4 className="font-semibold text-white">{achievement.name}</h4>
                </div>
                <p className="text-gray-400 text-sm">{achievement.description}</p>
                {achievement.earned && (
                  <div className="mt-3 flex items-center text-spotify-green text-sm">
                    <Trophy className="h-4 w-4 mr-1" />
                    Earned
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'recent' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Listened to Anti-Hero', time: '2 hours ago', points: '+5' },
                { action: 'Climbed to rank #15', time: '1 day ago', points: '+10' },
                { action: 'Earned First Week Warrior badge', time: '2 days ago', points: '+25' },
                { action: 'Listened to 1989 (Taylor\'s Version)', time: '3 days ago', points: '+3' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                  <div>
                    <p className="text-white">{activity.action}</p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                  <span className="text-spotify-green font-semibold">{activity.points}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
