'use client'

import { useEffect, useState } from 'react'

export default function SimpleCallback() {
  const [result, setResult] = useState<string>('Processing...')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    const state = urlParams.get('state')

    if (error) {
      setResult(`❌ ERROR: ${error}`)
    } else if (code) {
      setResult(`✅ SUCCESS! Code: ${code.substring(0, 20)}...`)
    } else {
      setResult('❌ No code or error received')
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#282828] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg p-8">
        <h1 className="text-2xl font-bold text-black mb-6">Spotify Callback Result</h1>
        
        <div className="p-4 bg-gray-100 rounded-lg mb-6">
          <p className="text-gray-800 font-mono">{result}</p>
        </div>
        
        <div className="space-y-2">
          <a 
            href="/simple-test" 
            className="block text-blue-500 hover:text-blue-700 underline"
          >
            ← Back to Test
          </a>
          <a 
            href="/" 
            className="block text-blue-500 hover:text-blue-700 underline"
          >
            ← Home
          </a>
        </div>
      </div>
    </div>
  )
}
