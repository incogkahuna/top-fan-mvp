'use client'

export default function TestSpotifySimple() {
  const testSpotify = () => {
    console.log('Testing Spotify OAuth...')
    window.location.href = '/api/auth/spotify'
  }

  return (
    <div className="min-h-screen bg-[#282828] flex items-center justify-center p-6">
      <div className="bg-transparent backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center max-w-md">
        <h1 className="text-3xl font-bold text-[#f5f1e8] mb-6">Spotify OAuth Test</h1>
        
        <p className="text-[#f5f1e8]/80 mb-8">
          Click the button below to test the Spotify OAuth flow. 
          This will take you to Spotify's authorization page.
        </p>
        
        <button
          onClick={testSpotify}
          className="bg-[#1db954] hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
        >
          🎵 Test Spotify OAuth
        </button>
        
        <div className="mt-8 text-sm text-[#f5f1e8]/60">
          <p><strong>Expected Flow:</strong></p>
          <ol className="text-left mt-2 space-y-1">
            <li>1. Click button → Redirect to Spotify</li>
            <li>2. Authorize app → Redirect back</li>
            <li>3. See success/error page</li>
          </ol>
        </div>
        
        <div className="mt-6">
          <a href="/" className="text-[#1db954] hover:underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
