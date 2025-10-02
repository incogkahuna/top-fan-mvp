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

  const handleConnect = () => {
    console.log('Button clicked!')
    setIsConnecting(true)
    
    // Direct redirect to the API route
    console.log('Redirecting to Spotify OAuth...')
    window.location.href = '/api/auth/spotify'
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`btn-primary flex items-center space-x-2 ${className} ${
        isConnecting ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{ 
        cursor: isConnecting ? 'not-allowed' : 'pointer',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#1db954',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600'
      }}
    >
      <Music className="h-5 w-5" />
      <span>{isConnecting ? 'Connecting...' : 'Connect Spotify'}</span>
      <ExternalLink className="h-4 w-4" />
    </button>
  )
}
