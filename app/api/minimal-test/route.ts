export async function GET() {
  return new Response(JSON.stringify({ 
    message: "Minimal API route working",
    timestamp: new Date().toISOString()
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
