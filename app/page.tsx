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
      <section className="py-24 px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            
            {/* Countdown Timer - Force cache refresh */}
            <div className="mb-16 scale-125 lg:scale-150">
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
            {/* Album Cover */}
            <div className="w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] mx-auto bg-gradient-to-br from-[#E98B8B] to-[#f5f1e8] rounded-2xl shadow-2xl mb-12 flex items-center justify-center relative overflow-hidden group">
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="#" 
                target="_blank"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <Play className="h-6 w-6" />
                <span>Listen Now</span>
              </Link>
              <Link 
                href="/tour" 
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4 bg-[#E98B8B] hover:bg-[#A04747] transition-colors"
              >
                <span>Buy Tickets</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-24 px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="text-center mb-6">
                <h3 className="text-4xl lg:text-5xl font-bold text-[#f5f1e8]">Top Fans</h3>
              </div>
              <p className="text-xl lg:text-2xl text-[#f5f1e8]/60">See who's leading the Sadie Jean listening charts</p>
            </div>

            {/* Compact Leaderboard */}
            <div className="bg-transparent backdrop-blur-sm rounded-2xl p-12 border border-[#f5f1e8]/10 mb-12">
              {/* Top 5 Preview */}
              <div className="space-y-6 mb-12">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <motion.div
                    key={rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rank * 0.1 }}
                    className="flex items-center justify-between p-6 bg-[#f5f1e8]/5 rounded-lg hover:bg-[#f5f1e8]/10 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#8B3A3A] to-[#A04747] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-base">#{rank}</span>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-[#E98B8B] to-[#E98B8B]/80 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-base">F</span>
                      </div>
                      <div>
                        <p className="text-[#f5f1e8] font-medium text-lg">Fan {rank}</p>
                        <p className="text-base text-[#f5f1e8]/60">{Math.floor(Math.random() * 1000) + 100} plays</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#E98B8B]">#{rank}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Link href="/leaderboard" className="w-full btn-primary text-center block py-6 text-xl">
                View Full Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Content Grid */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Photos Card */}
            <Link href="/photos" className="card group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-6xl">📸</div>
              </div>
                  <h3 className="text-2xl font-bold text-[#f5f1e8] mb-2">Photos</h3>
                  <p className="text-[#f5f1e8]/60">View our latest gallery</p>
            </Link>

            {/* Tour Card */}
            <Link href="/tour" className="card group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-6xl">T</div>
              </div>
                  <h3 className="text-2xl font-bold text-[#f5f1e8] mb-2">Tour Dates</h3>
                  <p className="text-[#f5f1e8]/60">Find us on the road</p>
            </Link>

            {/* JeanMail Card */}
            <Link href="/jeanmail" className="card group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-6xl">@</div>
              </div>
                  <h3 className="text-2xl font-bold text-[#f5f1e8] mb-2">JeanMail</h3>
                  <p className="text-[#f5f1e8]/60">Stay updated</p>
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
