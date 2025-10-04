'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TestCallback() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const success = searchParams.get('success')
  const details = searchParams.get('details')

  return (
    <div style={{ padding: '20px', backgroundColor: '#282828', color: 'white', minHeight: '100vh' }}>
      <h1>🎵 Spotify Callback Debug</h1>
      
      {success && (
        <div style={{ 
          backgroundColor: '#1db954', 
          padding: '15px', 
          borderRadius: '8px', 
          margin: '10px 0' 
        }}>
          ✅ <strong>Success!</strong> Authorization code received from Spotify
        </div>
      )}

      {error && (
        <div style={{ 
          backgroundColor: '#e74c3c', 
          padding: '15px', 
          borderRadius: '8px', 
          margin: '10px 0' 
        }}>
          ❌ <strong>Error:</strong> {error}
          {details && (
            <div style={{ marginTop: '10px', fontSize: '14px' }}>
              <strong>Details:</strong> {decodeURIComponent(details)}
            </div>
          )}
        </div>
      )}

      {code && (
        <div style={{ 
          backgroundColor: '#2c3e50', 
          padding: '15px', 
          borderRadius: '8px', 
          margin: '10px 0' 
        }}>
          🔑 <strong>Authorization Code:</strong> {code.substring(0, 20)}...
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Debug Information:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</li>
          <li><strong>Code Present:</strong> {code ? 'Yes' : 'No'}</li>
          <li><strong>Error Present:</strong> {error ? 'Yes' : 'No'}</li>
          <li><strong>Success Flag:</strong> {success ? 'Yes' : 'No'}</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <a href="/test" style={{ color: '#1db954', textDecoration: 'none' }}>
          ← Back to Test
        </a>
      </div>
    </div>
  )
}
