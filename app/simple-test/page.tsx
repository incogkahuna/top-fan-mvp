'use client'

export default function SimpleTest() {
  const testDirectSpotify = () => {
    // Direct Spotify URL with NO server involvement
    const clientId = '3d8d032ed282470cac128ad3e41ccf6a'
    const redirectUri = 'https://earlytwentiesstorture.vercel.app/simple-test/callback'
    
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=user-read-email&` +
      `state=test`

    window.location.href = authUrl
  }

  return (
    <div className="min-h-screen bg-[#282828] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg p-8">
        <h1 className="text-2xl font-bold text-black mb-6">MINIMAL Spotify Test</h1>
        <p className="text-gray-600 mb-6">This bypasses ALL server code and goes directly to Spotify.</p>
        
        <button
          onClick={testDirectSpotify}
          className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          Test Direct Spotify (No Server)
        </button>
        
        <div className="mt-6 text-sm text-gray-600">
          <p>This should work if Spotify is configured correctly.</p>
          <p>If this fails, the problem is in Spotify settings.</p>
        </div>
      </div>
    </div>
  )
}
