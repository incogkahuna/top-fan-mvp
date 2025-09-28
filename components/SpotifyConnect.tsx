'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Music, ExternalLink } from 'lucide-react'

interface SpotifyConnectProps {
  onConnect?: () => void
  className?: string
}

export default function SpotifyConnect({ onConnect, className = '' }: SpotifyConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    
    try {
      // Redirect to Spotify OAuth
      window.location.href = '/api/auth/spotify'
    } catch (error) {
      console.error('Connection error:', error)
      setIsConnecting(false)
    }
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleConnect}
      disabled={isConnecting}
      className={`btn-primary flex items-center space-x-2 ${className} ${
        isConnecting ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <Music className="h-5 w-5" />
      <span>{isConnecting ? 'Connecting...' : 'Connect Spotify'}</span>
      <ExternalLink className="h-4 w-4" />
    </motion.button>
  )
}
