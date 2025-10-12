// Simple password-based admin authentication
import { NextRequest } from 'next/server'

const ADMIN_PASSWORD = 'Gaviotagoeshard!!'

export function verifyAdminPassword(request: NextRequest) {
  try {
    // Get password from Authorization header or form data
    const authHeader = request.headers.get('authorization')
    const contentType = request.headers.get('content-type')
    
    let providedPassword: string | null = null
    
    // Check Authorization header (for API routes)
    if (authHeader && authHeader.startsWith('Bearer ')) {
      providedPassword = authHeader.substring(7) // Remove "Bearer " prefix
    }
    
    // Check form data (for login form)
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      // This will be handled in the login endpoint
      return { authorized: false, error: 'Use login endpoint for form data' }
    }
    
    if (!providedPassword) {
      return { authorized: false, error: 'Admin password required' }
    }
    
    if (providedPassword === ADMIN_PASSWORD) {
      return { authorized: true }
    }
    
    return { authorized: false, error: 'Invalid admin password' }
  } catch (error) {
    return { authorized: false, error: 'Authentication failed' }
  }
}

export function verifyAdminSession(request: NextRequest) {
  // Check if admin session cookie exists
  const adminSession = request.cookies.get('admin-session')?.value
  
  if (!adminSession) {
    return { authorized: false, error: 'Admin session required' }
  }
  
  // Verify session token (simple timestamp-based validation)
  try {
    const sessionData = JSON.parse(Buffer.from(adminSession, 'base64').toString())
    const now = Date.now()
    const sessionAge = now - sessionData.timestamp
    
    // Session expires after 24 hours
    if (sessionAge > 24 * 60 * 60 * 1000) {
      return { authorized: false, error: 'Admin session expired' }
    }
    
    return { authorized: true, sessionData }
  } catch (error) {
    return { authorized: false, error: 'Invalid admin session' }
  }
}

export function createAdminSession() {
  // Create a simple session token
  const sessionData = {
    timestamp: Date.now(),
    admin: true
  }
  
  return Buffer.from(JSON.stringify(sessionData)).toString('base64')
}
