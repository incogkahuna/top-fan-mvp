'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ExternalLink, Smartphone, Globe, ArrowRight } from 'lucide-react'

export default function MobileRedirectPage() {
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(3)
  const spotifyConnected = searchParams.get('spotify_connected') === 'true'
  const spotifyUserId = searchParams.get('spotify_user_id')
  const error = searchParams.get('error')
  const manualReturn = searchParams.get('manual') === 'true'

  useEffect(() => {
    // Immediately try to redirect on mount if successful
    if (spotifyConnected) {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(countdown - 1)
        }, 1000)
        return () => clearTimeout(timer)
      } else if (countdown === 0) {
        // Auto-redirect to profile after countdown
        window.location.href = '/profile'
      }
    }
  }, [spotifyConnected, countdown])

  const handleReturnToApp = () => {
    window.location.href = '/profile'
  }

  // If user manually navigated here (stuck on Spotify page)
  if (manualReturn || (!spotifyConnected && !error)) {
    return (
      <div className="min-h-screen bg-[#282828] text-white flex flex-col items-center justify-center p-4">
        <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#E98B8B] rounded-full flex items-center justify-center mx-auto mb-6">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold mb-3 text-[#f5f1e8]">Stuck on Spotify?</h1>
          <p className="text-[#f5f1e8]/80 mb-6">
            No problem! Click the button below to return to your profile.
          </p>
          
          <button
            onClick={handleReturnToApp}
            className="w-full bg-[#E98B8B] hover:bg-[#f0a0a0] text-white font-semibold py-4 px-6 rounded-full transition-colors duration-200 flex items-center justify-center space-x-2 mb-4"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Go to Profile</span>
          </button>

          <div className="bg-[#282828] rounded-xl p-4 mt-4">
            <p className="text-[#f5f1e8]/60 text-sm mb-2">
              💡 <strong>Tip:</strong> Bookmark this page or save your app URL for easy access
            </p>
          </div>
        </div>
      </div>
    )
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
    <div className="min-h-screen bg-[#282828] text-white flex flex-col items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[#E98B8B] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold mb-3 text-[#f5f1e8]">Successfully Connected!</h1>
        <p className="text-[#f5f1e8]/80 mb-2 text-lg">
          Your Spotify account is now linked
        </p>
        <p className="text-[#f5f1e8]/60 mb-8 text-sm">
          Tap the button below to return to the app
        </p>
        
        {/* Clean button matching app style */}
        <button
          onClick={handleReturnToApp}
          className="w-full bg-[#E98B8B] hover:bg-[#f0a0a0] text-white font-semibold py-4 px-6 rounded-full transition-colors duration-200 flex items-center justify-center space-x-2 mb-6"
        >
          <ArrowRight className="w-5 h-5" />
          <span>Return to App</span>
        </button>
        
        {countdown > 0 && (
          <div className="text-center">
            <p className="text-sm text-[#f5f1e8]/60 mb-2">
              Auto-redirecting in <span className="text-[#E98B8B] font-semibold">{countdown}</span> seconds...
            </p>
            <div className="w-full bg-[#282828] rounded-full h-1.5">
              <div 
                className="bg-[#E98B8B] h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Backup link at bottom */}
      <div className="mt-6 text-center">
        <p className="text-[#f5f1e8]/50 text-sm mb-2">
          Still on the Spotify page?
        </p>
        <a
          href="/profile"
          className="text-[#E98B8B] hover:text-[#f0a0a0] underline font-medium"
        >
          Click here to return
        </a>
      </div>
    </div>
  )
}
