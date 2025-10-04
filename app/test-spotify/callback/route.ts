import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    console.log('Spotify callback received:', { 
      code: code ? 'Present' : 'Missing', 
      error,
      state,
      fullUrl: request.url
    })

    // Create a simple HTML response
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Spotify Authentication Result</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #1a1a1a; color: white; }
            .success { background: #1db954; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .error { background: #e74c3c; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .info { background: #3498db; padding: 20px; border-radius: 8px; margin: 20px 0; }
            pre { background: #2c2c2c; padding: 15px; border-radius: 5px; overflow-x: auto; }
        </style>
    </head>
    <body>
        <h1>🎵 Spotify Authentication Result</h1>
    `

    if (error) {
      html += `
        <div class="error">
            <h2>❌ Spotify OAuth Error</h2>
            <p><strong>Error:</strong> ${error}</p>
            <p><strong>State:</strong> ${state || 'Not provided'}</p>
            <p><strong>Full URL:</strong> <pre>${request.url}</pre></p>
        </div>
      `
    } else if (code) {
      html += `
        <div class="success">
            <h2>✅ SUCCESS! Authorization Code Received!</h2>
            <p><strong>Code:</strong> ${code.substring(0, 20)}...</p>
            <p><strong>State:</strong> ${state || 'Not provided'}</p>
            <p><strong>Full URL:</strong> <pre>${request.url}</pre></p>
            <p>🎉 The Spotify OAuth flow is working perfectly!</p>
            <p>✅ Your Spotify app is configured correctly</p>
            <p>✅ The redirect URI matches</p>
            <p>✅ Authorization code received</p>
        </div>
      `
    } else {
      html += `
        <div class="info">
            <h2>ℹ️ No Authorization Code</h2>
            <p>No code or error parameter found in the callback.</p>
            <p><strong>Full URL:</strong> <pre>${request.url}</pre></p>
        </div>
      `
    }

    html += `
        <div class="info">
            <h3>Debug Information</h3>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p><strong>User Agent:</strong> ${request.headers.get('user-agent') || 'Unknown'}</p>
            <p><strong>Referer:</strong> ${request.headers.get('referer') || 'Direct access'}</p>
        </div>
        
        <p><a href="/test-spotify" style="color: #1db954;">🔄 Test Again</a></p>
        <p><a href="/" style="color: #1db954;">← Back to Home</a></p>
    </body>
    </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Spotify callback error:', error)
    
    const errorHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Spotify Callback Error</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: #1a1a1a; color: white; }
            .error { background: #e74c3c; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <h1>Spotify Callback Error</h1>
        <div class="error">
            <h2>❌ Server Error</h2>
            <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
        <p><a href="/test-spotify" style="color: #1db954;">🔄 Try Again</a></p>
        <p><a href="/" style="color: #1db954;">← Back to Home</a></p>
    </body>
    </html>
    `
    
    return new NextResponse(errorHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
}
