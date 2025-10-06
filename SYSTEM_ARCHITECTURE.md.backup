# Top Fan MVP - System Architecture

## 🏗️ System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        TOP FAN MVP                              │
│                    Gamified Spotify Platform                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │    │   (API Routes)  │    │   (Supabase)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 User Journey Flow

```
┌─────────────────┐
│   Landing Page  │
│   (Home)        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐    ┌─────────────────┐
│  Connect        │───▶│  Spotify OAuth  │
│  Spotify        │    │  Authentication │
└─────────────────┘    └─────────┬───────┘
          │                       │
          ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │  Data Sync      │
│   (User Stats)  │    │  (Listening)   │
└─────────┬───────┘    └─────────┬───────┘
          │                       │
          ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Leaderboard   │    │   Notifications │
│  (Rankings)    │    │   (Achievements)│
└─────────┬───────┘    └─────────┬───────┘
          │                       │
          ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Prizes        │    │ Artist Dashboard│
│   (Rewards)     │    │ (Analytics)    │
└─────────────────┘    └─────────────────┘
```

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE DATABASE                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    users    │    │user_tokens  │    │listening_  │
│             │    │             │    │data        │
│ • id        │    │ • user_id   │    │ • user_id  │
│ • spotify_id│    │ • access_   │    │ • track_id │
│ • display_  │    │   token     │    │ • played_at│
│   name      │    │ • refresh_  │    │ • duration │
│ • email     │    │   token     │    │            │
│ • total_    │    │ • expires_  │    │            │
│   plays     │    │   at        │    │            │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  prizes     │    │notifications│    │achievements│
│             │    │             │    │            │
│ • title     │    │ • user_id   │    │ • name     │
│ • points_   │    │ • type      │    │ • criteria │
│   required  │    │ • message   │    │ • points   │
│ • category  │    │ • is_read   │    │            │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🔄 API Endpoints

```
┌─────────────────────────────────────────────────────────────────┐
│                        API ROUTES                              │
└─────────────────────────────────────────────────────────────────┘

Authentication:
├── GET  /api/auth/spotify          → Initiate OAuth
└── GET  /api/auth/spotify/callback → Handle OAuth callback

Data Management:
├── POST /api/data/sync             → Sync Spotify data
├── GET  /api/leaderboard           → Get rankings
├── GET  /api/notifications         → Get user notifications
├── POST /api/notifications         → Create notification
└── PATCH /api/notifications        → Update notification

Testing:
├── GET  /api/test/supabase         → Test database connection
├── GET  /api/test/spotify          → Test Spotify API
└── GET  /api/test/database         → Test schema
```

## 🎨 UI Components Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
└─────────────────────────────────────────────────────────────────┘

Pages:
├── /                    → Landing page with hero section
├── /dashboard           → User dashboard with stats
├── /leaderboard         → Rankings and competition
├── /prizes              → Rewards and challenges
├── /notifications       → Activity feed
├── /artist-dashboard    → Analytics for artists
└── /test               → System configuration test

Components:
├── Navigation.tsx       → Main navigation bar
├── SpotifyConnect.tsx   → OAuth connection button
├── StatsCard.tsx        → Reusable stats display
└── LoadingSpinner.tsx   → Loading states
```

## 🔐 Security & Authentication

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYER                              │
└─────────────────────────────────────────────────────────────────┘

Spotify OAuth Flow:
1. User clicks "Connect Spotify"
2. Redirect to Spotify authorization
3. User grants permissions
4. Spotify redirects with code
5. Exchange code for access token
6. Store token securely in database
7. Redirect to dashboard

Row Level Security (RLS):
├── Users can only access their own data
├── Public read access for leaderboards
├── Encrypted token storage
└── Secure API endpoints
```

## 📊 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA PIPELINE                           │
└─────────────────────────────────────────────────────────────────┘

Spotify API → Data Sync → Database → Analytics → UI

1. User connects Spotify account
2. Background job fetches listening history
3. Data processed and stored in Supabase
4. Real-time leaderboard calculations
5. Achievement triggers and notifications
6. Artist analytics and insights
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT STACK                            │
└─────────────────────────────────────────────────────────────────┘

Frontend:     Vercel (Next.js)
Database:     Supabase (PostgreSQL)
Auth:         Spotify OAuth
CDN:          Vercel Edge Network
Monitoring:   Vercel Analytics
CI/CD:        GitHub Actions
```

## 🎯 Key Features Implemented

```
┌─────────────────────────────────────────────────────────────────┐
│                        FEATURE MATRIX                          │
└─────────────────────────────────────────────────────────────────┘

✅ User Authentication (Spotify OAuth)
✅ Data Synchronization (Listening History)
✅ Leaderboard System (Rankings & Competition)
✅ Reward System (Points & Prizes)
✅ Notification System (Achievements & Updates)
✅ Artist Dashboard (Analytics & Insights)
✅ Responsive Design (Mobile & Desktop)
✅ Real-time Updates (Live Data)
✅ Security (RLS & Token Management)
✅ Testing (System Verification)
```

## 🔧 Development Tools

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT STACK                           │
└─────────────────────────────────────────────────────────────────┘

Frontend:     Next.js 14, React, TypeScript, Tailwind CSS
Backend:      Next.js API Routes, Supabase
Database:     PostgreSQL (via Supabase)
Auth:         Spotify Web API
UI/UX:        Framer Motion, Lucide Icons
Charts:       Recharts
Deployment:   Vercel
CI/CD:        GitHub Actions
```

This architecture provides a solid foundation for the Top Fan MVP with room for scaling and additional features!
