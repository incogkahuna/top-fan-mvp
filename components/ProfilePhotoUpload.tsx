'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, X } from 'lucide-react'

interface ProfilePhotoUploadProps {
  currentImageUrl?: string | null
  onImageChange: (imageUrl: string | null) => void
  userId: string
}

export default function ProfilePhotoUpload({ currentImageUrl, onImageChange, userId }: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)

    try {
      // Create preview URL
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)

      // In a real app, you would upload to a service like Cloudinary, AWS S3, etc.
      // For now, we'll use the preview URL as the image URL
      onImageChange(preview)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Profile Photo Display */}
      <div className="relative">
        {currentImageUrl || previewUrl ? (
          <div className="relative group">
            <img
              src={currentImageUrl || previewUrl || ''}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-pink-300 object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">♪</span>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <motion.button
        onClick={handleUploadClick}
        disabled={isUploading}
        className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-pink-200 transition-colors disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            <span>Upload Photo</span>
          </>
        )}
      </motion.button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Guidelines */}
      <div className="text-center text-sm text-[#f5f1e8]/60">
        <p>Upload a profile photo</p>
        <p className="text-xs">Max 5MB, JPG/PNG/GIF</p>
      </div>
    </div>
  )
}
