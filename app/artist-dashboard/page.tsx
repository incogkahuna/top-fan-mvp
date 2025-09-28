'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, MapPin, Calendar, Download, TrendingUp, Music, Globe } from 'lucide-react'

export default function ArtistDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('30d')

  // Mock data for artist dashboard
  const mockData = {
    totalFans: 2847,
    totalPlays: 45632,
    topCountries: [
      { country: 'United States', fans: 1247, percentage: 43.8 },
      { country: 'Canada', fans: 456, percentage: 16.0 },
      { country: 'United Kingdom', fans: 389, percentage: 13.7 },
      { country: 'Australia', fans: 234, percentage: 8.2 },
      { country: 'Germany', fans: 189, percentage: 6.6 },
      { country: 'Other', fans: 332, percentage: 11.7 }
    ],
    ageGroups: [
      { age: '13-17', count: 456, percentage: 16.0 },
      { age: '18-24', count: 1247, percentage: 43.8 },
      { age: '25-34', count: 789, percentage: 27.7 },
      { age: '35-44', count: 234, percentage: 8.2 },
      { age: '45+', count: 121, percentage: 4.3 }
    ],
    topTracks: [
      { name: 'Anti-Hero', plays: 12456, growth: '+12%' },
      { name: 'Cruel Summer', plays: 9876, growth: '+8%' },
      { name: 'Lavender Haze', plays: 7654, growth: '+15%' },
      { name: 'Midnight Rain', plays: 5432, growth: '+5%' },
      { name: 'Bejeweled', plays: 4321, growth: '+18%' }
    ],
    engagement: {
      avgSessionTime: '24:32',
      repeatListeners: 68.5,
      playlistAdds: 1234,
      shares: 567
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Artist Dashboard</h1>
          <p className="text-gray-300">Insights about your fanbase and listening patterns</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex space-x-1 mb-8 bg-white/10 rounded-lg p-1 w-fit">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-spotify-green text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Fans</p>
                <p className="text-3xl font-bold text-white">{mockData.totalFans.toLocaleString()}</p>
                <p className="text-sm text-spotify-green">+12% this month</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
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
                <p className="text-gray-400 text-sm">Total Plays</p>
                <p className="text-3xl font-bold text-white">{mockData.totalPlays.toLocaleString()}</p>
                <p className="text-sm text-spotify-green">+8% this month</p>
              </div>
              <Music className="h-8 w-8 text-spotify-green" />
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
                <p className="text-gray-400 text-sm">Avg Session</p>
                <p className="text-3xl font-bold text-white">{mockData.engagement.avgSessionTime}</p>
                <p className="text-sm text-spotify-green">+2min this month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
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
                <p className="text-gray-400 text-sm">Repeat Rate</p>
                <p className="text-3xl font-bold text-white">{mockData.engagement.repeatListeners}%</p>
                <p className="text-sm text-spotify-green">+3% this month</p>
              </div>
              <BarChart3 className="h-8 w-8 text-yellow-400" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'demographics', label: 'Demographics' },
            { id: 'tracks', label: 'Top Tracks' },
            { id: 'engagement', label: 'Engagement' }
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
              <h3 className="text-xl font-semibold text-white mb-4">Top Countries</h3>
              <div className="space-y-4">
                {mockData.topCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Globe className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white">{country.country}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{country.fans.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">{country.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Age Distribution</h3>
              <div className="space-y-4">
                {mockData.ageGroups.map((age, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">{age.age}</span>
                      <span className="text-gray-400">{age.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-spotify-green to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${age.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'tracks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Top Performing Tracks</h3>
            <div className="space-y-4">
              {mockData.topTracks.map((track, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-spotify-green to-blue-500 rounded-full flex items-center justify-center">
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{track.name}</h4>
                      <p className="text-gray-400">{track.plays.toLocaleString()} plays</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-spotify-green font-semibold">{track.growth}</span>
                    <p className="text-sm text-gray-400">vs last period</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'engagement' && (
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Engagement Metrics</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">Playlist Adds</p>
                    <p className="text-2xl font-bold text-white">{mockData.engagement.playlistAdds.toLocaleString()}</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Music className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400">Shares</p>
                    <p className="text-2xl font-bold text-white">{mockData.engagement.shares.toLocaleString()}</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Export Data</h3>
              <div className="space-y-4">
                <button className="w-full btn-primary flex items-center justify-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export CSV Report</span>
                </button>
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export PDF Report</span>
                </button>
                <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Report</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'demographics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">Geographic Distribution</h3>
              <div className="space-y-4">
                {mockData.topCountries.slice(0, 5).map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-spotify-green" />
                      <span className="text-white">{country.country}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{country.fans.toLocaleString()}</p>
                      <p className="text-sm text-gray-400">{country.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">Age Groups</h3>
              <div className="space-y-4">
                {mockData.ageGroups.map((age, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white">{age.age}</span>
                      <span className="text-gray-400">{age.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-spotify-green to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${age.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
