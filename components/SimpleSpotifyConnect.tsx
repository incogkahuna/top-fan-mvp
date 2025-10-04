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
      
      // For now, let's just simulate a successful connection
      // In a real app, you'd use Spotify's Web Playback SDK or a simpler auth flow
      alert('Spotify connection would happen here! For now, let\'s just go to the dashboard.')
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
      
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
        className="bg-spotify-green hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center space-x-2 mx-auto transition-colors disabled:opacity-50"
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
