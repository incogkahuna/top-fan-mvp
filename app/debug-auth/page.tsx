'use client'

import { useState, useEffect } from 'react'
import { useSpotifyAuth } from '@/lib/useSpotifyAuth'
import { getSpotifyUserId, setSpotifyUserId, clearAuthData } from '@/lib/auth-storage'

export default function DebugAuthPage() {
  const { user, isLoading, isConnected, connectSpotify, disconnectSpotify } = useSpotifyAuth()
  const [localStorageData, setLocalStorageData] = useState<any>({})
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [apiLoading, setApiLoading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const allLocalStorage: { [key: string]: any } = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          try {
            allLocalStorage[key] = JSON.parse(localStorage.getItem(key) || 'null')
          } catch {
            allLocalStorage[key] = localStorage.getItem(key)
          }
        }
      }
      
      // Get cookies too
      const allCookies: { [key: string]: string } = {}
      document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=')
        if (name && value) {
          allCookies[name] = decodeURIComponent(value)
        }
      })
      
      setLocalStorageData({
        spotifyUserId: getSpotifyUserId(),
        allLocalStorage: allLocalStorage,
        allCookies: allCookies
      })
    }
  }, [user, isConnected])

  const testAuthMeApi = async () => {
    setApiLoading(true)
    setApiResponse(null)
    const spotifyUserId = getSpotifyUserId()
    if (!spotifyUserId) {
      setApiResponse({ error: 'No spotify_user_id in storage' })
      setApiLoading(false)
      return
    }
    try {
      const response = await fetch(`/api/auth/me?userId=${spotifyUserId}`)
      const data = await response.json()
      setApiResponse(data)
    } catch (error) {
      setApiResponse({ error: 'Failed to fetch from /api/auth/me', details: error })
    } finally {
      setApiLoading(false)
    }
  }

  const handleClearLocalStorage = () => {
    clearAuthData()
    setLocalStorageData({})
    window.location.reload()
  }

  const simulateCallback = () => {
    if (typeof window !== 'undefined') {
      const testUserId = 'test_user_12345'
      setSpotifyUserId(testUserId)
      
      // Simulate URL parameters
      const urlParams = new URLSearchParams()
      urlParams.set('spotify_connected', 'true')
      urlParams.set('spotify_user_id', testUserId)
      
      // Update URL to simulate callback
      window.history.replaceState({}, document.title, `/user?${urlParams.toString()}`)
      
      // Reload to trigger the callback handling
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f1e8] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Authentication Debug Page</h1>

        {/* Current State */}
        <div className="bg-[#282828] rounded-lg p-6 mb-6 border border-[#f5f1e8]/10">
          <h2 className="text-xl font-bold mb-4">Current State</h2>
          <div className="space-y-2">
            <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
            <div><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</div>
            <div><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}</div>
          </div>
        </div>

        {/* localStorage Data */}
        <div className="bg-[#282828] rounded-lg p-6 mb-6 border border-[#f5f1e8]/10">
          <h2 className="text-xl font-bold mb-4">localStorage Data</h2>
          <pre className="bg-[#1a1a1a] p-4 rounded text-sm overflow-auto">
            {JSON.stringify(localStorageData, null, 2)}
          </pre>
        </div>

        {/* API Test */}
        <div className="bg-[#282828] rounded-lg p-6 mb-6 border border-[#f5f1e8]/10">
          <h2 className="text-xl font-bold mb-4">API Test</h2>
          <button
            onClick={testAuthMeApi}
            disabled={apiLoading}
            className="bg-[#1DB954] text-white px-4 py-2 rounded hover:bg-[#1ed760] disabled:opacity-50 mr-4"
          >
            {apiLoading ? 'Testing...' : 'Test /api/auth/me'}
          </button>
          
          {apiResponse && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">API Response:</h3>
              <pre className="bg-[#1a1a1a] p-4 rounded text-sm overflow-auto">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-[#282828] rounded-lg p-6 mb-6 border border-[#f5f1e8]/10">
          <h2 className="text-xl font-bold mb-4">Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={connectSpotify}
              className="bg-[#1DB954] text-white px-4 py-2 rounded hover:bg-[#1ed760] transition-colors"
            >
              Connect Spotify
            </button>
            <button
              onClick={disconnectSpotify}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Disconnect Spotify
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={simulateCallback}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Simulate Callback
            </button>
            <button
              onClick={handleClearLocalStorage}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
            >
              Clear localStorage
            </button>
            <button
              onClick={() => window.location.href = '/user?error=test_error&message=This is a test error message'}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
            >
              Test Error Message
            </button>
          </div>
        </div>

        {/* Quick Tests */}
        <div className="bg-[#282828] rounded-lg p-6 mb-6 border border-[#f5f1e8]/10">
          <h2 className="text-xl font-bold mb-4">Quick Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-[#f5f1e8]">Database Tests</h3>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/test/database')
                    const data = await response.json()
                    setApiResponse(data)
                  } catch (error) {
                    setApiResponse({ error: 'Database test failed', details: error })
                  }
                }}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
              >
                Test Database Connection
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-[#f5f1e8]">Auth Flow Tests</h3>
              <button
                onClick={() => {
                  setSpotifyUserId('31slexnyzlffio42t3gyxhy53tzy')
                  window.location.href = '/user'
                }}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Test with Real User ID
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-[#282828] rounded-lg p-6 border border-[#f5f1e8]/10">
          <h2 className="text-xl font-bold mb-4">Navigation</h2>
          <div className="space-x-4">
            <a href="/user" className="text-[#1DB954] hover:text-[#1ed760] underline">User Page</a>
            <a href="/profile" className="text-[#1DB954] hover:text-[#1ed760] underline">Profile Page</a>
            <a href="/leaderboard" className="text-[#1DB954] hover:text-[#1ed760] underline">Leaderboard</a>
          </div>
        </div>
      </div>
    </div>
  )
}