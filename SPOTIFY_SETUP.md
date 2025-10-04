# 🎵 Spotify Authentication Setup Guide

## Critical Issues Fixed

### 1. ✅ Environment Variables
All routes now use environment variables instead of hardcoded URLs.

### 2. ✅ Better Error Handling
Detailed error logging and user-friendly error messages.

### 3. ✅ Unified Callback Routes
Proper separation between test and production callbacks.

### 4. ✅ Fixed Typo
Corrected `SPIFY_CLIENT_SECRET` → `SPOTIFY_CLIENT_SECRET`

## Required Environment Variables

Create a `.env.local` file with:

```bash
# Spotify API Configuration
SPOTIFY_CLIENT_ID=3d8d032ed282470cac128ad3e41ccf6a
SPOTIFY_CLIENT_SECRET=68dff20af10c4b129b1db3a12f0c4ef8
SPOTIFY_REDIRECT_URI=https://earlytwentiesstorture.vercel.app/api/auth/spotify/callback

# For local development, also add:
# SPOTIFY_REDIRECT_URI=http://localhost:3002/api/auth/spotify/callback

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next.js Configuration
NEXTAUTH_URL=https://earlytwentiesstorture.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
```

## Spotify App Dashboard Configuration

### Required Redirect URIs:
1. `https://earlytwentiesstorture.vercel.app/api/auth/spotify/callback`
2. `http://localhost:3002/api/auth/spotify/callback` (for local dev)

### Steps:
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Select your app
3. Click "Edit Settings"
4. Add both redirect URIs to the "Redirect URIs" field
5. Save changes

## Testing the Authentication

### Local Testing:
1. Set `SPOTIFY_REDIRECT_URI=http://localhost:3002/api/auth/spotify/callback`
2. Visit `http://localhost:3002/test`
3. Click "Test Spotify Auth"
4. Check `http://localhost:3002/test/callback` for results

### Production Testing:
1. Set `SPOTIFY_REDIRECT_URI=https://earlytwentiesstorture.vercel.app/api/auth/spotify/callback`
2. Visit `https://earlytwentiesstorture.vercel.app/test`
3. Click "Test Spotify Auth"
4. Check `https://earlytwentiesstorture.vercel.app/test/callback` for results

## Common Error Messages

- `spotify_access_denied`: User denied permission
- `no_code`: No authorization code received
- `token_exchange_failed`: Invalid credentials or redirect URI mismatch
- `missing_credentials`: Environment variables not set
- `database_error`: Supabase connection issue

## Debug Endpoints

- `/api/debug/spotify-config` - Check environment variables
- `/api/debug/spotify-url` - Generate auth URL
- `/test/callback` - View callback results with detailed errors

## Next Steps

1. Update your Spotify app dashboard with the correct redirect URIs
2. Set up environment variables in Vercel
3. Test the authentication flow
4. Monitor the debug endpoints for any remaining issues
