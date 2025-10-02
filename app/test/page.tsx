export default function Test() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#282828', color: 'white', minHeight: '100vh' }}>
      <h1>TEST PAGE WORKS</h1>
      <p>If you can see this, the site is working.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Spotify Test</h2>
        <button 
          onClick={() => {
            const clientId = '3d8d032ed282470cac128ad3e41ccf6a'
            const redirectUri = 'https://earlytwentiesstorture.vercel.app/api/spotify-callback'
            const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user-read-email&state=test`
            window.location.href = authUrl
          }}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: 'green', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Test Spotify Direct
        </button>
      </div>
    </div>
  )
}