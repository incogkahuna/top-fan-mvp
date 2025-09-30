'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play, Music } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Main Headline - Bold Logo Style */}
          <h1 className="text-8xl md:text-9xl font-bold text-white mb-8 tracking-tight leading-none logo-font">
            Early 20s<br/>Torture
          </h1>
          
          <p className="text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            New music out now
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link 
              href="https://open.spotify.com" 
              target="_blank"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Listen Now</span>
            </Link>
            
            <Link 
              href="/leaderboard" 
              className="px-8 py-3 border-2 border-white/20 text-white hover:bg-white/10 rounded-full transition-all duration-300 inline-flex items-center space-x-2"
            >
              <Music className="h-5 w-5" />
              <span>Join Leaderboard</span>
            </Link>
          </div>
        </motion.div>

        {/* Featured Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-32 max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Photos Card */}
            <Link href="/photos" className="card group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-6xl">📸</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Photos</h3>
              <p className="text-white/60">View our latest gallery</p>
            </Link>

            {/* Tour Card */}
            <Link href="/tour" className="card group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-6xl">🎸</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Tour Dates</h3>
              <p className="text-white/60">Find us on the road</p>
            </Link>

            {/* JeanMail Card */}
            <Link href="/jeanmail" className="card group hover:scale-105 transition-transform duration-300">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg mb-4 flex items-center justify-center">
                <div className="text-6xl">✉️</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">JeanMail</h3>
              <p className="text-white/60">Stay updated</p>
            </Link>
          </div>
        </motion.div>

      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/60 text-sm">
            © 2025 Early 20s Torture. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}