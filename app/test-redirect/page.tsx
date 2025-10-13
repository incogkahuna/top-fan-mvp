'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TestRedirect() {
  const searchParams = useSearchParams()
  const [params, setParams] = useState<Record<string, string>>({})

  useEffect(() => {
    // Get all URL parameters
    const urlParams: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      urlParams[key] = value
    })
    setParams(urlParams)
  }, [searchParams])

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Spotify Redirect Test</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Current URL Parameters:</h2>
          {Object.keys(params).length === 0 ? (
            <p className="text-gray-400">No parameters detected</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(params).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="font-mono bg-gray-700 px-2 py-1 rounded text-green-400 min-w-[200px]">
                    {key}
                  </span>
                  <span className="font-mono bg-gray-700 px-2 py-1 rounded ml-2 text-blue-400">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          {params.spotify_connected === 'true' ? (
            <div className="text-green-400">
              ✅ <strong>SUCCESS!</strong> Spotify authentication completed successfully.
              <br />
              User ID: <span className="font-mono">{params.spotify_user_id}</span>
            </div>
          ) : params.error ? (
            <div className="text-red-400">
              ❌ <strong>ERROR:</strong> {params.error}
              {params.message && (
                <div className="mt-2 text-sm text-gray-400">
                  Message: {decodeURIComponent(params.message)}
                </div>
              )}
            </div>
          ) : (
            <div className="text-yellow-400">
              ⚠️ No Spotify authentication data detected. This page is for testing redirects.
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How to Test:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Go to your leaderboard: <code className="bg-gray-700 px-2 py-1 rounded">https://earlytwentiesstorture.vercel.app/leaderboard</code></li>
            <li>Click "Connect Spotify"</li>
            <li>Complete Spotify authentication</li>
            <li>You should be redirected to: <code className="bg-gray-700 px-2 py-1 rounded">/test-redirect?spotify_connected=true&spotify_user_id=...</code></li>
            <li>This page will show you exactly what parameters were passed</li>
          </ol>
          
          <div className="mt-4 p-4 bg-blue-900 rounded-lg">
            <p className="text-blue-200">
              <strong>Note:</strong> This page bypasses cookie issues because it shows the URL parameters directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}