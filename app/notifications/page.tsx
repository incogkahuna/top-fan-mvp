'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Trophy, Star, Gift, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react'

export default function Notifications() {
  const [filter, setFilter] = useState('all')

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You earned the "First Week Warrior" badge for listening 7 days in a row',
      time: '2 hours ago',
      read: false,
      icon: Trophy,
      color: 'text-yellow-400'
    },
    {
      id: 2,
      type: 'ranking',
      title: 'Ranking Update',
      message: 'You climbed to #15 on the leaderboard! Keep it up!',
      time: '1 day ago',
      read: false,
      icon: TrendingUp,
      color: 'text-spotify-green'
    },
    {
      id: 3,
      type: 'prize',
      title: 'New Prize Available',
      message: 'Exclusive merchandise is now available for 300 points',
      time: '2 days ago',
      read: true,
      icon: Gift,
      color: 'text-purple-400'
    },
    {
      id: 4,
      type: 'milestone',
      title: 'Listening Milestone',
      message: 'You\'ve reached 1,000 total plays! Amazing dedication!',
      time: '3 days ago',
      read: true,
      icon: Star,
      color: 'text-blue-400'
    },
    {
      id: 5,
      type: 'social',
      title: 'Fan Challenge',
      message: 'MusicLover99 challenged you to a listening competition',
      time: '4 days ago',
      read: true,
      icon: Users,
      color: 'text-pink-400'
    },
    {
      id: 6,
      type: 'reminder',
      title: 'Weekly Goal',
      message: 'You\'re 50 plays away from your weekly goal. Keep listening!',
      time: '5 days ago',
      read: true,
      icon: Clock,
      color: 'text-orange-400'
    }
  ]

  const filteredNotifications = filter === 'all' 
    ? mockNotifications 
    : mockNotifications.filter(notif => notif.type === filter)

  const unreadCount = mockNotifications.filter(notif => !notif.read).length

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'achievement': return 'Achievement'
      case 'ranking': return 'Ranking'
      case 'prize': return 'Prize'
      case 'milestone': return 'Milestone'
      case 'social': return 'Social'
      case 'reminder': return 'Reminder'
      default: return 'Other'
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-gray-300">Stay updated with your fan journey</p>
          </div>
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6 text-spotify-green" />
            {unreadCount > 0 && (
              <span className="bg-spotify-green text-white text-sm font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unread</p>
                <p className="text-3xl font-bold text-white">{unreadCount}</p>
              </div>
              <Bell className="h-8 w-8 text-spotify-green" />
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
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-3xl font-bold text-white">{mockNotifications.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-400" />
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
                <p className="text-gray-400 text-sm">This Week</p>
                <p className="text-3xl font-bold text-white">3</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'all', label: 'All' },
            { id: 'achievement', label: 'Achievements' },
            { id: 'ranking', label: 'Rankings' },
            { id: 'prize', label: 'Prizes' },
            { id: 'milestone', label: 'Milestones' },
            { id: 'social', label: 'Social' }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === filterOption.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white hover:text-black'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card cursor-pointer transition-all duration-200 hover:bg-white/15 ${
                !notification.read ? 'border-l-4 border-spotify-green' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full bg-white/10 ${notification.color}`}>
                  <notification.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{notification.title}</h3>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
                      )}
                      <span className="text-sm text-gray-400">{notification.time}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-2">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-white/10 px-2 py-1 rounded-full">
                      {getTypeLabel(notification.type)}
                    </span>
                    {!notification.read && (
                      <button className="text-spotify-green text-sm hover:text-spotify-light transition-colors">
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Bell className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? "You're all caught up! Check back later for updates."
                : `No ${filter} notifications found.`
              }
            </p>
          </motion.div>
        )}

        {/* Mark All as Read */}
        {unreadCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <button className="btn-secondary">
              Mark all as read
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
