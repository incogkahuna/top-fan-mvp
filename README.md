# Top Fan MVP

A web app that gamifies Spotify listening data for fans and provides data insights dashboard for artists.

## Features

- 🎵 **Spotify Integration**: Connect your Spotify account and track listening habits
- 🏆 **Leaderboards**: Compete with other fans and climb the rankings
- 🎁 **Rewards System**: Earn points and unlock exclusive prizes
- 📊 **Artist Dashboard**: Comprehensive analytics for artists about their fanbase
- 🔔 **Notifications**: Stay updated with achievements and milestones
- 📱 **Responsive Design**: Beautiful UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Spotify OAuth
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Spotify Developer Account
- Supabase Account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd top-fan-mvp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Set redirect URI to: `http://localhost:3000/api/auth/spotify/callback`
4. Copy your Client ID and Client Secret

### 4. Set up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to Settings > API to get your URL and anon key
3. Go to Settings > Database to get your service role key
4. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/spotify/callback

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── data/          # Data sync endpoints
│   │   ├── leaderboard/   # Leaderboard API
│   │   └── notifications/ # Notifications API
│   ├── dashboard/         # User dashboard
│   ├── leaderboard/       # Leaderboard page
│   ├── prizes/           # Prizes page
│   ├── notifications/    # Notifications page
│   └── artist-dashboard/ # Artist insights dashboard
├── components/           # Reusable components
├── lib/                 # Utility libraries
│   ├── supabase.ts      # Supabase client
│   └── spotify.ts       # Spotify API helpers
├── styles/              # Global styles
└── supabase-schema.sql  # Database schema
```

## API Endpoints

### Authentication
- `GET /api/auth/spotify` - Initiate Spotify OAuth
- `GET /api/auth/spotify/callback` - Handle OAuth callback

### Data
- `POST /api/data/sync` - Sync user's Spotify data
- `GET /api/leaderboard` - Get leaderboard data
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification
- `PATCH /api/notifications` - Update notification

## Database Schema

The app uses the following main tables:

- **users**: User profiles and basic info
- **user_tokens**: Spotify access tokens
- **listening_data**: Tracked listening history
- **prizes**: Available rewards
- **user_prizes**: Earned prizes
- **notifications**: User notifications
- **achievements**: Available achievements
- **user_achievements**: Earned achievements

## Features in Detail

### User Dashboard
- Personal listening statistics
- Achievement tracking
- Recent activity feed
- Progress towards goals

### Leaderboard
- Real-time rankings
- Time-based filtering (week/month/all)
- Artist-specific leaderboards
- User position tracking

### Prizes System
- Point-based rewards
- Category filtering
- Progress tracking
- Exclusive merchandise and experiences

### Artist Dashboard
- Fan demographics
- Geographic distribution
- Top tracks and artists
- Engagement metrics
- Data export capabilities

### Notifications
- Achievement unlocks
- Ranking updates
- New prize availability
- Social interactions

## Development Roadmap

- [x] Project setup and scaffolding
- [x] UI components with mock data
- [x] Spotify OAuth integration
- [x] Database schema and API endpoints
- [ ] Real Spotify data integration
- [ ] Leaderboard calculations
- [ ] Achievement system
- [ ] Notification system
- [ ] Artist dashboard analytics
- [ ] Testing and optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@topfan.app or create an issue in the repository.
