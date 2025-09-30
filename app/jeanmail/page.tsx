'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'

export default function JeanMail() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement actual newsletter signup
    console.log('Newsletter signup:', { name, email })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setName('')
      setEmail('')
    }, 3000)
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-4 logo-font">JeanMail</h1>
          <p className="text-white/60 text-lg">Get exclusive updates, new music, and tour announcements</p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <Mail className="h-5 w-5" />
                <span>Subscribe to JeanMail</span>
              </button>
            </form>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">You're subscribed!</h3>
              <p className="text-white/60">Thanks for joining JeanMail. Check your inbox soon!</p>
            </div>
          )}

          {/* Benefits List */}
          {!submitted && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-white/60 text-sm mb-4">What you'll get:</p>
              <ul className="space-y-2 text-white/80 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="text-orange-400">✓</span>
                  <span>Early access to new music</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-orange-400">✓</span>
                  <span>Exclusive tour announcements</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-orange-400">✓</span>
                  <span>Behind-the-scenes content</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-orange-400">✓</span>
                  <span>Special fan-only offers</span>
                </li>
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
