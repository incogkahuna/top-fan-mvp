import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    return NextResponse.json({
      message: "Test Spotify callback route working",
      received_params: {
        has_code: !!code,
        state: state,
        error: error
      },
      timestamp: new Date().toISOString(),
      url: request.url
    })
  } catch (error) {
    return NextResponse.json({
      error: "Test callback failed",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
