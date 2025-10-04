'use client'

import { useState } from 'react'

export default function TestSpotify() {
  const [result, setResult] = useState<string>('')

  const testSpotifyAuth = () => {
    const clientId = '3d8d032ed282470cac128ad3e41ccf6a'
    const redirectUri = 'https://earlytwentiesstorture.vercel.app/test-spotify/callback'
    
    const scopes = [
      'user-read-email',
      'user-read-private',
      'user-top-read',
      'user-read-recently-played'
    ].join(' ')

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=test`

    setResult('Redirecting to Spotify...')
    window.location.href = authUrl
  }

  return (
    <div className="min-h-screen bg-[#282828] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg p-8">
        <h1 className="text-2xl font-bold text-black mb-6">Spotify Auth Test</h1>
        
        <button
          onClick={testSpotifyAuth}
          className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          Test Spotify Connection
        </button>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-800">{result}</p>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-600">
          <p>This bypasses all complex auth systems and tests direct Spotify connection.</p>
        </div>
      </div>
    </div>
  )
}
