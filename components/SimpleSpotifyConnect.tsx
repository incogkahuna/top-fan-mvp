'use client'

import { useState } from 'react'
import { Music } from 'lucide-react'

export default function SimpleSpotifyConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      setError(null)
      
      // Redirect to Spotify OAuth
      window.location.href = '/api/auth/spotify'
      
    } catch (err) {
      setError('Failed to connect to Spotify')
      console.error('Spotify connection error:', err)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <div className="text-center">
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-[#8B3A3A] hover:bg-[#A04747] text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2 mx-auto transition-colors disabled:opacity-50 shadow-lg hover:shadow-xl"
      >
        <Music className="h-5 w-5" />
        <span>{isConnecting ? 'Connecting...' : 'Connect with Spotify'}</span>
      </button>
      
      {error && (
        <div className="mt-4 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
