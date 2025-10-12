'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, CheckCircle, AlertCircle, Play } from 'lucide-react'

export default function TestSync() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testAutoSync = async () => {
    try {
      setIsRunning(true)
      setError(null)
      setResult(null)

      const response = await fetch('/api/user/auto-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed')
      console.error('Auto-sync test error:', err)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Auto-Sync Test</h1>
        
        <div className="bg-white/10 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Test Auto-Sync</h2>
          <p className="text-gray-300 mb-4">
            This will run the same auto-sync process that runs automatically every 30 seconds.
            It will check for new Spotify plays and update the database.
          </p>
          
          <button
            onClick={testAutoSync}
            disabled={isRunning}
            className="bg-white hover:bg-pink-200 disabled:bg-gray-300 text-black px-6 py-2 rounded-lg mb-4 flex items-center space-x-2"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Running Auto-Sync...</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Test Auto-Sync</span>
              </>
            )}
          </button>

          {result && (
            <div className="bg-gray-800 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Auto-Sync Results</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Users Processed</p>
                  <p className="text-2xl font-bold text-white">{result.syncedUsers}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Timestamp</p>
                  <p className="text-sm text-white">{new Date(result.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-white">User Results:</h4>
                {result.results.map((userResult: any, index: number) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{userResult.displayName}</p>
                        <p className="text-sm text-gray-400">
                          {userResult.newTracks} new tracks • {userResult.totalPlays} total plays
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        userResult.status === 'success' 
                          ? 'bg-green-500/20 text-green-400' 
                          : userResult.status === 'no_new_data'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {userResult.status}
                      </div>
                    </div>
                    {userResult.error && (
                      <p className="text-red-400 text-sm mt-2">{userResult.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-400">{error}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">How Auto-Sync Works</h3>
          <div className="space-y-3 text-blue-200">
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <p className="font-semibold">Automatic Detection</p>
                <p className="text-sm">Runs every 30 seconds to check for new Spotify plays</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <p className="font-semibold">Smart Sync</p>
                <p className="text-sm">Only fetches tracks played since the last sync</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <p className="font-semibold">Real-time Updates</p>
                <p className="text-sm">Dashboard and leaderboard refresh automatically when new data is found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
