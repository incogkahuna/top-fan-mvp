# 🚀 Vercel Deployment Setup Guide

## 🔧 Environment Variables for Vercel

Add these environment variables in your Vercel dashboard:

### **Supabase Configuration**
```
NEXT_PUBLIC_SUPABASE_URL=https://olqkjwpfexiajpxffcqq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

### **Next.js Configuration**
```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### **Spotify Configuration**
```
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=3d8d032ed282470cac128ad3e41ccf6a
SPOTIFY_CLIENT_SECRET=68dff20af10c4b129b1db3a12f0c4ef8
SPOTIFY_REDIRECT_URI=https://your-app-name.vercel.app/api/auth/spotify/callback
```

## 🎯 Spotify App Settings Update

1. **Go to:** [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. **Select your app:** "Early twenties torture"
3. **Go to:** Settings → Basic Information
4. **Add to Redirect URIs:**
   ```
   https://your-app-name.vercel.app/api/auth/spotify/callback
   ```
5. **Save changes**

## 🧪 Testing Steps

1. **Deploy to Vercel** with environment variables set
2. **Visit:** `https://your-app-name.vercel.app/leaderboard`
3. **Click:** "Connect Spotify" button
4. **Should redirect to:** Spotify OAuth page
5. **Complete OAuth flow**
6. **Should redirect back to:** Leaderboard with user connected

## 🐛 Debugging

If Spotify OAuth doesn't work on Vercel:

1. **Check Vercel logs** for environment variable errors
2. **Verify Spotify redirect URI** matches your Vercel domain
3. **Test with incognito browser** to avoid cache issues
4. **Use the "Logout Spotify" button** to clear session data

## 📝 Notes

- Replace `your-app-name` with your actual Vercel app name
- Make sure all environment variables are set in Vercel dashboard
- Spotify redirect URI must match exactly (including https://)
- Clear browser cache if testing locally after Vercel deployment
