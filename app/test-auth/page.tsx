'use client'

import { useState, useEffect } from 'react'
import { useSpotifyAuth } from '@/lib/useSpotifyAuth'

export default function TestAuthPage() {
  const { user, isLoading, isConnected, connectSpotify, disconnectSpotify } = useSpotifyAuth()
  const [localStorageData, setLocalStorageData] = useState<any>(null)
  const [apiTest, setApiTest] = useState<any>(null)

  useEffect(() => {
    // Check localStorage
    if (typeof window !== 'undefined') {
      const spotifyUserId = localStorage.getItem('spotify_user_id')
      const allLocalStorage = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          allLocalStorage[key] = localStorage.getItem(key)
        }
      }
      setLocalStorageData({ spotifyUserId, allLocalStorage })
    }
  }, [])

  const testApiCall = async () => {
    if (typeof window !== 'undefined') {
      const spotifyUserId = localStorage.getItem('spotify_user_id')
      if (spotifyUserId) {
        try {
          const response = await fetch(`/api/auth/me?userId=${spotifyUserId}`)
          const data = await response.json()
          setApiTest({ status: response.status, data })
        } catch (error) {
          setApiTest({ error: error.message })
        }
      } else {
        setApiTest({ error: 'No spotify_user_id in localStorage' })
      }
    }
  }

  const simulateLogin = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('spotify_user_id', 'test_user_123')
      window.location.reload()
    }
  }

  const clearAuth = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spotify_user_id')
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f1e8] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="grid gap-6">
          {/* useSpotifyAuth Hook Status */}
          <div className="bg-[#282828] p-6 rounded-lg border border-[#f5f1e8]/10">
            <h2 className="text-xl font-bold mb-4">useSpotifyAuth Hook Status</h2>
            <div className="space-y-2">
              <p><strong>isLoading:</strong> {isLoading ? 'true' : 'false'}</p>
              <p><strong>isConnected:</strong> {isConnected ? 'true' : 'false'}</p>
              <p><strong>user:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
            </div>
          </div>

          {/* localStorage Data */}
          <div className="bg-[#282828] p-6 rounded-lg border border-[#f5f1e8]/10">
            <h2 className="text-xl font-bold mb-4">localStorage Data</h2>
            <pre className="bg-[#1a1a1a] p-4 rounded text-sm overflow-auto">
              {localStorageData ? JSON.stringify(localStorageData, null, 2) : 'Loading...'}
            </pre>
          </div>

          {/* API Test */}
          <div className="bg-[#282828] p-6 rounded-lg border border-[#f5f1e8]/10">
            <h2 className="text-xl font-bold mb-4">API Test</h2>
            <button
              onClick={testApiCall}
              className="bg-[#1DB954] text-white px-4 py-2 rounded mb-4 mr-4"
            >
              Test /api/auth/me
            </button>
            <pre className="bg-[#1a1a1a] p-4 rounded text-sm overflow-auto">
              {apiTest ? JSON.stringify(apiTest, null, 2) : 'Click button to test'}
            </pre>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#282828] p-6 rounded-lg border border-[#f5f1e8]/10">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-x-4">
              <button
                onClick={connectSpotify}
                className="bg-[#1DB954] text-white px-4 py-2 rounded"
              >
                Connect Spotify
              </button>
              <button
                onClick={disconnectSpotify}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Disconnect Spotify
              </button>
              <button
                onClick={simulateLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Simulate Login (Test)
              </button>
              <button
                onClick={clearAuth}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Clear Auth
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
