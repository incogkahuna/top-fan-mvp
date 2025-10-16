'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, ExternalLink, Clock, Ticket, Music, Zap, Users, Bell, Star, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSpotifyAuth } from '@/lib/useSpotifyAuth'

interface TourDate {
  id: string
  date: string
  time: string
  venue: string
  city: string
  ticketLink: string
  status: string
  layloId?: string
  capacity?: number
  sold?: number
  price?: string
  platform?: string
  title?: string
  description?: string
}

interface LayloStats {
  totalUsers: number
  totalCampaigns: number
  openRate: number
  clickRate: number
  connected: boolean
}

export default function Tour() {
  const [tourDates, setTourDates] = useState<TourDate[]>([])
  const [loading, setLoading] = useState(true)
  const [layloConnected, setLayloConnected] = useState(false)
  const [layloStats, setLayloStats] = useState<LayloStats | null>(null)
  const [userJoinedLaylo, setUserJoinedLaylo] = useState(false)
  const [joiningLaylo, setJoiningLaylo] = useState(false)
  
  // Use Spotify authentication
  const { user, isConnected } = useSpotifyAuth()

  // Load tour dates from real ticketing platforms
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load tour dates from all ticketing sources
        const toursResponse = await fetch('/api/ticketing?source=all')
        if (toursResponse.ok) {
          const toursData = await toursResponse.json()
          setTourDates(toursData.events || [])
          // Set Laylo as connected if we get any tour data
          setLayloConnected((toursData.events || []).length > 0)
        }

        // Load Laylo stats (for fan engagement features)
        const statsResponse = await fetch('/api/laylo?type=stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setLayloStats(statsData.stats)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error loading data:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Join Laylo fan list
  const handleJoinLaylo = async () => {
    if (!user || !isConnected) {
      alert('Please connect your Spotify account first!')
      return
    }

    setJoiningLaylo(true)
    try {
      const response = await fetch('/api/laylo?action=add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          spotifyUserId: user.spotify_id,
          email: user.email,
          displayName: user.display_name,
          profileImage: user.profile_image
        })
      })

      if (response.ok) {
        setUserJoinedLaylo(true)
        alert('Successfully joined the fan list! You\'ll receive exclusive tour updates.')
      } else {
        const error = await response.json()
        alert(`Failed to join fan list: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error joining Laylo:', error)
      alert('Failed to join fan list. Please try again.')
    } finally {
      setJoiningLaylo(false)
    }
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-4 logo-font">Tour Dates</h1>
          <p className="text-white/60 text-lg">Come see Early Twenties Torture live</p>
          
          {/* Integration Status */}
          {layloConnected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm mt-4"
            >
              <Zap className="h-4 w-4" />
              <span>Live Ticket Integration</span>
            </motion.div>
          )}
        </motion.div>

        {/* Tour Dates Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Loading tour dates...</p>
          </div>
        ) : tourDates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-16"
          >
            <Calendar className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Tour Dates Yet</h3>
            <p className="text-white/60 text-lg">Check back soon for upcoming shows!</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            {tourDates.map((show, index) => (
            <motion.div
              key={show.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="card group hover:scale-105 transition-transform duration-300"
            >
              <div className="p-6">
                {/* Date and Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-orange-400" />
                    <span className="text-white font-semibold">{show.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      show.status === 'Sold Out' 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {show.status}
                    </span>
                    {show.platform && (
                      <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                        {show.platform === 'ticketmaster' ? 'TM' : 
                         show.platform === 'eventbrite' ? 'EB' : 
                         show.platform === 'manual' ? 'Custom' : show.platform}
                      </span>
                    )}
                  </div>
                </div>

                {/* Venue Info */}
                <h3 className="text-xl font-bold text-white mb-2">{show.venue}</h3>
                
                <div className="flex items-center space-x-2 text-white/60 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{show.city}</span>
                </div>

                <div className="flex items-center space-x-2 text-white/60 mb-6">
                  <Clock className="h-4 w-4" />
                  <span>{show.time}</span>
                </div>

                {/* Capacity and Price Info */}
                {show.capacity && show.sold && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                      <span>Capacity</span>
                      <span>{show.sold} / {show.capacity}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-orange-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(show.sold / show.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {show.price && (
                  <div className="text-orange-400 font-bold text-lg mb-4">
                    {show.price}
                  </div>
                )}

                {/* Ticket Button */}
                <a
                  href={show.ticketLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    show.status === 'Sold Out'
                      ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                      : 'btn-primary hover:scale-105'
                  }`}
                  onClick={show.status === 'Sold Out' ? (e) => e.preventDefault() : undefined}
                >
                  <Ticket className="h-4 w-4" />
                  <span>{show.status === 'Sold Out' ? 'Sold Out' : 'Get Tickets'}</span>
                  {show.status !== 'Sold Out' && <ExternalLink className="h-4 w-4" />
                  }
                </a>
              </div>
            </motion.div>
          ))}
          </motion.div>
        )}

        {/* Tour Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <div className="card text-center">
            <Music className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Live Music</h3>
            <p className="text-white/60">Experience our music in person</p>
          </div>

          <div className="card text-center">
            <Calendar className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Multiple Dates</h3>
            <p className="text-white/60">Touring across the country</p>
          </div>

          <div className="card text-center">
            <Ticket className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Get Tickets</h3>
            <p className="text-white/60">Secure your spot at our shows</p>
          </div>
        </motion.div>

        {/* No Shows Message */}
        {tourDates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-16"
          >
            <Calendar className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Tour Dates Yet</h3>
            <p className="text-white/60 text-lg">Check back soon for upcoming shows!</p>
          </motion.div>
        )}

        {/* Laylo Fan Signup */}
        {layloConnected && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-16"
          >
            <div className="card max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-orange-400" />
                <h2 className="text-3xl font-bold text-white">Join the Fan List</h2>
              </div>
              <p className="text-white/60 mb-6">
                Get exclusive access to presales, VIP experiences, and behind-the-scenes content.
                Powered by Laylo for the best fan experience.
              </p>
              
              {isConnected && user ? (
                <div>
                  {userJoinedLaylo ? (
                    <div className="bg-green-500/20 text-green-400 px-6 py-3 rounded-lg mb-4">
                      <div className="flex items-center justify-center space-x-2">
                        <Star className="h-5 w-5" />
                        <span>You're on the fan list! 🎉</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleJoinLaylo}
                      disabled={joiningLaylo}
                      className="btn-primary inline-flex items-center space-x-2 disabled:opacity-50"
                    >
                      {joiningLaylo ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4" />
                          <span>Join Fan List</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-white/60 mb-4">Connect your Spotify account to join the fan list</p>
                  <a
                    href="/leaderboard"
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <span>Connect Spotify</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Laylo Stats */}
        {layloStats && layloStats.connected && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-4 gap-6 mb-16"
          >
            <div className="card text-center">
              <Users className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{layloStats.totalUsers}</div>
              <div className="text-white/60 text-sm">Fan List Members</div>
            </div>
            
            <div className="card text-center">
              <Bell className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{layloStats.totalCampaigns}</div>
              <div className="text-white/60 text-sm">Campaigns Sent</div>
            </div>
            
            <div className="card text-center">
              <TrendingUp className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{Math.round(layloStats.openRate * 100)}%</div>
              <div className="text-white/60 text-sm">Open Rate</div>
            </div>
            
            <div className="card text-center">
              <Zap className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{Math.round(layloStats.clickRate * 100)}%</div>
              <div className="text-white/60 text-sm">Click Rate</div>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="card max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-white/60 mb-6">
              Want to be the first to know about new tour dates? 
              Subscribe to JeanMail for exclusive announcements.
            </p>
            <a
              href="/jeanmail"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Subscribe to JeanMail</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
