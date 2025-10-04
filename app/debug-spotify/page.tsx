'use client'

import { useState } from 'react'

export default function DebugSpotify() {
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (step: string, success: boolean, data: any) => {
    setResults(prev => [...prev, {
      step,
      success,
      data,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const testEnvironmentVariables = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/debug/env')
      const data = await response.json()
      addResult('Environment Variables', response.ok, data)
    } catch (error) {
      addResult('Environment Variables', false, { error: error.message })
    }
    setIsLoading(false)
  }

  const testSpotifyAuthRoute = async () => {
    setIsLoading(true)
    try {
      // Test the auth route directly
      window.location.href = '/api/auth/spotify'
    } catch (error) {
      addResult('Spotify Auth Route', false, { error: error.message })
    }
    setIsLoading(false)
  }

  const testSpotifyCallback = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/spotify-callback')
      const data = await response.text()
      addResult('Spotify Callback Route', true, { 
        status: response.status,
        content: data.substring(0, 200) + '...'
      })
    } catch (error) {
      addResult('Spotify Callback Route', false, { error: error.message })
    }
    setIsLoading(false)
  }

  const testDirectSpotify = () => {
    // Direct redirect to Spotify (bypass our auth route)
    const clientId = '3d8d032ed282470cac128ad3e41ccf6a' // Hardcoded for testing
    const redirectUri = 'https://earlytwentiesstorture.vercel.app/api/spotify-callback'
    const scopes = 'user-read-email user-read-private'
    
    const spotifyUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=debug_test`
    
    addResult('Direct Spotify URL', true, { url: spotifyUrl })
    window.location.href = spotifyUrl
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#282828', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: 'white'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>🔧 Spotify OAuth Debug</h1>
        
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2>Test Steps</h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            <button
              onClick={testEnvironmentVariables}
              disabled={isLoading}
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              1. Test Env Variables
            </button>
            
            <button
              onClick={testSpotifyAuthRoute}
              disabled={isLoading}
              style={{
                backgroundColor: '#e74c3c',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              2. Test Auth Route
            </button>
            
            <button
              onClick={testSpotifyCallback}
              disabled={isLoading}
              style={{
                backgroundColor: '#f39c12',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              3. Test Callback Route
            </button>
            
            <button
              onClick={testDirectSpotify}
              disabled={isLoading}
              style={{
                backgroundColor: '#1db954',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              4. Direct to Spotify
            </button>
            
            <button
              onClick={clearResults}
              style={{
                backgroundColor: '#95a5a6',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Clear Results
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            padding: '20px', 
            borderRadius: '8px'
          }}>
            <h2>Test Results</h2>
            {results.map((result, index) => (
              <div key={index} style={{ 
                marginBottom: '15px',
                padding: '15px',
                borderRadius: '5px',
                backgroundColor: result.success ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
                border: `1px solid ${result.success ? '#2ecc71' : '#e74c3c'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, color: result.success ? '#2ecc71' : '#e74c3c' }}>
                    {result.success ? '✅' : '❌'} {result.step}
                  </h3>
                  <span style={{ fontSize: '12px', opacity: 0.7 }}>{result.timestamp}</span>
                </div>
                <pre style={{ 
                  backgroundColor: '#2c2c2c', 
                  padding: '10px', 
                  borderRadius: '3px',
                  overflow: 'auto',
                  fontSize: '12px',
                  marginTop: '10px'
                }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
        
        <div style={{ marginTop: '20px' }}>
          <a href="/" style={{ color: '#1db954', textDecoration: 'none' }}>
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
