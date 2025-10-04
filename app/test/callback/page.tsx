export default function TestCallback() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#282828', color: 'white', minHeight: '100vh' }}>
      <h1>SPOTIFY CALLBACK</h1>
      <p>This page should show the Spotify callback result.</p>
      <p>Check the URL for code= or error= parameters.</p>
      
      <div style={{ marginTop: '20px' }}>
        <a href="/test" style={{ color: 'lightblue' }}>← Back to Test</a>
      </div>
    </div>
  )
}
