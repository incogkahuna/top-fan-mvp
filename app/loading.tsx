'use client'

import { motion } from 'framer-motion'
import { Music, Headphones } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Main Loading Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-6 relative"
        >
          <div className="w-full h-full border-4 border-[#E98B8B]/20 rounded-full border-t-[#E98B8B]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Music className="h-6 w-6 text-[#E98B8B]" />
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-[#f5f1e8] mb-2">
            Loading...
          </h2>
          <p className="text-[#f5f1e8]/60 text-sm">
            Preparing your fan experience
          </p>
        </motion.div>

        {/* Animated Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center space-x-1 mt-4"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
              className="w-2 h-2 bg-[#E98B8B] rounded-full"
            />
          ))}
        </motion.div>

        {/* Secondary Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.3, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Headphones className="h-8 w-8 text-[#E98B8B]/30 mx-auto" />
        </motion.div>
      </motion.div>
    </div>
  )
}
