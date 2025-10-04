'use client'

import { useEffect, useState } from 'react'

export default function TestCallback() {
  const [result, setResult] = useState<string>('Processing...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')

        if (error) {
          setResult(`Error: ${error}`)
          return
        }

        if (!code) {
          setResult('No authorization code received')
          return
        }

        setResult(`Success! Authorization code: ${code.substring(0, 20)}...`)
        
        // Try to exchange code for token
        try {
          const response = await fetch('/api/test-spotify-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          })
          
          if (response.ok) {
            const data = await response.json()
            setResult(`Token exchange successful! Access token: ${data.access_token?.substring(0, 20)}...`)
          } else {
            setResult(`Token exchange failed: ${response.status}`)
          }
        } catch (tokenError) {
          setResult(`Token exchange error: ${tokenError}`)
        }
        
      } catch (error) {
        setResult(`Callback error: ${error}`)
      }
    }

    handleCallback()
  }, [])

  return (
    <div className="min-h-screen bg-[#282828] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg p-8">
        <h1 className="text-2xl font-bold text-black mb-6">Spotify Callback Test</h1>
        
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-gray-800">{result}</p>
        </div>
        
        <div className="mt-6">
          <a 
            href="/test-spotify" 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            ← Back to Test
          </a>
        </div>
      </div>
    </div>
  )
}
