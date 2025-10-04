'use client'

export default function TestSpotify() {
  const testSpotify = () => {
    console.log('Testing Spotify OAuth...')
    window.location.href = '/api/auth/spotify'
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#282828', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        padding: '40px', 
        borderRadius: '16px',
        textAlign: 'center',
        maxWidth: '500px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#f5f1e8', 
          marginBottom: '24px' 
        }}>
          🎵 Spotify OAuth Test
        </h1>
        
        <p style={{ 
          color: '#f5f1e8', 
          opacity: 0.8, 
          marginBottom: '32px',
          fontSize: '16px'
        }}>
          Click the button below to test the Spotify OAuth flow.
        </p>
        
        <button
          onClick={testSpotify}
          style={{
            backgroundColor: '#1db954',
            color: 'white',
            fontWeight: 'bold',
            padding: '16px 32px',
            borderRadius: '8px',
            fontSize: '18px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#1ed760'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#1db954'}
        >
          🎵 Test Spotify OAuth
        </button>
        
        <div style={{ 
          marginTop: '32px', 
          fontSize: '14px', 
          color: '#f5f1e8',
          opacity: 0.6 
        }}>
          <p><strong>Expected:</strong></p>
          <p>1. Click button → Go to Spotify</p>
          <p>2. Authorize → Come back here</p>
          <p>3. See result page</p>
        </div>
        
        <div style={{ marginTop: '24px' }}>
          <a href="/" style={{ color: '#1db954', textDecoration: 'none' }}>
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}