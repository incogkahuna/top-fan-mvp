'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Smartphone, Globe } from 'lucide-react'

interface MobileSpotifyConnectProps {
  onConnect: () => void
  className?: string
  children: React.ReactNode
}

export default function MobileSpotifyConnect({ onConnect, className = '', children }: MobileSpotifyConnectProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileInstructions, setShowMobileInstructions] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
      setIsMobile(isMobileDevice)
    }

    checkMobile()
  }, [])

  const handleConnect = () => {
    if (isMobile) {
      setShowMobileInstructions(true)
      // Open in new tab/window to prevent app redirect
      window.open('/api/auth/spotify', '_blank')
    } else {
      onConnect()
    }
  }

  if (showMobileInstructions) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl p-6 max-w-sm w-full border border-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Return to App</h3>
            <p className="text-gray-300 mb-6 text-sm">
              After connecting Spotify, tap the button below to return to the app:
            </p>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Globe className="w-5 h-5" />
              <span>Return to App</span>
            </button>
            
            <button
              onClick={() => setShowMobileInstructions(false)}
              className="w-full mt-3 text-gray-400 hover:text-white text-sm transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className={className}
    >
      {children}
      {isMobile && (
        <div className="flex items-center space-x-2 mt-2">
          <ExternalLink className="w-4 h-4" />
          <span className="text-xs text-gray-400">Opens in new tab</span>
        </div>
      )}
    </button>
  )
}
