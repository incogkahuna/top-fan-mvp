'use client'

import { useState, useEffect } from 'react'
import { useSpotifyAuth } from '@/lib/useSpotifyAuth'
import { getSpotifyUserId, setSpotifyUserId, clearAuthData } from '@/lib/auth-storage'

export default function DebugAuthFlowPage() {
  const { user, isLoading, isConnected, connectSpotify, disconnectSpotify } = useSpotifyAuth()
  const [debugLogs, setDebugLogs] = useState<string[]>([])
  const [localStorageData, setLocalStorageData] = useState<any>({})
  const [apiResponse, setApiResponse] = useState<any>(null)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = `[${timestamp}] ${message}`
    setDebugLogs(prev => [...prev, logEntry])
    console.log(logEntry)
  }

  useEffect(() => {
    addLog('🔄 Debug page loaded')
    checkCurrentState()
  }, [])

  useEffect(() => {
    addLog(`📊 Auth state changed: user=${user?.display_name || 'null'}, loading=${isLoading}, connected=${isConnected}`)
  }, [user, isLoading, isConnected])

  const checkCurrentState = () => {
    const spotifyUserId = getSpotifyUserId()
    const allLocalStorage: { [key: string]: any } = {}
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        allLocalStorage[key] = localStorage.getItem(key)
      }
    }
    
    const allCookies: { [key: string]: string } = {}
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=')
      if (name && value) {
        allCookies[name] = decodeURIComponent(value)
      }
    })
    
    setLocalStorageData({
      spotifyUserId,
      allLocalStorage,
      allCookies
    })
    
    addLog(`📋 Current state: spotifyUserId=${spotifyUserId || 'null'}`)
  }

  const testApiCall = async () => {
    const spotifyUserId = getSpotifyUserId()
    if (!spotifyUserId) {
      addLog('❌ No spotify_user_id found for API test')
      return
    }
    
    addLog(`🔍 Testing API call with userId: ${spotifyUserId}`)
    try {
      const response = await fetch(`/api/auth/me?userId=${spotifyUserId}`)
      const data = await response.json()
      setApiResponse(data)
      addLog(`📡 API response: status=${response.status}, data=${JSON.stringify(data)}`)
    } catch (error) {
      addLog(`❌ API call failed: ${error}`)
    }
  }

  const simulateLogin = () => {
    const testUserId = '31slexnyzlffio42t3gyxhy53tzy' // Real user ID from database
    addLog(`🧪 Simulating login with real user ID: ${testUserId}`)
    setSpotifyUserId(testUserId)
    setTimeout(() => {
      addLog('🔄 Checking current state...')
      checkCurrentState()
    }, 100)
  }

  const clearAll = () => {
    addLog('🧹 Clearing all auth data')
    clearAuthData()
    setTimeout(() => {
      checkCurrentState()
    }, 100)
  }

  const testRealLoginFlow = () => {
    addLog('🚀 Starting real Spotify login flow')
    connectSpotify()
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f1e8] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Authentication Flow Debug</h1>

        {/* Current State */}
        <div className="bg-[#282828] rounded-lg p-6 mb-6 border border-[#f5f1e8]/10">
          <h2 className="text-xl font-bold mb-4">Current Authentication State</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1a1a1a] p-4 rounded">
              <h3 className="font-semibold text-[#1DB954] mb-2">User State</h3>
              <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Connected:</strong> {isConnected ? 'Yes' : 'No'}</p>
              <p><strong>User:</strong> {user ? user.display_name : 'None'}</p>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded">
              <h3 className="font-semibold text-[#1DB954] mb-2">Storage</h3>
              <p><strong>Spotify User ID:</strong> {localStorageData.spotifyUserId || 'None'}</p>
              <p><strong>Has localStorage:</strong> {localStorageData.allLocalStorage && Object.keys(localStorageData.allLocalStorage).length > 0 ? 'Yes' : 'No'}</p>
              <p><strong>Has cookies:</strong> {localStorageData.allCookies && Object.keys(localStorageData.allCookies).length > 0 ? 'Yes' : 'No'}</p>
            </div>
            <div className="bg-[#1a1a1a] p-4 rounded">
              <h3 className="font-semibold text-[#1DB954] mb-2">API Response</h3>
              {apiResponse ? (
                <div>
                  <p><strong>Status:</strong> {apiResponse.error ? 'Error' : 'Success'}</p>
                  <p><strong>Data:</strong> {JSON.stringify(apiResponse).substring(0, 50)}...</p>
                </div>
              ) : (
                <p>No API response yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Debug Logs */}
        <div className="bg-[#282828] rounded-lg p-6 mb-6 border border-[#f5f1e8]/10">
          <h2 className="text-xl font-bold mb-4">Debug Logs</h2>
          <div className="bg-[#1a1a1a] p-4 rounded max-h-60 overflow-y-auto">
            {debugLogs.map((log, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {log}
              </div>
            ))}
          </div>
          <button
            onClick={() => setDebugLogs([])}
            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>

        {/* Actions */}
        <div className="bg-[#282828] rounded-lg p-6 mb-6 border border-[#f5f1e8]/10">
          <h2 className="text-xl font-bold mb-4">Test Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={checkCurrentState}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Refresh State
            </button>
            <button
              onClick={simulateLogin}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Simulate Login
            </button>
            <button
              onClick={testApiCall}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Test API Call
            </button>
            <button
              onClick={testRealLoginFlow}
              className="bg-[#1DB954] text-white px-4 py-2 rounded hover:bg-[#1ed760] transition-colors"
            >
              Real Spotify Login
            </button>
            <button
              onClick={checkCurrentState}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            >
              Check Auth Status
            </button>
            <button
              onClick={disconnectSpotify}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
            <button
              onClick={clearAll}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
            >
              Clear All Data
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>

        {/* Raw Data */}
        <div className="bg-[#282828] rounded-lg p-6 border border-[#f5f1e8]/10">
          <h2 className="text-xl font-bold mb-4">Raw Data</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">localStorage & Cookies</h3>
              <pre className="bg-[#1a1a1a] p-4 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(localStorageData, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold mb-2">API Response</h3>
              <pre className="bg-[#1a1a1a] p-4 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
