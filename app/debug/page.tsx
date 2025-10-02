'use client'

import { useState } from 'react'

export default function DebugPage() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConfig = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/spotify-config')
      const data = await response.json()
      setConfig(data)
    } catch (error) {
      setConfig({ error: 'Failed to fetch config' })
    } finally {
      setLoading(false)
    }
  }

  const testSpotifyAuth = () => {
    window.location.href = '/api/auth/spotify'
  }

  return (
    <div className="min-h-screen bg-[#282828] text-[#f5f1e8] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Spotify Authentication Debug</h1>
        
        <div className="space-y-6">
          <div className="bg-[#333333] p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Test Configuration</h2>
            <button 
              onClick={testConfig}
              disabled={loading}
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-pink-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Check Config'}
            </button>
            
            {config && (
              <div className="mt-4 p-4 bg-[#1a1a1a] rounded">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-[#333333] p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Test Spotify Auth</h2>
            <button 
              onClick={testSpotifyAuth}
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-pink-200 transition-colors"
            >
              Try Spotify Login
            </button>
            <p className="text-sm text-gray-400 mt-2">
              This will redirect you to Spotify OAuth flow
            </p>
          </div>

          <div className="bg-[#333333] p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Environment Check</h2>
            <p className="text-sm text-gray-400">
              Check browser console for any errors when clicking buttons above.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
