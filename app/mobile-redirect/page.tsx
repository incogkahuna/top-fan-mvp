'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ExternalLink, Smartphone, Globe } from 'lucide-react'

export default function MobileRedirectPage() {
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(5)
  const spotifyConnected = searchParams.get('spotify_connected') === 'true'
  const spotifyUserId = searchParams.get('spotify_user_id')
  const error = searchParams.get('error')

  useEffect(() => {
    if (spotifyConnected && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (spotifyConnected && countdown === 0) {
      // Auto-redirect to leaderboard after countdown
      window.location.href = '/leaderboard'
    }
  }, [spotifyConnected, countdown])

  const handleReturnToApp = () => {
    window.location.href = '/leaderboard'
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center border border-red-500/20">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">❌</span>
          </div>
          
          <h1 className="text-2xl font-bold mb-4 text-red-400">Connection Failed</h1>
          <p className="text-gray-300 mb-6">
            There was an error connecting your Spotify account: {error}
          </p>
          
          <button
            onClick={handleReturnToApp}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Globe className="w-5 h-5" />
            <span>Return to App</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center border border-green-500/20">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-green-400">Successfully Connected!</h1>
        <p className="text-gray-300 mb-6">
          Your Spotify account has been connected successfully. You can now return to the app.
        </p>
        
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Mobile Users</span>
          </div>
          <p className="text-sm text-gray-300">
            Tap the button below to return to the app
          </p>
        </div>
        
        <button
          onClick={handleReturnToApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 mb-4"
        >
          <Globe className="w-5 h-5" />
          <span>Return to App</span>
        </button>
        
        {countdown > 0 && (
          <p className="text-sm text-gray-400">
            Auto-redirecting in {countdown} seconds...
          </p>
        )}
      </div>
    </div>
  )
}
