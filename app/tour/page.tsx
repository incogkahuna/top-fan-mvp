'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, ExternalLink, Clock, Ticket, Music } from 'lucide-react'

// Placeholder tour dates - replace with real data
const tourDates = [
  {
    id: 1,
    date: 'March 15, 2025',
    time: '8:00 PM',
    venue: 'The Roxy Theatre',
    city: 'Los Angeles, CA',
    ticketLink: 'https://example.com/tickets',
    status: 'On Sale'
  },
  {
    id: 2,
    date: 'March 22, 2025',
    time: '9:00 PM',
    venue: 'The Fillmore',
    city: 'San Francisco, CA',
    ticketLink: 'https://example.com/tickets',
    status: 'Sold Out'
  },
  {
    id: 3,
    date: 'March 29, 2025',
    time: '8:30 PM',
    venue: 'Brooklyn Steel',
    city: 'Brooklyn, NY',
    ticketLink: 'https://example.com/tickets',
    status: 'On Sale'
  },
  {
    id: 4,
    date: 'April 5, 2025',
    time: '8:00 PM',
    venue: 'House of Blues',
    city: 'Chicago, IL',
    ticketLink: 'https://example.com/tickets',
    status: 'On Sale'
  },
]

export default function Tour() {
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
          <p className="text-white/60 text-lg">Come see Early 20s Torture live</p>
        </motion.div>

        {/* Tour Dates Grid */}
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
