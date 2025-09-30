'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimal & Centered */}
      <div className="container mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Main Headline - Bold & Impactful */}
          <h1 className="text-7xl md:text-8xl font-bold text-black mb-8 tracking-tight leading-none">
            Be the
            <br />
            <span className="italic">Top Fan</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Turn your Spotify listening into competition.
            <br />
            Compete with fans. Earn exclusive rewards.
          </p>

          {/* CTA Button */}
          <Link href="/login" className="btn-primary inline-block">
            Connect Spotify
          </Link>
        </motion.div>

        {/* Feature List - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-32 max-w-3xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center">
              <h3 className="text-6xl font-bold text-black mb-3">01</h3>
              <h4 className="text-lg font-semibold text-black mb-2">Compete</h4>
              <p className="text-gray-600 text-sm">
                Climb the rankings based on your listening habits
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-6xl font-bold text-black mb-3">02</h3>
              <h4 className="text-lg font-semibold text-black mb-2">Track</h4>
              <p className="text-gray-600 text-sm">
                See your stats, top artists, and listening patterns
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-6xl font-bold text-black mb-3">03</h3>
              <h4 className="text-lg font-semibold text-black mb-2">Win</h4>
              <p className="text-gray-600 text-sm">
                Earn exclusive prizes and fan experiences
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer - Minimal */}
      <footer className="border-t border-gray-100 py-12 mt-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Top Fan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}