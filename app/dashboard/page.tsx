'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Trophy, TrendingUp, Clock, Award, Users, AlertCircle, RefreshCw } from 'lucide-react'
import AutoSync from '@/components/AutoSync'
import CardLayout from './card-layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/lib/auth'

interface UserStats {
  totalPlays: number
  rank: number
  totalFans: number
  weeklyPlays: number
  favoriteArtist: string | null
  topTrack: string | null
  totalListeningHours: number
  uniqueArtists: number
  uniqueTracks: number
  topArtists: Array<{ name: string; plays: number }>
  topTracks: Array<{ name: string; artist: string; plays: number }>
  recentActivity: Array<{
    track_name: string
    artist_name: string
    played_at: string
    duration_ms: number
  }>
}

// Simple animated number component
const AnimatedNumber = ({ value }: { value: number }) => {
  return <span>{value.toLocaleString()}</span>
}

// Helper function to format time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
}

// Expandable card component
const ExpandableCard = ({ 
  id, 
  title, 
  icon, 
  preview, 
  expandedContent, 
  isExpanded, 
  onToggle 
}: {
  id: string
  title: string
  icon: React.ReactNode
  preview: React.ReactNode
  expandedContent: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card cursor-pointer hover:bg-white/15 transition-all duration-300"
      onClick={onToggle}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon}
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>
      
      {!isExpanded && preview}
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {expandedContent}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const { user } = useAuth()

  // Fetch real user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        // Get user data first
        const userResponse = await fetch('/api/test/user')
        const userData = await userResponse.json()
        
        if (userData.error) {
          throw new Error(userData.error)
        }

        const yourUser = userData.users.find((user: any) => user.display_name === user?.display_name)
        
        // Store user ID for auto-sync
        if (yourUser) {
          setUserId(yourUser.id)
        }
        
        // Get detailed listening data
        let listeningData = {
          totalListeningHours: 0,
          uniqueArtists: 0,
          uniqueTracks: 0,
          topArtists: [],
          topTracks: [],
          recentActivity: []
        }

        if (yourUser) {
          const listeningResponse = await fetch(`/api/user/listening-data?userId=${yourUser.id}`)
          const listeningResult = await listeningResponse.json()
          
          if (listeningResult.success) {
            listeningData = listeningResult
          }
        }

        setUserStats({
          totalPlays: yourUser?.total_plays || 0,
          rank: 1, // Simplified - just show rank 1 for now
          totalFans: userData.userCount || 1,
          weeklyPlays: 0, // Will need to implement weekly calculation
          favoriteArtist: (listeningData.topArtists as any)[0]?.name || null,
          topTrack: (listeningData.topTracks as any)[0]?.name || null,
          totalListeningHours: listeningData.totalListeningHours,
          uniqueArtists: listeningData.uniqueArtists,
          uniqueTracks: listeningData.uniqueTracks,
          topArtists: listeningData.topArtists,
          topTracks: listeningData.topTracks,
          recentActivity: listeningData.recentActivity
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user data')
        console.error('Dashboard data fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Handle data refresh from auto-sync (smooth update, no page refresh)
  const handleDataUpdate = async () => {
    try {
      setIsUpdating(true)
      
      // Fetch updated data without page refresh
      const userResponse = await fetch('/api/test/user')
      const userData = await userResponse.json()
      
      if (userData.error) {
        throw new Error(userData.error)
      }

      const yourUser = userData.users.find((user: any) => user.display_name === 'Daniel Horgan')
      
      if (yourUser) {
        // Get updated listening data
        const listeningResponse = await fetch(`/api/user/listening-data?userId=${yourUser.id}`)
        const listeningResult = await listeningResponse.json()
        
        if (listeningResult.success) {
          // Update stats with smooth animation
          setUserStats(prevStats => {
            if (!prevStats) return prevStats
            return {
              ...prevStats,
              totalPlays: listeningResult.totalPlays || 0,
              totalListeningHours: listeningResult.totalListeningHours || 0,
              uniqueArtists: listeningResult.uniqueArtists || 0,
              uniqueTracks: listeningResult.uniqueTracks || 0,
              topArtists: listeningResult.topArtists || [],
              topTracks: listeningResult.topTracks || [],
              recentActivity: listeningResult.recentActivity || []
            }
          })
        }
      }
    } catch (error) {
      console.error('Background update error:', error)
    } finally {
      // Hide update indicator after a short delay
      setTimeout(() => setIsUpdating(false), 1000)
    }
  }

  // Sync data from Spotify
  const handleSyncData = async () => {
    try {
      setSyncing(true)
      setSyncMessage('Syncing your Spotify data...')
      
      // First get the user ID
      const userResponse = await fetch('/api/test/user')
      const userData = await userResponse.json()
      
      if (userData.error) {
        throw new Error(userData.error)
      }

      const yourUser = userData.users.find((user: any) => user.display_name === 'Daniel Horgan')
      
      if (!yourUser) {
        throw new Error('User not found. Please make sure you\'re connected to Spotify.')
      }

      // Trigger the sync
      const syncResponse = await fetch('/api/data/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: yourUser.id })
      })

      const syncResult = await syncResponse.json()
      
      if (syncResult.error) {
        throw new Error(syncResult.error)
      }

      setSyncMessage(`✅ Sync complete! Added ${syncResult.synced} new tracks. Total plays: ${syncResult.totalPlays}`)
      
      // Smooth background update instead of page refresh
      setTimeout(() => {
        handleDataUpdate()
      }, 1000)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      
      if (errorMessage.includes('reconnect to Spotify')) {
        setSyncMessage(`❌ Please reconnect to Spotify. Your session has expired.`)
      } else {
        setSyncMessage(`❌ Sync failed: ${errorMessage}`)
      }
      console.error('Sync error:', err)
    } finally {
      setSyncing(false)
    }
  }

  // Force sync - bypasses the "no new tracks" check
  const handleForceSync = async () => {
    try {
      setSyncing(true)
      setSyncMessage('Force syncing all recent tracks...')
      
      // First get the user ID
      const userResponse = await fetch('/api/test/user')
      const userData = await userResponse.json()
      
      if (userData.error) {
        throw new Error(userData.error)
      }

      const yourUser = userData.users.find((user: any) => user.display_name === 'Daniel Horgan')
      
      if (!yourUser) {
        throw new Error('User not found. Please make sure you\'re connected to Spotify.')
      }

      // Call a force sync endpoint that ignores the last sync time
      const syncResponse = await fetch('/api/data/force-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: yourUser.id })
      })

      const syncResult = await syncResponse.json()
      
      if (syncResult.error) {
        throw new Error(syncResult.error)
      }

      setSyncMessage(`✅ Force sync complete! Processed ${syncResult.synced} tracks.`)
      
      // Smooth background update instead of page refresh
      setTimeout(() => {
        handleDataUpdate()
      }, 1000)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setSyncMessage(`❌ Force sync failed: ${errorMessage}`)
      console.error('Force sync error:', err)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="min-h-screen p-6">
      {/* Auto-sync component */}
      {userId && <AutoSync onDataUpdate={handleDataUpdate} userId={userId} />}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
          <h1 className="text-4xl font-bold text-white mb-2">Your Dashboard</h1>
          <p className="text-gray-300">Track your progress and compete with other fans</p>
        </div>

            {/* Sync Button */}
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-3">
                {/* Auto-sync indicator */}
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${isUpdating ? 'bg-spotify-green' : 'bg-green-500'}`}></div>
                  <span>{isUpdating ? 'Updating...' : 'Auto-sync enabled'}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleSyncData}
                    disabled={syncing}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-semibold transition-colors ${
                      syncing 
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                        : 'bg-spotify-green hover:bg-green-600 text-white'
                    }`}
                  >
                    {syncing ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Syncing...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        <span>Sync Now</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleForceSync}
                    disabled={syncing}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-semibold transition-colors ${
                      syncing 
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Force</span>
                  </button>
                </div>
              </div>
              
              {syncMessage && (
                <div className={`text-sm px-3 py-1 rounded-md ${
                  syncMessage.includes('✅') 
                    ? 'bg-green-900/50 text-green-300' 
                    : 'bg-red-900/50 text-red-300'
                }`}>
                  {syncMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading your dashboard...</div>
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

        {!loading && !error && userStats && (
          <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: isUpdating ? [1, 1.02, 1] : 1
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: isUpdating ? Infinity : 0,
                  repeatType: "reverse"
                }}
                className={`card transition-all duration-300 ${isUpdating ? 'ring-2 ring-spotify-green/50 bg-spotify-green/5' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div>
                    <div className="flex items-center space-x-2">
                <p className="text-gray-400 text-sm">Total Plays</p>
                      {isUpdating && <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse"></div>}
                    </div>
                    <p className="text-3xl font-bold text-white">
                      <AnimatedNumber value={userStats.totalPlays} />
                    </p>
              </div>
              <Music className="h-8 w-8 text-spotify-green" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: isUpdating ? [1, 1.02, 1] : 1
                }}
                transition={{ 
                  delay: 0.1,
                  duration: 0.5, 
                  repeat: isUpdating ? Infinity : 0,
                  repeatType: "reverse"
                }}
                className={`card transition-all duration-300 ${isUpdating ? 'ring-2 ring-spotify-green/50 bg-spotify-green/5' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-400 text-sm">Listening Time</p>
                      {isUpdating && <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse"></div>}
                    </div>
                    <p className="text-3xl font-bold text-white">
                      <AnimatedNumber value={Math.round(userStats.totalListeningHours * 10) / 10} />
                      <span className="text-lg text-gray-400">h</span>
                    </p>
              </div>
                  <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: isUpdating ? [1, 1.02, 1] : 1
                }}
                transition={{ 
                  delay: 0.2,
                  duration: 0.5, 
                  repeat: isUpdating ? Infinity : 0,
                  repeatType: "reverse"
                }}
                className={`card transition-all duration-300 ${isUpdating ? 'ring-2 ring-spotify-green/50 bg-spotify-green/5' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-400 text-sm">Unique Artists</p>
                      {isUpdating && <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse"></div>}
                    </div>
                    <p className="text-3xl font-bold text-white">
                      <AnimatedNumber value={userStats.uniqueArtists} />
                    </p>
              </div>
                  <Users className="h-8 w-8 text-purple-400" />
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
                    <p className="text-gray-400 text-sm">Current Rank</p>
                    <p className="text-3xl font-bold text-white">#{userStats.rank}</p>
              </div>
                  <Trophy className="h-8 w-8 text-yellow-400" />
            </div>
          </motion.div>
        </div>
          </>
        )}

        {!loading && !error && userStats && (
          <>
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
            {activeTab === 'overview' && userStats && (
              <CardLayout userStats={userStats} />
            )}

            {activeTab === 'overview' && !userStats && (
              <div className="text-center py-12">
                <div className="text-gray-400">Loading your dashboard...</div>
              </div>
            )}

        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Achievements</h3>
                <div className="text-center py-12 text-gray-400">
                  <Award className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No achievements yet</p>
                  <p className="text-sm">Start listening to unlock achievements!</p>
                </div>
          </motion.div>
        )}

        {activeTab === 'recent' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                {userStats.recentActivity.length > 0 ? (
            <div className="space-y-4">
                    {userStats.recentActivity.map((activity, index) => {
                      const playedAt = new Date(activity.played_at)
                      const timeAgo = playedAt.toLocaleString()
                      const duration = Math.round(activity.duration_ms / 1000 / 60 * 10) / 10
                      
                      return (
                <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-spotify-green to-blue-500 rounded-full flex items-center justify-center">
                              <Music className="h-5 w-5 text-white" />
                            </div>
                  <div>
                              <p className="text-white font-medium">{activity.track_name}</p>
                              <p className="text-gray-400 text-sm">{activity.artist_name}</p>
                              <p className="text-gray-500 text-xs">{timeAgo}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-spotify-green font-semibold">{duration}m</p>
                            <p className="text-gray-400 text-xs">duration</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm">Sync your Spotify data to see your listening history</p>
                </div>
                )}
          </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
