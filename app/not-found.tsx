'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, ArrowLeft, Music } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        {/* 404 Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <div className="relative">
            <h1 className="text-8xl font-bold text-[#E98B8B] mb-4 logo-font">404</h1>
            <div className="absolute -top-2 -right-2">
              <Music className="h-8 w-8 text-[#E98B8B]/60 animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold text-[#f5f1e8] mb-4">
            Page Not Found
          </h2>
          <p className="text-[#f5f1e8]/60 leading-relaxed">
            Looks like this page got lost in the music! The page you're looking for doesn't exist or may have been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link 
            href="/" 
            className="btn-primary flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-[#E98B8B] hover:bg-[#d67c7c] text-white font-medium transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center justify-center space-x-2 px-6 py-3 rounded-lg bg-[#282828] hover:bg-[#3a3a3a] text-[#f5f1e8] font-medium transition-colors border border-[#E98B8B]/20"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-6 border-t border-[#E98B8B]/20"
        >
          <p className="text-sm text-[#f5f1e8]/40">
            Need help? Try visiting the{' '}
            <Link href="/leaderboard" className="text-[#E98B8B] hover:text-[#d67c7c] transition-colors">
              leaderboard
            </Link>
            {' '}or{' '}
            <Link href="/tour" className="text-[#E98B8B] hover:text-[#d67c7c] transition-colors">
              tour dates
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
