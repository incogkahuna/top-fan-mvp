'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play, Music, Clock, Upload, Image } from 'lucide-react'
import { useState } from 'react'
import LeaderboardPreview from '@/components/LeaderboardPreview'
import CountdownTimer from '@/components/CountdownTimer'

export default function Home() {
  const albumCover = '/album-cover.jpg' // Permanent album cover

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
              <p className="text-lg sm:text-xl lg:text-2xl text-[#f5f1e8]/60 px-4">See who's leading the Sadie Jean listening charts</p>
            </div>

            {/* Compact Leaderboard */}
            <div className="bg-transparent backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-12 border border-[#f5f1e8]/10 mb-8 sm:mb-12">
              {/* Top 5 Preview */}
              <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <motion.div
                    key={rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rank * 0.1 }}
                    className="flex items-center justify-between p-4 sm:p-6 bg-[#f5f1e8]/5 rounded-lg hover:bg-[#f5f1e8]/10 transition-colors"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-[#8B3A3A] to-[#A04747] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm sm:text-base">#{rank}</span>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#E98B8B] to-[#E98B8B]/80 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm sm:text-base">F</span>
                      </div>
                      <div>
                        <p className="text-[#f5f1e8] font-medium text-base sm:text-lg">Fan {rank}</p>
                        <p className="text-sm sm:text-base text-[#f5f1e8]/60">{Math.floor(Math.random() * 1000) + 100} plays</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg sm:text-xl font-bold text-[#E98B8B]">#{rank}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Link href="/leaderboard" className="w-full btn-primary text-center block py-4 sm:py-6 text-lg sm:text-xl">
                View Full Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Content Grid */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Photos Card */}
            <Link href="/photos" className="card group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-4xl sm:text-6xl">📸</div>
              </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f5f1e8] mb-2">Photos</h3>
                  <p className="text-[#f5f1e8]/60 text-sm sm:text-base">View our latest gallery</p>
            </Link>

            {/* Tour Card */}
            <Link href="/tour" className="card group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-4xl sm:text-6xl">T</div>
              </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f5f1e8] mb-2">Tour Dates</h3>
                  <p className="text-[#f5f1e8]/60 text-sm sm:text-base">Find us on the road</p>
            </Link>

            {/* JeanMail Card */}
            <Link href="/jeanmail" className="card group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-4xl sm:text-6xl">@</div>
              </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#f5f1e8] mb-2">JeanMail</h3>
                  <p className="text-[#f5f1e8]/60 text-sm sm:text-base">Stay updated</p>
            </Link>
          </div>
        </motion.div>

      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-32">
            <div className="max-w-7xl mx-auto px-6 text-center">
                  <p className="text-[#f5f1e8]/60 text-sm">
                    © 2025 Sadie Jean Early Twenties Torture tour. All rights reserved.
                  </p>
            </div>
      </footer>
    </div>
  )
}
