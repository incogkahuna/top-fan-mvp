'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, CheckCircle, AlertCircle, Music, Database, TrendingUp } from 'lucide-react'

export default function SyncPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const syncSpotifyData = async () => {
    try {
      setIsSyncing(true)
      setError(null)
      setSyncResult(null)

      // First, get your user ID from the test endpoint
      const userResponse = await fetch('/api/test/user')
      const userData = await userResponse.json()
      
      if (userData.error) {
        throw new Error(userData.error)
      }

      const yourUser = userData.users.find((user: any) => user.display_name === 'Daniel Horgan')
      if (!yourUser) {
        throw new Error('User not found. Please connect your Spotify account first.')
      }

      // Now sync the data
      const syncResponse = await fetch('/api/data/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: yourUser.id
        })
      })

      const syncData = await syncResponse.json()
      
      if (syncData.error) {
        throw new Error(syncData.error)
      }

      setSyncResult(syncData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed')
      console.error('Sync error:', err)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Sync Spotify Data</h1>
          <p className="text-gray-300">Import your listening history and start earning points</p>
        </div>

        {/* Sync Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-gradient-to-br from-spotify-green to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-semibold text-white mb-4">Ready to Sync?</h2>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              This will import your recently played tracks from Spotify and update your listening statistics.
            </p>

            <button
              onClick={syncSpotifyData}
              disabled={isSyncing}
              className={`btn-primary flex items-center space-x-2 mx-auto ${
                isSyncing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{ 
                cursor: isSyncing ? 'not-allowed' : 'pointer',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#1db954',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  <span>Sync My Data</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        {syncResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8 border-green-500"
          >
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <h3 className="text-xl font-semibold text-white">Sync Successful!</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Database className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-400 text-sm">Tracks Synced</span>
                </div>
                <p className="text-2xl font-bold text-white">{syncResult.synced}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-400 text-sm">Total Plays</span>
                </div>
                <p className="text-2xl font-bold text-white">{syncResult.totalPlays}</p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-400 text-sm">Status</span>
                </div>
                <p className="text-2xl font-bold text-green-400">Complete</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-green-400 text-sm">
                Your Spotify data has been successfully imported! You can now view your stats on the dashboard and leaderboard.
              </p>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-red-500"
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-400" />
              <h3 className="text-xl font-semibold text-white">Sync Failed</h3>
            </div>
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <h3 className="text-xl font-semibold text-white mb-4">What Happens Next?</h3>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start space-x-3">
              <span className="bg-spotify-green text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
              <div>
                <p className="font-semibold">Data Import</p>
                <p className="text-sm">Your recently played tracks are imported from Spotify</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
              <div>
                <p className="font-semibold">Statistics Update</p>
                <p className="text-sm">Your play counts and rankings are calculated</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
              <div>
                <p className="font-semibold">Dashboard Populated</p>
                <p className="text-sm">View your real listening data on the dashboard and leaderboard</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
