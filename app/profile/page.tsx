'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Music, 
  Award, 
  Settings, 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Trophy,
  Clock,
  Headphones,
  Star,
  ChevronRight,
  CheckCircle
} from 'lucide-react'
import { useSpotifyAuth } from '@/lib/useSpotifyAuth'
import { useRouter } from 'next/navigation'

interface ProfileData {
  custom_handle?: string
  bio?: string
  custom_avatar_url?: string
  privacy_settings?: any
}

interface SadieJeanStats {
  totalPlays: number
  totalListeningTime: number
  topTracks: Array<{ name: string; plays: number; duration_ms: number }>
  recentPlays: Array<{ track_name: string; played_at: string; duration_ms: number }>
}

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useSpotifyAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState<ProfileData>({})
  const [sadieJeanStats, setSadieJeanStats] = useState<SadieJeanStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [tempProfile, setTempProfile] = useState<ProfileData>({})
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    console.log('🔍 Profile page - authLoading:', authLoading, 'user:', user)
    if (!authLoading && !user) {
      console.log('❌ No user, redirecting to /user')
      router.push('/user')
    }
  }, [user, authLoading, router])

  // Load user profile data
  useEffect(() => {
    if (user) {
      loadProfileData()
      loadSadieJeanStats()
    }
  }, [user])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/profile?userId=${user?.spotify_id}`)
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
        setTempProfile(data)
      }
    } catch (error) {
      console.error('Failed to load profile data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSadieJeanStats = async () => {
    try {
      const response = await fetch(`/api/spotify/sadiejean?userId=${user?.spotify_id}`)
      if (response.ok) {
        const data = await response.json()
        setSadieJeanStats(data.data)
      }
    } catch (error) {
      console.error('Failed to load Sadie Jean stats:', error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.spotify_id,
          ...tempProfile
        })
      })

      if (response.ok) {
        setProfileData(tempProfile)
        setEditing(false)
        setError(null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to save profile')
      }
    } catch (error) {
      setError('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setTempProfile(profileData)
    setEditing(false)
    setError(null)
  }

  const formatListeningTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-[#f5f1e8]">Loading your profile...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'stats', label: 'Music Stats', icon: Music },
    { id: 'rewards', label: 'Rewards', icon: Award },
    { id: 'account', label: 'Account', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-[#f5f1e8]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#282828] rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {user.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt={user.display_name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#E98B8B]"
                  />
                ) : (
                  <div className="w-24 h-24 bg-[#1DB954] rounded-full flex items-center justify-center border-4 border-[#E98B8B]">
                    <Music className="h-12 w-12 text-white" />
                  </div>
                )}
                {editing && (
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#E98B8B] rounded-full flex items-center justify-center hover:bg-[#f0a0a0] transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-[#f5f1e8] mb-1">
                  {user.display_name}
                </h1>
                <p className="text-[#f5f1e8]/60 text-lg">
                  @{profileData.custom_handle || user.display_name.toLowerCase().replace(/\s+/g, '')}
                </p>
                {profileData.bio && (
                  <p className="text-[#f5f1e8]/80 mt-2">{profileData.bio}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {editing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-[#E98B8B] text-white px-4 py-2 rounded-full hover:bg-[#f0a0a0] transition-colors disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 bg-[#E98B8B] text-white px-4 py-2 rounded-full hover:bg-[#f0a0a0] transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-[#f5f1e8]/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E98B8B]">
                {sadieJeanStats?.totalPlays || 0}
              </div>
              <div className="text-sm text-[#f5f1e8]/60">Sadie Jean Plays</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E98B8B]">
                {sadieJeanStats ? formatListeningTime(sadieJeanStats.totalListeningTime) : '0h 0m'}
              </div>
              <div className="text-sm text-[#f5f1e8]/60">Listening Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E98B8B]">
                #{1}
              </div>
              <div className="text-sm text-[#f5f1e8]/60">Current Rank</div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-[#282828] p-1 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#E98B8B] text-white'
                    : 'text-[#f5f1e8]/60 hover:text-[#f5f1e8] hover:bg-[#f5f1e8]/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#282828] rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Profile Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#f5f1e8] mb-2">
                    Custom Handle
                  </label>
                  <input
                    type="text"
                    value={editing ? tempProfile.custom_handle || '' : profileData.custom_handle || ''}
                    onChange={(e) => editing && setTempProfile({ ...tempProfile, custom_handle: e.target.value })}
                    disabled={!editing}
                    placeholder="Enter a custom username"
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#f5f1e8]/20 rounded-lg text-[#f5f1e8] focus:border-[#E98B8B] focus:outline-none disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#f5f1e8] mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editing ? tempProfile.bio || '' : profileData.bio || ''}
                    onChange={(e) => editing && setTempProfile({ ...tempProfile, bio: e.target.value })}
                    disabled={!editing}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#f5f1e8]/20 rounded-lg text-[#f5f1e8] focus:border-[#E98B8B] focus:outline-none disabled:opacity-50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#f5f1e8] mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#f5f1e8]/20 flex items-center justify-center">
                      <Camera className="h-6 w-6 text-[#f5f1e8]/40" />
                    </div>
                    <button
                      disabled={!editing}
                      className="px-4 py-2 bg-[#E98B8B] text-white rounded-lg hover:bg-[#f0a0a0] transition-colors disabled:opacity-50"
                    >
                      Upload Photo
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#282828] rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Sadie Jean Music Stats</h2>
              
              {sadieJeanStats ? (
                <div className="space-y-8">
                  {/* Top Tracks */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#f5f1e8] mb-4">Top Sadie Jean Tracks</h3>
                    <div className="space-y-3">
                      {sadieJeanStats.topTracks.slice(0, 5).map((track, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-[#E98B8B] rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            <div>
                              <div className="text-[#f5f1e8] font-medium">{track.name}</div>
                              <div className="text-[#f5f1e8]/60 text-sm">{track.plays} plays</div>
                            </div>
                          </div>
                          <div className="text-[#E98B8B] font-semibold">
                            {Math.round(track.duration_ms / 1000 / 60)}m
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-xl font-semibold text-[#f5f1e8] mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {sadieJeanStats.recentPlays.slice(0, 5).map((play, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Headphones className="h-5 w-5 text-[#E98B8B]" />
                            <div>
                              <div className="text-[#f5f1e8] font-medium">{play.track_name}</div>
                              <div className="text-[#f5f1e8]/60 text-sm">
                                {new Date(play.played_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-[#E98B8B] font-semibold">
                            {Math.round(play.duration_ms / 1000 / 60)}m
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[#f5f1e8]/60">
                  <Music className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No Sadie Jean listening data yet</p>
                  <p className="text-sm">Start listening to see your stats!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#282828] rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Rewards & Achievements</h2>
              
              <div className="text-center py-12 text-[#f5f1e8]/60">
                <Award className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No rewards yet</p>
                <p className="text-sm">Keep listening to Sadie Jean to unlock achievements!</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'account' && (
            <motion.div
              key="account"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#282828] rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="text-[#f5f1e8] font-medium">Spotify Connected</div>
                      <div className="text-[#f5f1e8]/60 text-sm">{user.display_name}</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Disconnect
                  </button>
                </div>

                <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
                  <p className="text-[#f5f1e8]/60 text-sm mb-4">
                    Permanently delete your account and all associated data.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
