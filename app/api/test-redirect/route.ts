   import { NextRequest, NextResponse } from 'next/server'

   export async function GET(request: NextRequest) {
     console.log('🧪 TEST REDIRECT ROUTE CALLED!')
     console.log('Request URL:', request.url)
     
     // Simple redirect to Google to test if redirects work at all
     return NextResponse.redirect('https://www.google.com')
   }