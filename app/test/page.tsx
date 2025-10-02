export default function Test() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#282828', color: 'white', minHeight: '100vh' }}>
      <h1>✅ SITE IS WORKING</h1>
      <p>If you can see this, the site is working without any environment variables.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Spotify Test (No Environment Variables)</h2>
        <p style={{ color: '#ccc', fontSize: '14px' }}>This test bypasses all server-side code and goes directly to Spotify.</p>
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
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Test Spotify Direct (No Server Code)
        </button>
      </div>
      
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#333', borderRadius: '5px' }}>
        <h3>Status Check:</h3>
        <p>✅ Site loads without errors</p>
        <p>✅ No environment variable dependencies</p>
        <p>✅ Direct Spotify OAuth only</p>
      </div>
    </div>
  )
}