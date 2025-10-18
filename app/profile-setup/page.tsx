'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { User, Mail, Image, Camera, Save, AlertCircle } from 'lucide-react'
import ProfilePhotoUpload from '@/components/ProfilePhotoUpload'

export default function ProfileSetupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Extract spotify_id from URL parameters
  const spotifyId = searchParams.get('spotify_id')
  
  // State for user data
  const [userData, setUserData] = useState({
    spotify_id: '',
    display_name: '',
    email: '',
    profile_image: '',
    access_token: '',
    refresh_token: '',
    expires_at: '',
    scope: ''
  })
  
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Fetch user setup data from temporary storage or database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!spotifyId) {
        setError('Missing spotify_id parameter')
        setIsLoadingData(false)
        return
      }
      
      try {
        console.log('🔍 Fetching user setup data for:', spotifyId)
        
        // First try to get from temporary storage
        const response = await fetch(`/api/user/setup-data?spotify_id=${spotifyId}`)
        
        if (response.ok) {
          const result = await response.json()
          
          console.log('✅ User setup data retrieved from temporary storage:', {
            spotify_id: result.data.spotify_id,
            display_name: result.data.display_name,
            email: result.data.email,
            has_access_token: !!result.data.access_token
          })
          
          setUserData(result.data)
          setIsLoadingData(false)
          return
        }
        
        // If temporary storage fails, try to get from database
        console.log('🔄 Temporary storage failed, trying database...')
        const dbResponse = await fetch(`/api/auth/me?userId=${spotifyId}`)
        
        if (dbResponse.ok) {
          const dbResult = await dbResponse.json()
          
          console.log('✅ User data retrieved from database:', {
            spotify_id: dbResult.spotify_id,
            display_name: dbResult.display_name,
            email: dbResult.email
          })
          
          // Set basic user data (without tokens - those should be in database already)
          setUserData({
            spotify_id: dbResult.spotify_id,
            display_name: dbResult.display_name,
            email: dbResult.email,
            profile_image: dbResult.profile_image,
            access_token: '', // Tokens are already in database
            refresh_token: '',
            expires_at: '',
            scope: ''
          })
          setIsLoadingData(false)
          return
        }
        
        throw new Error('Failed to fetch user data from both temporary storage and database')
        
      } catch (err) {
        console.error('❌ Error fetching user setup data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load user data')
        setIsLoadingData(false)
      }
    }
    
    fetchUserData()
  }, [spotifyId])

  // Form state
  const [formData, setFormData] = useState({
    customHandle: '',
    bio: '',
    customProfileImage: null as string | null,
    privacySettings: {
      showListeningData: true,
      showProfile: true,
      allowMessages: true
    }
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Validate required data
  useEffect(() => {
    if (!isLoadingData && (!spotifyId || !userData.display_name || !userData.email)) {
      setError('Missing required user data. Please try signing in again.')
    }
  }, [isLoadingData, spotifyId, userData.display_name, userData.email])

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleProfileImageChange = (imageUrl: string | null) => {
    setFormData(prev => ({
      ...prev,
      customProfileImage: imageUrl
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/user/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spotify_id: spotifyId,
          display_name: userData.display_name,
          email: userData.email,
          profile_image: userData.profile_image,
          access_token: userData.access_token,
          refresh_token: userData.refresh_token,
          expires_at: userData.expires_at,
          scope: userData.scope,
          custom_handle: formData.customHandle,
          bio: formData.bio,
          custom_profile_image: formData.customProfileImage,
          privacy_settings: formData.privacySettings
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create profile')
      }

      setSuccess(true)
      
      // Redirect to profile page after a brief success message
      setTimeout(() => {
        router.push('/profile')
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-[#282828] flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#E98B8B] border-t-transparent mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-[#f5f1e8] mb-4">Loading Your Profile</h1>
          <p className="text-[#f5f1e8]/80 mb-6">Fetching your Spotify data...</p>
        </div>
      </div>
    )
  }

  if (error && !spotifyId) {
    return (
      <div className="min-h-screen bg-[#282828] flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#f5f1e8] mb-4">Setup Error</h1>
          <p className="text-[#f5f1e8]/80 mb-6">{error}</p>
          <button
            onClick={() => router.push('/user')}
            className="bg-[#E98B8B] hover:bg-[#f0a0a0] text-white font-medium py-3 px-6 rounded-full transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#282828] flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mx-auto mb-6">
            <Save className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#f5f1e8] mb-4">Welcome to Early 20's Torture!</h1>
          <p className="text-[#f5f1e8]/80 mb-6">Your profile has been created successfully!</p>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#E98B8B] border-t-transparent mx-auto"></div>
          <p className="text-[#f5f1e8]/60 text-sm mt-4">Redirecting to your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#282828] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#f5f1e8] mb-2">Welcome to Early 20's Torture!</h1>
          <p className="text-[#f5f1e8]/80">Let's set up your profile</p>
        </div>

        {/* Spotify Profile Preview */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-[#f5f1e8] mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Your Profile
          </h2>
          <div className="flex items-center space-x-6">
            {/* Profile Photo Upload */}
            <div className="flex-shrink-0">
              <ProfilePhotoUpload
                currentImageUrl={userData.profile_image}
                onImageChange={handleProfileImageChange}
                userId={spotifyId || ''}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-[#f5f1e8] mb-1">{userData.display_name || 'User'}</h3>
              <p className="text-[#f5f1e8]/60 flex items-center mb-2">
                <Mail className="w-4 h-4 mr-1" />
                {userData.email || 'No email'}
              </p>
              <p className="text-[#f5f1e8]/40 text-sm">Upload a custom profile photo or use your Spotify photo</p>
            </div>
          </div>
        </div>

        {/* Profile Setup Form */}
        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-[#f5f1e8] mb-6">Complete Your Profile</h2>
          
          {/* Custom Handle */}
          <div className="mb-6">
            <label htmlFor="customHandle" className="block text-sm font-medium text-[#f5f1e8] mb-2">
              Custom Handle (Username)
            </label>
            <input
              type="text"
              id="customHandle"
              value={formData.customHandle}
              onChange={(e) => handleInputChange('customHandle', e.target.value)}
              placeholder="Choose a unique username"
              className="w-full bg-[#282828] border border-[#f5f1e8]/20 rounded-lg px-4 py-3 text-[#f5f1e8] placeholder-[#f5f1e8]/40 focus:border-[#E98B8B] focus:outline-none transition-colors"
              maxLength={50}
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium text-[#f5f1e8] mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              className="w-full bg-[#282828] border border-[#f5f1e8]/20 rounded-lg px-4 py-3 text-[#f5f1e8] placeholder-[#f5f1e8]/40 focus:border-[#E98B8B] focus:outline-none transition-colors resize-none"
              maxLength={500}
            />
            <p className="text-[#f5f1e8]/40 text-sm mt-1">{formData.bio.length}/500</p>
          </div>

          {/* Privacy Settings */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-[#f5f1e8] mb-4">Privacy Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#f5f1e8] font-medium">Show Listening Data</p>
                  <p className="text-[#f5f1e8]/60 text-sm">Allow others to see your music stats</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacySettings.showListeningData}
                    onChange={(e) => handleInputChange('privacySettings.showListeningData', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#282828] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E98B8B]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#f5f1e8] font-medium">Public Profile</p>
                  <p className="text-[#f5f1e8]/60 text-sm">Make your profile visible to others</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacySettings.showProfile}
                    onChange={(e) => handleInputChange('privacySettings.showProfile', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#282828] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E98B8B]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#f5f1e8] font-medium">Allow Messages</p>
                  <p className="text-[#f5f1e8]/60 text-sm">Let other fans send you messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacySettings.allowMessages}
                    onChange={(e) => handleInputChange('privacySettings.allowMessages', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#282828] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E98B8B]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E98B8B] hover:bg-[#f0a0a0] disabled:bg-[#E98B8B]/50 text-white font-semibold py-4 px-6 rounded-full transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Creating Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Complete Setup</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
