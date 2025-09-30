'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X, Camera, Upload } from 'lucide-react'
import Image from 'next/image'

interface Photo {
  id: string
  url: string
  alt: string
  filename: string
}

export default function Photos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)

  // Load photos from public/photos folder
  useEffect(() => {
    const loadPhotos = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch('/api/test/simple?type=photos')
        if (response.ok) {
          const data = await response.json()
          setPhotos(data.photos || [])
        } else {
          // Fallback to sample photos if API fails
          const samplePhotos: Photo[] = [
            { id: '1', url: '/photos/band-1.jpg', alt: 'Band photo 1', filename: 'band-1.jpg' },
            { id: '2', url: '/photos/band-2.jpg', alt: 'Band photo 2', filename: 'band-2.jpg' },
            { id: '3', url: '/photos/band-3.jpg', alt: 'Band photo 3', filename: 'band-3.jpg' },
            { id: '4', url: '/photos/band-4.jpg', alt: 'Band photo 4', filename: 'band-4.jpg' },
            { id: '5', url: '/photos/band-5.jpg', alt: 'Band photo 5', filename: 'band-5.jpg' },
            { id: '6', url: '/photos/band-6.jpg', alt: 'Band photo 6', filename: 'band-6.jpg' },
          ]
          setPhotos(samplePhotos)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error loading photos:', error)
        setPhotos([])
        setLoading(false)
      }
    }

    loadPhotos()
  }, [])

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-4 logo-font">Photos</h1>
          <p className="text-white/60 text-lg">Behind the scenes and on the road</p>
        </motion.div>

        {/* Instructions for adding photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex items-center space-x-4">
            <Upload className="h-8 w-8 text-orange-400" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Add Photos</h3>
              <p className="text-white/60 text-sm">
                Drop image files (.jpg, .png, .gif, .webp) into the <code className="bg-white/10 px-2 py-1 rounded">public/photos</code> folder
              </p>
            </div>
          </div>
        </motion.div>

        {/* Photo Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Loading photos...</p>
          </div>
        ) : photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Camera className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Photos Yet</h3>
            <p className="text-white/60 mb-6">Add photos to the public/photos folder to see them here</p>
            <div className="bg-white/5 rounded-lg p-6 max-w-md mx-auto">
              <h4 className="text-white font-semibold mb-2">How to add photos:</h4>
              <ol className="text-white/60 text-sm text-left space-y-1">
                <li>1. Create a <code className="bg-white/10 px-1 rounded">public/photos</code> folder</li>
                <li>2. Add image files (.jpg, .png, .gif, .webp)</li>
                <li>3. Refresh this page to see them</li>
              </ol>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer aspect-square bg-white/5 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="w-full h-full relative">
                  <Image
                    src={photo.url}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                            <span class="text-6xl">📷</span>
                          </div>
                        `
                      }
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-white/60 transition-colors z-10"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <div className="max-w-4xl w-full">
              <div className="relative aspect-square max-h-[80vh]">
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.alt}
                  fill
                  className="object-contain rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center">
                          <span class="text-9xl">📷</span>
                        </div>
                      `
                    }
                  }}
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-white/60 text-sm">{selectedPhoto.filename}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
