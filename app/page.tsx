'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { useState, useEffect } from 'react'
import LeaderboardPreview from '@/components/LeaderboardPreview'
import CountdownTimer from '@/components/CountdownTimer'

export default function Home() {
  const albumCover = '/album-cover.jpg' // Permanent album cover
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard?limit=10')
        const data = await response.json()
        
        if (data.leaderboard && data.leaderboard.length > 0) {
          setLeaderboardData(data.leaderboard)
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  // Album cover is now permanent - no upload functionality needed

  return (
    <div className="min-h-screen bg-[#282828]">
      {/* Countdown Timer Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            {/* Countdown Timer - Better mobile scaling */}
            <div className="mb-8 sm:mb-12 lg:mb-16 scale-100 sm:scale-110 lg:scale-150">
              <CountdownTimer key="main-countdown" />
            </div>
          </motion.div>
          
          {/* Album Cover - Moved closer to countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mt-16"
          >
            {/* Album Cover - Responsive sizing */}
            <div className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[700px] lg:h-[700px] mx-auto bg-gradient-to-br from-[#E98B8B] to-[#f5f1e8] rounded-2xl shadow-2xl mb-8 sm:mb-12 flex items-center justify-center relative overflow-hidden group">
              {albumCover ? (
                <img 
                  src={albumCover} 
                  alt="Album Cover" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#E98B8B]/20 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <div className="text-8xl mb-4">M</div>
                    <div className="text-white font-bold text-xl">Album Cover</div>
                    <div className="text-white/80 text-sm mt-2">Sadie Jean Early Twenties Torture tour</div>
                  </div>
                </>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link 
                href="#" 
                target="_blank"
                className="btn-primary inline-flex items-center space-x-2 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center"
              >
                <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                <span>Listen Now</span>
              </Link>
              <Link 
                href="/tour" 
                className="btn-primary inline-flex items-center space-x-2 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-[#E98B8B] hover:bg-[#A04747] transition-colors w-full sm:w-auto justify-center"
              >
                <span>Buy Tickets</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#f5f1e8]">Top Fans</h3>
              </div>
              <p className="text-lg sm:text-xl lg:text-2xl text-[#f5f1e8]/60 px-4">See who's leading the Sadie Jean listening charts - Top 10</p>
            </div>

            {/* Compact Leaderboard */}
            <div className="bg-transparent backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-12 border border-[#f5f1e8]/10 mb-8 sm:mb-12">
              {loading ? (
                /* Loading State */
                <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rank) => (
                    <div key={rank} className="flex items-center justify-between p-4 sm:p-6 bg-[#f5f1e8]/5 rounded-lg animate-pulse">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#f5f1e8]/20 rounded-full"></div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f5f1e8]/20 rounded-full"></div>
                        <div>
                          <div className="h-4 w-20 bg-[#f5f1e8]/20 rounded mb-2"></div>
                          <div className="h-3 w-16 bg-[#f5f1e8]/20 rounded"></div>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-[#f5f1e8]/20 rounded-full"></div>
                    </div>
                  ))}
                </div>
              ) : leaderboardData.length > 0 ? (
                /* Real Leaderboard Data */
                <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                  {leaderboardData.map((user, index) => (
                    <motion.div
                      key={user.spotify_id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 sm:p-6 bg-[#f5f1e8]/5 rounded-lg hover:bg-[#f5f1e8]/10 transition-colors"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#8B3A3A] to-[#A04747] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm sm:text-base">#{user.rank}</span>
                        </div>
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#E98B8B] to-[#E98B8B]/80 rounded-full flex items-center justify-center overflow-hidden">
                          {user.profileImageUrl ? (
                            <img 
                              src={user.profileImageUrl} 
                              alt={user.displayName}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <span className="text-white font-bold text-sm sm:text-base">
                              {user.displayName?.charAt(0)?.toUpperCase() || 'F'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-[#f5f1e8] font-medium text-base sm:text-lg">
                            {user.displayName || `Fan ${user.rank}`}
                          </p>
                          <p className="text-sm sm:text-base text-[#f5f1e8]/60">{user.totalPlays || 0} plays</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg sm:text-xl font-bold text-[#E98B8B]">#{user.rank}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* No Data State */
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-xl font-semibold text-[#f5f1e8] mb-2">No Leaderboard Data Yet</h3>
                  <p className="text-[#f5f1e8]/60">Be the first to listen and appear on the leaderboard!</p>
                </div>
              )}
              
              <Link href="/leaderboard" className="w-full btn-primary text-center block py-4 sm:py-6 text-lg sm:text-xl">
                View Full Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-[#f5f1e8]/60 text-sm">
                © 2025 Sadie Jean Early Twenties Torture tour. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link 
                href="/privacy" 
                className="text-[#f5f1e8]/40 hover:text-[#f5f1e8]/60 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-[#f5f1e8]/40 hover:text-[#f5f1e8]/60 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
