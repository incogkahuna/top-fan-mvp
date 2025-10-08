'use client'

// Force deployment - Updated
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal, Crown, Star, TrendingUp, Users, Music, Play, Info, LogIn, X, Clock, Calendar, Headphones, Award, Settings } from 'lucide-react'
import ProfilePhotoUpload from '@/components/ProfilePhotoUpload'
import { useSpotifyAuth } from '@/lib/useSpotifyAuth'

interface LeaderboardEntry {
  rank: number
  userId: string
  displayName: string
  profileImageUrl: string | null
  totalPlays: number
  points: number
  topSongs: Array<{name: string, plays: number}>
  totalListeningTime: number
  uniqueSongs: number
  avgSessionLength: number
}

function LeaderboardContent() {
  const [timeFilter, setTimeFilter] = useState('month')
  const [artistFilter, setArtistFilter] = useState('all')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showProfileSettings, setShowProfileSettings] = useState(false)
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null)
  // Use the fixed useSpotifyAuth hook
  const { user, isLoading: authLoading, isConnected } = useSpotifyAuth()
  
  // Debug logging removed for clean deployment

  // Fetch real leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/leaderboard')
        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
        } else {
          setLeaderboard(data.leaderboard || [])
        }
      } catch (err) {
        setError('Failed to load leaderboard')
        console.error('Leaderboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [timeFilter, artistFilter])

  // Handle Spotify OAuth callback URL parameters - RUN IMMEDIATELY
  useEffect(() => {
    // Check URL parameters IMMEDIATELY on mount
    const handleSpotifyCallback = () => {
      // Get the full URL to debug
      const fullUrl = window.location.href
      console.log('🔍 Full URL on mount:', fullUrl)
      
      const urlParams = new URLSearchParams(window.location.search)
      const spotifyConnected = urlParams.get('spotify_connected')
      const spotifyUserId = urlParams.get('spotify_user_id')
      
      console.log('🔍 URL params check:', { spotifyConnected, spotifyUserId })
      console.log('🔍 URL search string:', window.location.search)
      
      if (spotifyConnected === 'true' && spotifyUserId) {
        console.log('🎯 Setting localStorage spotify_user_id:', spotifyUserId)
        localStorage.setItem('spotify_user_id', spotifyUserId)
        
        // Set a flag to prevent infinite reloads
        sessionStorage.setItem('spotify_auth_processed', 'true')
        
        // Clean up URL to remove parameters
        window.history.replaceState({}, document.title, window.location.pathname)
        
        // Reload to trigger auth check
        console.log('🔄 Reloading page to trigger auth check...')
        window.location.reload()
      }
    }

    // Also check what's currently in localStorage
    const currentUserId = localStorage.getItem('spotify_user_id')
    console.log('🔍 Current localStorage spotify_user_id:', currentUserId)
    
    // Check if we already processed auth in this session
    const authProcessed = sessionStorage.getItem('spotify_auth_processed')
    console.log('🔍 Auth already processed this session:', authProcessed)

    handleSpotifyCallback()
  }, [])

  // Calculate your stats
  const yourStats = {
    rank: (() => {
      const foundIndex = leaderboard.findIndex(entry => entry.displayName === 'Daniel Horgan')
      return foundIndex !== -1 ? foundIndex + 1 : leaderboard.length + 1
    })(),
    totalPlays: leaderboard.find(entry => entry.displayName === 'Daniel Horgan')?.totalPlays || 0,
    totalPlayers: leaderboard.length
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <span className="text-lg font-bold text-pink-300">1</span>
    if (rank === 2) return <span className="text-lg font-bold text-pink-200">2</span>
    if (rank === 3) return <span className="text-lg font-bold text-pink-100">3</span>
    return <span className="text-lg font-bold text-gray-400">{rank}</span>
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-pink-300 to-pink-500'
    if (rank === 2) return 'from-pink-200 to-pink-400'
    if (rank === 3) return 'from-pink-100 to-pink-300'
    return 'from-gray-600 to-gray-800'
  }

  const handleProfileClick = (userProfile: LeaderboardEntry) => {
    setSelectedUser(userProfile)
    setShowProfileModal(true)
  }

  const closeProfileModal = () => {
    setShowProfileModal(false)
    setSelectedUser(null)
  }

  // Add debugging
  // Debug logging removed for clean deployment

  if (error) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#f5f1e8] mb-4">Error Loading Leaderboard</h2>
          <p className="text-[#f5f1e8]/60 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E98B8B] mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-[#f5f1e8]">Loading Leaderboard...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
            </div>
          </div>


          {/* User Status Section */}
          {user && (
            <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {userProfileImage ? (
                    <img 
                      src={userProfileImage} 
                      alt={'User'}
                      className="w-10 h-10 rounded-full border-2 border-pink-300"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">U</span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f1e8]">Welcome back, User!</h3>
                    <p className="text-[#f5f1e8]/60 text-sm">Your Sadie Jean listening is being tracked</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-[#f5f1e8] font-bold text-lg">
                      N/A
                    </p>
                    <p className="text-[#f5f1e8]/60 text-sm">Current Rank</p>
                  </div>
                  <button
                    onClick={() => setShowProfileSettings(!showProfileSettings)}
                    className="p-2 hover:bg-white hover:text-black rounded-full transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Settings */}
          {user && showProfileSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-transparent backdrop-blur-sm rounded-xl p-6 mb-6"
            >
              <h3 className="text-xl font-bold text-[#f5f1e8] mb-4">Profile Settings</h3>
              <div className="flex items-center space-x-6">
                <ProfilePhotoUpload
                  currentImageUrl={userProfileImage}
                  onImageChange={setUserProfileImage}
                  userId={''}
                />
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Customize Your Profile</h4>
                  <p className="text-[#f5f1e8]/60 text-sm mb-4">
                    Upload a profile photo to personalize your leaderboard appearance. 
                    Your photo will be visible to other fans on the leaderboard.
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-[#f5f1e8]/60">
                    <span>- Max file size: 5MB</span>
                    <span>- Supported formats: JPG, PNG, GIF</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tutorial Section */}
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-transparent backdrop-blur-sm rounded-xl p-6 mb-6"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#f5f1e8] mb-4">How the Sadie Jean Leaderboard Works</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#E98B8B] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#f5f1e8] mb-1">1. Connect Spotify</h4>
                      <p className="text-[#f5f1e8]/60 text-sm">Connect your account to start tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#E98B8B] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#f5f1e8] mb-1">2. Listen to Sadie Jean</h4>
                      <p className="text-[#f5f1e8]/60 text-sm">Play Sadie Jean songs - only her tracks count toward your score</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#E98B8B] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#f5f1e8] mb-1">3. Climb the Ranks</h4>
                      <p className="text-[#f5f1e8]/60 text-sm">Compete with other Sadie Jean fans and see your position update in real-time</p>
                    </div>
                  </div>
                </div>
                
                {/* Points System Explanation */}
                <div className="bg-transparent backdrop-blur-sm rounded-lg p-4 border border-[#f5f1e8]/5">
                  <h4 className="font-semibold text-[#f5f1e8] mb-3">
                    Point System
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#f5f1e8]/80">Base play:</span>
                        <span className="text-[#E98B8B] font-medium">1 pt</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#f5f1e8]/80">Full song:</span>
                        <span className="text-[#E98B8B] font-medium">+1 pt</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#f5f1e8]/80">Repeat play:</span>
                        <span className="text-[#E98B8B] font-medium">+2 pts</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#f5f1e8]/80">30+ min session:</span>
                        <span className="text-[#E98B8B] font-medium">+5 pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#f5f1e8]/80">Weekend bonus:</span>
                        <span className="text-[#E98B8B] font-medium">+1 pt/10min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#f5f1e8]/80">Peak hours (7-9 PM):</span>
                        <span className="text-[#E98B8B] font-medium">+1 pt/5min</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-transparent backdrop-blur-sm rounded-lg border border-[#f5f1e8]/5">
                  <p className="text-[#f5f1e8]/80 text-sm">
                    <strong>Your current rank:</strong> N/A with 0 total plays
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="flex gap-1">
            {['week', 'month', 'all'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-full transition-colors capitalize text-sm ${
                  timeFilter === filter
                    ? 'bg-[#E98B8B] text-white'
                    : 'text-[#f5f1e8]/60 hover:text-[#f5f1e8] hover:bg-[#f5f1e8]/5'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button className="px-4 py-2 rounded-full transition-colors bg-transparent text-[#f5f1e8]/60 hover:text-[#f5f1e8] hover:bg-[#f5f1e8]/5 text-sm">
            Sadie Jean Only
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:bg-[#f5f1e8]/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#f5f1e8]/70 text-sm font-medium uppercase tracking-wider">Total Fans</p>
                <p className="text-4xl font-bold text-[#f5f1e8]">
                  {loading ? '...' : leaderboard.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:bg-[#f5f1e8]/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#f5f1e8]/70 text-sm font-medium uppercase tracking-wider">Top Player</p>
                <p className="text-4xl font-bold text-[#f5f1e8]">
                  {loading ? '...' : leaderboard[0]?.totalPlays || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-transparent backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:bg-[#f5f1e8]/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#f5f1e8]/70 text-sm font-medium uppercase tracking-wider">Total Points</p>
                <p className="text-4xl font-bold text-[#f5f1e8]">
                  {loading ? '...' : leaderboard.reduce((sum, entry) => sum + entry.points, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Join the Leaderboard Section */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-transparent backdrop-blur-sm rounded-2xl p-8 mb-12 border border-[#f5f1e8]/10"
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-[#E98B8B] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">♪</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-[#f5f1e8] mb-2">Join the Leaderboard</h2>
              <p className="text-[#f5f1e8]/60">Connect your account to compete with other Sadie Jean fans</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  console.log('🎯 Connect Spotify button clicked!')
                  console.log('🎯 Current user state:', user)
                  console.log('🎯 Redirecting to: /api/auth/spotify')
                  window.location.href = '/api/auth/spotify'
                }}
                className="btn-primary inline-flex items-center space-x-3 text-lg px-8 py-4 rounded-full font-medium transition-all duration-200"
              >
                <span className="text-lg">♪</span>
                <span>Connect Spotify</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-[#f5f1e8]/40 text-sm">
                Only your Sadie Jean listening will be tracked
              </p>
            </div>
          </motion.div>
        )}

        {/* DEBUG SECTION - Remove this after testing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-red-400/30"
        >
          <h3 className="text-xl font-semibold text-red-400 mb-4">🐛 DEBUG INFO</h3>
          <div className="space-y-2 text-sm">
            <p>User state: {JSON.stringify(user)}</p>
            <p>Auth loading: {authLoading.toString()}</p>
            <p>Is connected: {isConnected.toString()}</p>
            <p>LocalStorage spotify_user_id: {typeof window !== 'undefined' ? localStorage.getItem('spotify_user_id') : 'undefined'}</p>
            <button 
              onClick={() => {
                const userId = localStorage.getItem('spotify_user_id')
                console.log('🔍 Manual check for user:', userId)
                if (userId) {
                  fetch(`/api/auth/me?userId=${userId}`)
                    .then(r => r.json())
                    .then(data => console.log('🔍 Manual API response:', data))
                    .catch(err => console.error('🔍 Manual API error:', err))
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
            >
              Test API Call
            </button>
            <button 
              onClick={() => {
                // Use the known Spotify user ID from the database
                const knownUserId = '31slexnyzlffio42t3gyxhy53tzy' // Daniel Horgan's Spotify ID from terminal logs
                console.log('🎯 Setting known user ID:', knownUserId)
                localStorage.setItem('spotify_user_id', knownUserId)
                sessionStorage.removeItem('spotify_auth_processed')
                window.location.reload()
              }}
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
            >
              Set Known User ID
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('spotify_user_id')
                window.location.reload()
              }}
              className="bg-red-600 text-white px-4 py-2 rounded mr-2"
            >
              Clear localStorage
            </button>
            <button 
              onClick={() => {
                console.log('🎯 Testing direct redirect to Spotify OAuth')
                window.location.href = '/api/auth/spotify'
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded mr-2"
            >
              Test Spotify Redirect
            </button>
            <button 
              onClick={() => {
                console.log('🚪 Logging out of Spotify')
                localStorage.removeItem('spotify_user_id')
                sessionStorage.clear()
                window.location.reload()
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded"
            >
              Logout Spotify
            </button>
          </div>
        </motion.div>

        {/* User Connected Section - Show when user is logged in */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-transparent backdrop-blur-sm rounded-2xl p-8 mb-12 border border-green-400/30"
          >
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">✓</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-[#f5f1e8] mb-2">Connected as {user.display_name}</h2>
              <p className="text-[#f5f1e8]/60">Your Sadie Jean listening is being tracked</p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  localStorage.removeItem('spotify_user_id')
                  window.location.reload()
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200"
              >
                Disconnect Spotify
              </button>
              <button
                onClick={() => window.location.href = '/api/auth/spotify'}
                className="bg-[#1DB954] hover:bg-[#1ed760] text-white px-6 py-3 rounded-full font-medium transition-all duration-200"
              >
                Reconnect Spotify
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-[#f5f1e8]/40 text-sm">
                Only your Sadie Jean listening will be tracked
              </p>
            </div>
          </motion.div>
        )}

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-transparent backdrop-blur-sm rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#f5f1e8]">Top Sadie Jean Fans</h2>
            {!user && (
              <div className="text-sm text-[#f5f1e8]/60">
                Connect account to see your rank
              </div>
            )}
          </div>
          
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-400">Loading leaderboard...</div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-8">
              <div className="text-red-400">Error: {error}</div>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
          <div className="w-20 h-20 bg-[#E98B8B]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-[#E98B8B] font-bold">F</span>
          </div>
                  <h3 className="text-xl font-bold text-[#f5f1e8] mb-2">Be the First Fan!</h3>
                  <p className="text-[#f5f1e8]/60 mb-6">Connect your account to start tracking and become the top fan</p>
                  {!user && (
                    <button
                      onClick={() => window.location.href = '/api/auth/spotify'}
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <span>Connect Spotify</span>
                    </button>
                  )}
                </div>
              ) : (
                leaderboard.map((user, index) => (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, x: -30, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ 
                      delay: index * 0.15, 
                      duration: 0.6, 
                      ease: "easeOut",
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                    onClick={() => handleProfileClick(user)}
                    className={`group flex items-center justify-between p-4 rounded-xl bg-transparent backdrop-blur-sm ${
                      user.rank <= 3 
                        ? 'border-l-4 border-l-[#E98B8B]' 
                        : ''
                    } transition-all duration-300 cursor-pointer hover:bg-[#f5f1e8]/5`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-16 h-16">
                        {getRankIcon(user.rank)}
                      </div>
                      
                      <div className="relative">
                        {user.profileImageUrl ? (
                          <img 
                            src={user.profileImageUrl} 
                            alt={user.displayName}
                            className="w-14 h-14 rounded-full border-3 border-[#E98B8B]/40 shadow-lg"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-[#E98B8B] to-[#E98B8B]/80 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">U</span>
                          </div>
                        )}
                        {user.rank <= 3 && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-[#E98B8B] rounded-full flex items-center justify-center"
                          >
                            <span className="text-xs font-bold text-white">{user.rank}</span>
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#f5f1e8] mb-1">
                          {user.displayName}
                        </h3>
                        <div className="flex items-center space-x-4 mb-2">
                          <p className="text-sm text-[#f5f1e8]/80 font-medium">
                            {user.totalPlays.toLocaleString()} Sadie Jean plays
                          </p>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-bold text-[#E98B8B]">
                              {user.points.toLocaleString()} pts
                            </span>
                          </div>
                        </div>
                        
                        {/* Top Sadie Jean Songs */}
                        {user.topSongs.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs text-[#f5f1e8]/60 mb-1">Top Sadie Jean Songs:</p>
                            <div className="flex flex-wrap gap-1">
                              {user.topSongs.slice(0, 2).map((song, idx) => (
                                <span key={idx} className="text-xs bg-[#E98B8B]/20 text-[#f5f1e8]/80 px-2 py-1 rounded-full">
                                  {song.name} ({song.plays})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Additional Stats */}
                        <div className="flex items-center space-x-3 text-xs text-[#f5f1e8]/60">
                          <span>{user.totalListeningTime}m Sadie Jean listening</span>
                          <span>{user.uniqueSongs} unique Sadie Jean songs</span>
                        </div>
                        
                        {user.rank <= 3 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center space-x-1 mt-2"
                          >
                            <div className="w-2 h-2 bg-[#E98B8B] rounded-full animate-pulse"></div>
                            <span className="text-xs text-[#f5f1e8]/70 font-medium">
                              {user.rank === 1 ? 'Champion' : user.rank === 2 ? 'Runner-up' : 'Top 3'}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {user.rank <= 3 && (
                        <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
                          <span className="text-sm text-white">
                            {user.rank === 1 ? 'Crown' : user.rank === 2 ? 'Medal' : 'Trophy'}
                          </span>
                        </div>
                      )}
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{user.rank}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>

        {/* Your Position */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-transparent backdrop-blur-sm rounded-2xl p-6 mt-8"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Your Position</h3>
            <div className="flex items-center justify-between p-4 bg-transparent backdrop-blur-sm rounded-lg border border-green-400/30">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12">
                  <span className="text-lg font-bold text-green-400">{yourStats.rank}</span>
                </div>
                <div className="text-2xl">U</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Daniel Horgan</h3>
                  <p className="text-sm text-gray-300">{yourStats.totalPlays.toLocaleString()} plays</p>
                </div>
              </div>
              <div className="text-right">
                {yourStats.totalPlays === 0 ? (
                  <>
                    <p className="text-green-400 font-semibold">Connect account to start!</p>
                    <p className="text-sm text-gray-300">Sync your listening data</p>
                  </>
                ) : (
                  <>
                    <p className="text-green-400 font-semibold">Keep listening to climb!</p>
                    <p className="text-sm text-gray-300">You're doing great!</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom Call-to-Action for Non-Authenticated Users */}
        {!user && leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            className="bg-transparent backdrop-blur-sm rounded-xl p-6 mt-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.6, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-4xl text-[#E98B8B] font-bold">F</span>
            </motion.div>
        </motion.div>
            
            
        </motion.div>
      )}

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeProfileModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-transparent backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E98B8B]/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {selectedUser.profileImageUrl ? (
                    <img 
                      src={selectedUser.profileImageUrl} 
                      alt={selectedUser.displayName}
                      className="w-16 h-16 rounded-full border-2 border-[#E98B8B]/40"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-[#E98B8B] to-[#E98B8B]/80 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">U</span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-[#f5f1e8]">{selectedUser.displayName}</h2>
                    <div className="flex items-center space-x-2">
                      {getRankIcon(selectedUser.rank)}
                      <span className="text-[#f5f1e8]/60">Rank {selectedUser.rank}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeProfileModal}
                  className="p-2 hover:bg-[#f5f1e8]/10 rounded-full transition-colors text-[#f5f1e8]/60 font-bold text-xl"
                >
                  X
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-transparent backdrop-blur-sm border border-[#f5f1e8]/10 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-[#E98B8B] font-bold text-lg">S</span>
                  </div>
                  <p className="text-2xl font-bold text-[#f5f1e8]">{selectedUser.totalPlays}</p>
                  <p className="text-xs text-[#f5f1e8]/60">Sadie Jean Plays</p>
                </div>
                
                <div className="bg-transparent backdrop-blur-sm border border-[#f5f1e8]/10 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-[#E98B8B] font-bold text-lg">*</span>
                  </div>
                  <p className="text-2xl font-bold text-[#f5f1e8]">{selectedUser.points.toLocaleString()}</p>
                  <p className="text-xs text-[#f5f1e8]/60">Total Points</p>
                </div>
                
                <div className="bg-transparent backdrop-blur-sm border border-[#f5f1e8]/10 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-[#E98B8B] font-bold text-lg">T</span>
                  </div>
                  <p className="text-2xl font-bold text-[#f5f1e8]">{selectedUser.totalListeningTime}m</p>
                  <p className="text-xs text-[#f5f1e8]/60">Listening Time</p>
                </div>
                
                <div className="bg-transparent backdrop-blur-sm border border-[#f5f1e8]/10 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-[#E98B8B] font-bold text-lg">S</span>
                  </div>
                  <p className="text-2xl font-bold text-[#f5f1e8]">{selectedUser.uniqueSongs}</p>
                  <p className="text-xs text-[#f5f1e8]/60">Unique Songs</p>
                </div>
              </div>

              {/* Top Songs */}
              {selectedUser.topSongs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#f5f1e8] mb-4">
                    Top Sadie Jean Songs
                  </h3>
                  <div className="space-y-2">
                    {selectedUser.topSongs.map((song, index) => (
                      <div key={index} className="flex items-center justify-between bg-transparent backdrop-blur-sm border border-[#f5f1e8]/10 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-[#E98B8B]/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-[#E98B8B]">{index + 1}</span>
                          </div>
                          <span className="text-[#f5f1e8] font-medium">{song.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[#f5f1e8]/60 font-medium">{song.plays} plays</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Session Stats */}
              <div className="bg-transparent backdrop-blur-sm border border-[#f5f1e8]/10 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-[#f5f1e8] mb-3">
                  Listening Habits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#f5f1e8]/80">Average Session:</span>
                    <span className="text-[#E98B8B] font-medium">{selectedUser.avgSessionLength} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#f5f1e8]/80">Total Listening:</span>
                    <span className="text-[#E98B8B] font-medium">{selectedUser.totalListeningTime} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#f5f1e8]/80">Points per Play:</span>
                    <span className="text-[#E98B8B] font-medium">
                      {selectedUser.totalPlays > 0 ? (selectedUser.points / selectedUser.totalPlays).toFixed(1) : '0.0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#f5f1e8]/80">Discovery Rate:</span>
                    <span className="text-[#E98B8B] font-medium">
                      {selectedUser.totalPlays > 0 ? ((selectedUser.uniqueSongs / selectedUser.totalPlays) * 100).toFixed(1) : '0.0'}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
)
}

export default function Leaderboard() {
  return <LeaderboardContent />
}
