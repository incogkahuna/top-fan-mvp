'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play, Music, Clock, Upload, Image } from 'lucide-react'
import { useState } from 'react'
import LeaderboardPreview from '@/components/LeaderboardPreview'

export default function Home() {
  const [albumCover, setAlbumCover] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAlbumCover(e.target?.result as string)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Split Hero Section */}
      <div className="relative min-h-screen flex flex-col lg:flex-row bg-[#282828]">
        
        {/* Left Half - Album Cover */}
        <div className="w-full lg:w-1/2 relative flex items-center justify-center bg-gradient-to-br from-[#E98B8B]/10 to-transparent min-h-[50vh] lg:min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center p-12"
          >
            {/* Album Cover */}
            <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-[#E98B8B] to-[#f5f1e8] rounded-2xl shadow-2xl mb-8 flex items-center justify-center relative overflow-hidden group">
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
                    <div className="text-8xl mb-4">♪</div>
                    <div className="text-white font-bold text-xl">Album Cover</div>
                    <div className="text-white/80 text-sm mt-2">Early Twenties Torture</div>
                  </div>
                </>
              )}
              
              {/* Upload Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
                <label className="cursor-pointer flex flex-col items-center space-y-2">
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  ) : (
                    <Upload className="h-8 w-8 text-white" />
                  )}
                  <span className="text-white text-sm font-medium">
                    {isUploading ? 'Uploading...' : 'Upload Cover'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            {/* Album Info */}
            <h2 className="text-4xl font-bold text-[#f5f1e8] mb-4 logo-font">
              Early Twenties Torture
            </h2>
            <p className="text-xl text-[#f5f1e8]/80 mb-8">New music out now</p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="https://open.spotify.com" 
                target="_blank"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <Play className="h-6 w-6" />
                <span>Listen Now</span>
              </Link>
              
              {albumCover && (
                <button
                  onClick={() => setAlbumCover(null)}
                  className="inline-flex items-center space-x-2 text-lg px-6 py-4 bg-transparent border border-[#f5f1e8]/20 text-[#f5f1e8] rounded-lg hover:bg-[#f5f1e8]/10 transition-colors"
                >
                  <Image className="h-5 w-5" />
                  <span>Remove Cover</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Half - Leaderboard & Countdown */}
        <div className="w-full lg:w-1/2 relative flex flex-col items-center justify-center p-6 lg:p-12 min-h-[50vh] lg:min-h-screen">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-lg"
          >
            {/* Countdown Timer */}
            <div className="bg-transparent backdrop-blur-sm rounded-2xl p-8 mb-8 border border-[#f5f1e8]/10 text-center">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-[#E98B8B] mr-2" />
                <h3 className="text-2xl font-bold text-[#f5f1e8]">Next Release</h3>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#E98B8B]">00</div>
                  <div className="text-sm text-[#f5f1e8]/60">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#E98B8B]">00</div>
                  <div className="text-sm text-[#f5f1e8]/60">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#E98B8B]">00</div>
                  <div className="text-sm text-[#f5f1e8]/60">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#E98B8B]">00</div>
                  <div className="text-sm text-[#f5f1e8]/60">Seconds</div>
                </div>
              </div>
              <p className="text-[#f5f1e8]/60 text-sm">Stay tuned for updates!</p>
            </div>

            {/* Compact Leaderboard */}
            <div className="bg-transparent backdrop-blur-sm rounded-2xl p-6 border border-[#f5f1e8]/10">
              <div className="flex items-center justify-center mb-4">
                <Music className="h-5 w-5 text-[#E98B8B] mr-2" />
                <h3 className="text-xl font-bold text-[#f5f1e8]">Top Fans</h3>
              </div>
              
              {/* Top 3 Preview */}
              <div className="space-y-3 mb-6">
                {[1, 2, 3].map((rank) => (
                  <motion.div
                    key={rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rank * 0.1 }}
                    className="flex items-center justify-between p-3 bg-[#f5f1e8]/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">#{rank}</span>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-[#E98B8B] to-[#E98B8B]/80 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">♪</span>
                      </div>
                      <div>
                        <p className="text-[#f5f1e8] font-medium text-sm">Fan {rank}</p>
                        <p className="text-xs text-[#f5f1e8]/60">{Math.floor(Math.random() * 1000) + 100} plays</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#E98B8B]">#{rank}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Link href="/leaderboard" className="w-full btn-primary text-center block py-3">
                View Full Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

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
                <div className="text-6xl">♪</div>
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
                    © 2025 Early Twenties Torture. All rights reserved.
                  </p>
            </div>
      </footer>
    </div>
  )
}