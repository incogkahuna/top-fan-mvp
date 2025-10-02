'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, ExternalLink, Clock, Ticket, Music, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TourDate {
  id: string
  date: string
  time: string
  venue: string
  city: string
  ticketLink: string
  status: string
  layloId?: string
}

export default function Tour() {
  const [tourDates, setTourDates] = useState<TourDate[]>([])
  const [loading, setLoading] = useState(true)
  const [layloConnected, setLayloConnected] = useState(false)

  // Load tour dates from Laylo API
  useEffect(() => {
    const loadTourDates = async () => {
      try {
        const response = await fetch('/api/test/simple?type=laylo-tours')
        if (response.ok) {
          const data = await response.json()
          setTourDates(data.tours || [])
          setLayloConnected(!data.message && !data.error)
        } else {
          // Fallback to sample data
          setTourDates([
            {
              id: '1',
              date: 'March 15, 2025',
              time: '8:00 PM',
              venue: 'The Roxy Theatre',
              city: 'Los Angeles, CA',
              ticketLink: 'https://example.com/tickets',
              status: 'On Sale'
            }
          ])
        }
        setLoading(false)
      } catch (error) {
        console.error('Error loading tour dates:', error)
        setLoading(false)
      }
    }

    loadTourDates()
  }, [])

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
          <p className="text-white/60 text-lg">Come see Early 20's Torture live</p>
          
          {/* Laylo Connection Status */}
          {layloConnected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm mt-4"
            >
              <Zap className="h-4 w-4" />
              <span>Powered by Laylo</span>
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
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    show.status === 'Sold Out' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {show.status}
                  </span>
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
              <a
                href="https://laylo.com/early20storture"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Join Fan List</span>
                <ExternalLink className="h-4 w-4" />
              </a>
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
