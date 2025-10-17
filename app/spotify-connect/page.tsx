'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Music } from 'lucide-react'

export default function SpotifyConnectPage() {
  const [countdown, setCountdown] = useState(3)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (hasStarted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (hasStarted && countdown === 0) {
      // Redirect to Spotify auth
      window.location.href = '/api/auth/spotify'
    }
  }, [hasStarted, countdown])

  const handleConnect = () => {
    setHasStarted(true)
  }

  const handleManualReturn = () => {
    window.location.href = '/profile'
  }

  if (hasStarted) {
    return (
      <div className="min-h-screen bg-[#282828] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-6">
            <Music className="w-10 h-10 text-white animate-pulse" />
          </div>
          
          <h1 className="text-2xl font-bold mb-4 text-[#f5f1e8]">Connecting to Spotify...</h1>
          <p className="text-[#f5f1e8]/80 mb-6">
            Redirecting in {countdown}...
          </p>
          
          <div className="w-full bg-[#282828] rounded-full h-1.5 mb-6">
            <div 
              className="bg-[#1DB954] h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#282828] text-white flex flex-col items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full">
        <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-6">
          <Music className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-[#f5f1e8] text-center">Connect Spotify</h1>
        
        <div className="bg-[#282828] rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3 mb-3">
            <div className="w-6 h-6 bg-[#E98B8B] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">1</span>
            </div>
            <p className="text-[#f5f1e8]/80 text-sm">
              You'll be taken to Spotify to authorize access
            </p>
          </div>
          
          <div className="flex items-start space-x-3 mb-3">
            <div className="w-6 h-6 bg-[#E98B8B] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">2</span>
            </div>
            <p className="text-[#f5f1e8]/80 text-sm">
              Click "Agree" or "Authorize" on the Spotify page
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-[#E98B8B] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">3</span>
            </div>
            <p className="text-[#f5f1e8]/80 text-sm">
              You'll be automatically redirected back to your profile
            </p>
          </div>
        </div>

        
        <button
          onClick={handleConnect}
          className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold py-4 px-6 rounded-full transition-colors duration-200 flex items-center justify-center space-x-2 mb-4"
        >
          <span>Connect Spotify</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={handleManualReturn}
          className="w-full bg-[#E98B8B] hover:bg-[#f0a0a0] text-white font-medium py-3 px-6 rounded-full transition-colors duration-200 text-sm"
        >
          Already Connected? Return to Profile
        </button>
      </div>
    </div>
  )
}

