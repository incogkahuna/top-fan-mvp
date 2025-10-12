'use client'

import { useState } from 'react'

export default function TestRedirectPage() {
  const [testResult, setTestResult] = useState<any>(null)

  const testRedirect = async () => {
    try {
      const response = await fetch('/api/auth/spotify')
      const data = await response.text()
      
      setTestResult({
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        data: data.substring(0, 500) + '...' // Truncate for display
      })
    } catch (error) {
      setTestResult({
        error: error instanceof Error ? error.message : String(error)
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f1e8] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Spotify Redirect</h1>
        
        <div className="bg-[#282828] p-6 rounded-lg border border-[#f5f1e8]/10 mb-8">
          <h2 className="text-xl font-bold mb-4">Current Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Client ID:</strong> {process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'Not set'}</p>
            <p><strong>Redirect URI:</strong> {process.env.SPOTIFY_REDIRECT_URI || 'Not set'}</p>
          </div>
        </div>

        <div className="bg-[#282828] p-6 rounded-lg border border-[#f5f1e8]/10 mb-8">
          <button
            onClick={testRedirect}
            className="bg-[#1DB954] text-white px-6 py-3 rounded font-bold hover:bg-[#1ed760] transition-colors"
          >
            Test Spotify Redirect
          </button>
        </div>

        {testResult && (
          <div className="bg-[#282828] p-6 rounded-lg border border-[#f5f1e8]/10">
            <h2 className="text-xl font-bold mb-4">Test Result</h2>
            <pre className="bg-[#1a1a1a] p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-[#1f1a16] p-6 rounded-lg border border-[#f5f1e8]/10 mt-8">
          <h2 className="text-xl font-bold mb-4">Required Spotify App Settings</h2>
          <p className="mb-4">Make sure these URLs are added to your Spotify app's "Redirect URIs":</p>
          <div className="space-y-2 text-sm font-mono bg-[#1a1a1a] p-4 rounded">
            <div>http://127.0.0.1:3002/api/auth/spotify/callback</div>
            <div>http://localhost:3002/api/auth/spotify/callback</div>
            <div>https://your-vercel-app.vercel.app/api/auth/spotify/callback</div>
          </div>
        </div>
      </div>
    </div>
  )
}
