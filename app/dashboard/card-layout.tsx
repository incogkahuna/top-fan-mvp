'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Users, Trophy, TrendingUp, Clock } from 'lucide-react'

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

interface CardLayoutProps {
  userStats: UserStats
}

export default function CardLayout({ userStats }: CardLayoutProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Recently Played Card */}
      <ExpandableCard
        id="recently-played"
        title="Recently Played"
        icon={<Music className="h-6 w-6 text-spotify-green" />}
        preview={
          <div className="text-center py-4">
            <p className="text-2xl font-bold text-white">{userStats.recentActivity.length}</p>
            <p className="text-gray-400 text-sm">recent tracks</p>
            <p className="text-gray-500 text-xs mt-2">Click to see full history</p>
          </div>
        }
        expandedContent={
          userStats.recentActivity.length > 0 ? (
            <div className="relative">
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 space-y-3 pr-2">
                {userStats.recentActivity.map((activity, index) => {
                  const playedAt = new Date(activity.played_at)
                  const timeAgo = getTimeAgo(playedAt)
                  const duration = Math.round(activity.duration_ms / 1000 / 60 * 10) / 10
                  
                  return (
                    <div key={index} className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-spotify-green to-blue-500 rounded-full flex items-center justify-center">
                          <Music className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
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
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4" />
              <p>No recent activity. Start listening to music!</p>
            </div>
          )
        }
        isExpanded={expandedCard === 'recently-played'}
        onToggle={() => setExpandedCard(expandedCard === 'recently-played' ? null : 'recently-played')}
      />

      {/* Top Artists Card */}
      <ExpandableCard
        id="top-artists"
        title="Top Artists"
        icon={<Users className="h-6 w-6 text-purple-400" />}
        preview={
          <div className="text-center py-4">
            <p className="text-2xl font-bold text-white">{userStats.topArtists.length}</p>
            <p className="text-gray-400 text-sm">top artists</p>
            <p className="text-gray-500 text-xs mt-2">Click to see rankings</p>
          </div>
        }
        expandedContent={
          userStats.topArtists.length > 0 ? (
            <div className="space-y-3">
              {userStats.topArtists.map((artist, index) => (
                <div key={artist.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{artist.name}</p>
                      <p className="text-gray-400 text-sm">{artist.plays} plays</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <p>No top artists yet. Start listening!</p>
            </div>
          )
        }
        isExpanded={expandedCard === 'top-artists'}
        onToggle={() => setExpandedCard(expandedCard === 'top-artists' ? null : 'top-artists')}
      />

      {/* Top Tracks Card */}
      <ExpandableCard
        id="top-tracks"
        title="Top Tracks"
        icon={<Music className="h-6 w-6 text-green-400" />}
        preview={
          <div className="text-center py-4">
            <p className="text-2xl font-bold text-white">{userStats.topTracks.length}</p>
            <p className="text-gray-400 text-sm">top tracks</p>
            <p className="text-gray-500 text-xs mt-2">Click to see rankings</p>
          </div>
        }
        expandedContent={
          userStats.topTracks.length > 0 ? (
            <div className="space-y-3">
              {userStats.topTracks.map((track, index) => (
                <div key={`${track.name}-${track.artist}`} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{track.name}</p>
                      <p className="text-gray-400 text-sm">{track.artist} • {track.plays} plays</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Music className="h-12 w-12 mx-auto mb-4" />
              <p>No top tracks yet. Keep listening!</p>
            </div>
          )
        }
        isExpanded={expandedCard === 'top-tracks'}
        onToggle={() => setExpandedCard(expandedCard === 'top-tracks' ? null : 'top-tracks')}
      />

      {/* Most Played Songs Card */}
      <ExpandableCard
        id="most-played"
        title="Most Played"
        icon={<Trophy className="h-6 w-6 text-yellow-400" />}
        preview={
          <div className="text-center py-4">
            <p className="text-2xl font-bold text-white">{userStats.topTracks.filter(t => t.plays > 1).length}</p>
            <p className="text-gray-400 text-sm">repeated songs</p>
            <p className="text-gray-500 text-xs mt-2">Click to see play counts</p>
          </div>
        }
        expandedContent={
          userStats.topTracks.filter(t => t.plays > 1).length > 0 ? (
            <div className="space-y-3">
              {userStats.topTracks.filter(t => t.plays > 1).map((track, index) => (
                <div key={`${track.name}-${track.artist}`} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{track.name}</p>
                      <p className="text-gray-400 text-sm">{track.artist}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-spotify-green font-bold text-lg">{track.plays}</p>
                    <p className="text-gray-400 text-xs">plays</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="h-12 w-12 mx-auto mb-4" />
              <p>No repeated plays yet</p>
              <p className="text-sm">Keep listening to see your most played songs!</p>
            </div>
          )
        }
        isExpanded={expandedCard === 'most-played'}
        onToggle={() => setExpandedCard(expandedCard === 'most-played' ? null : 'most-played')}
      />

      {/* Listening Patterns Card */}
      <ExpandableCard
        id="listening-patterns"
        title="Listening Patterns"
        icon={<TrendingUp className="h-6 w-6 text-blue-400" />}
        preview={
          <div className="text-center py-4">
            <p className="text-2xl font-bold text-white">{userStats.uniqueArtists}</p>
            <p className="text-gray-400 text-sm">unique artists</p>
            <p className="text-gray-500 text-xs mt-2">Click to see analytics</p>
          </div>
        }
        expandedContent={
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Diversity</p>
                    <p className="text-white font-bold text-lg">{userStats.uniqueArtists}</p>
                    <p className="text-gray-500 text-xs">unique artists</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Music className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Variety</p>
                    <p className="text-white font-bold text-lg">{userStats.uniqueTracks}</p>
                    <p className="text-gray-500 text-xs">unique tracks</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total Listening Time</p>
                    <p className="text-white font-bold text-lg">{userStats.totalListeningHours.toFixed(1)}h</p>
                    <p className="text-gray-500 text-xs">across all sessions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-spotify-green font-bold text-lg">{Math.round(userStats.totalListeningHours * 60)}m</p>
                  <p className="text-gray-400 text-xs">total minutes</p>
                </div>
              </div>
            </div>
          </div>
        }
        isExpanded={expandedCard === 'listening-patterns'}
        onToggle={() => setExpandedCard(expandedCard === 'listening-patterns' ? null : 'listening-patterns')}
      />
    </div>
  )
}
