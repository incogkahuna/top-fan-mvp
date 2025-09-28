'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Trophy, Star, Crown, Lock, CheckCircle, Clock } from 'lucide-react'

export default function Prizes() {
  const [activeCategory, setActiveCategory] = useState('available')

  // Mock prizes data
  const mockPrizes = {
    available: [
      {
        id: 1,
        title: 'Early Access to New Album',
        description: 'Get exclusive early access to the next album release',
        points: 500,
        category: 'Music',
        icon: '🎵',
        color: 'from-purple-500 to-pink-500',
        requirements: 'Top 100 fans',
        timeLeft: '7 days'
      },
      {
        id: 2,
        title: 'Exclusive Merchandise',
        description: 'Limited edition t-shirt and poster set',
        points: 300,
        category: 'Merchandise',
        icon: '👕',
        color: 'from-blue-500 to-cyan-500',
        requirements: 'Top 500 fans',
        timeLeft: '14 days'
      },
      {
        id: 3,
        title: 'Virtual Meet & Greet',
        description: '30-minute virtual session with the artist',
        points: 1000,
        category: 'Experience',
        icon: '🎤',
        color: 'from-green-500 to-emerald-500',
        requirements: 'Top 50 fans',
        timeLeft: '3 days'
      },
      {
        id: 4,
        title: 'Signed Vinyl Record',
        description: 'Limited edition signed vinyl of latest album',
        points: 750,
        category: 'Collectible',
        icon: '💿',
        color: 'from-orange-500 to-red-500',
        requirements: 'Top 200 fans',
        timeLeft: '21 days'
      }
    ],
    earned: [
      {
        id: 5,
        title: 'First Week Warrior Badge',
        description: 'Listened 7 days in a row',
        points: 25,
        category: 'Badge',
        icon: '🏆',
        color: 'from-yellow-500 to-orange-500',
        earned: true,
        earnedDate: '2 days ago'
      },
      {
        id: 6,
        title: 'Super Fan Certificate',
        description: 'Top 10% of all listeners',
        points: 100,
        category: 'Achievement',
        icon: '⭐',
        color: 'from-indigo-500 to-purple-500',
        earned: true,
        earnedDate: '1 week ago'
      }
    ],
    locked: [
      {
        id: 7,
        title: 'Backstage Pass',
        description: 'Exclusive backstage access to next concert',
        points: 2000,
        category: 'Experience',
        icon: '🎪',
        color: 'from-gray-500 to-gray-700',
        requirements: 'Top 10 fans',
        locked: true
      },
      {
        id: 8,
        title: 'Co-writing Session',
        description: 'Collaborate on writing a song with the artist',
        points: 5000,
        category: 'Experience',
        icon: '✍️',
        color: 'from-gray-500 to-gray-700',
        requirements: 'Top 5 fans',
        locked: true
      }
    ]
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Music': return <Gift className="h-5 w-5" />
      case 'Merchandise': return <Trophy className="h-5 w-5" />
      case 'Experience': return <Star className="h-5 w-5" />
      case 'Collectible': return <Crown className="h-5 w-5" />
      default: return <Gift className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Prizes & Rewards</h1>
          <p className="text-gray-300">Earn points by listening and unlock exclusive rewards</p>
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
                <p className="text-gray-400 text-sm">Your Points</p>
                <p className="text-3xl font-bold text-white">1,247</p>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
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
                <p className="text-gray-400 text-sm">Prizes Earned</p>
                <p className="text-3xl font-bold text-white">2</p>
              </div>
              <Trophy className="h-8 w-8 text-spotify-green" />
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
                <p className="text-gray-400 text-sm">Available Prizes</p>
                <p className="text-3xl font-bold text-white">4</p>
              </div>
              <Gift className="h-8 w-8 text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/10 rounded-lg p-1">
          {[
            { id: 'available', label: 'Available', count: mockPrizes.available.length },
            { id: 'earned', label: 'Earned', count: mockPrizes.earned.length },
            { id: 'locked', label: 'Locked', count: mockPrizes.locked.length }
          ].map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeCategory === category.id
                  ? 'bg-spotify-green text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>

        {/* Prizes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPrizes[activeCategory as keyof typeof mockPrizes].map((prize, index) => (
            <motion.div
              key={prize.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card relative ${
                prize.locked ? 'opacity-60' : ''
              }`}
            >
              {prize.locked && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
                  <Lock className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${prize.color} flex items-center justify-center text-2xl mb-4`}>
                {prize.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">{prize.title}</h3>
              <p className="text-gray-300 mb-4">{prize.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(prize.category)}
                  <span className="text-sm text-gray-400">{prize.category}</span>
                </div>
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="h-4 w-4" />
                  <span className="font-semibold">{prize.points}</span>
                </div>
              </div>

              {prize.earned ? (
                <div className="flex items-center space-x-2 text-spotify-green">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">Earned {prize.earnedDate}</span>
                </div>
              ) : prize.locked ? (
                <div className="text-gray-400 text-sm">
                  Requires: {prize.requirements}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Requires: {prize.requirements}
                  </div>
                  <div className="flex items-center space-x-1 text-orange-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{prize.timeLeft}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card mt-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Progress to Next Prize</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current: 1,247 points</span>
              <span className="text-gray-400">Next prize: 1,500 points</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-spotify-green to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: '83%' }}
              ></div>
            </div>
            <p className="text-sm text-gray-400">253 points to go!</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
