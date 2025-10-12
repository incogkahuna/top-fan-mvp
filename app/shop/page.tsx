'use client'

import { motion } from 'framer-motion'
import { ExternalLink, ShoppingBag } from 'lucide-react'

export default function Shop() {
  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-4 logo-font">Shop</h1>
          <p className="text-white/60 text-lg">Official Early Twenties Torture merchandise</p>
        </motion.div>

        {/* Store Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          {/* Store Preview Card */}
          <div className="max-w-4xl mx-auto">
            <a
              href="https://shop.sadiejean.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gradient-to-br from-gray-900 to-black rounded-lg shadow-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
            >
              {/* Store Header */}
              <div className="bg-gradient-to-r from-white to-gray-300 p-6 text-black">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Sadie Jean Official Store</h3>
                    <p className="text-gray-700">shop.sadiejean.com</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-black/10 px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-black">Live</span>
                  </div>
                </div>
              </div>
              
              {/* Store Content */}
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20">
                    <ShoppingBag className="h-10 w-10 text-black" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Ready to Shop?</h4>
                  <p className="text-gray-400">
                    Visit our official store to browse the complete collection of Sadie Jean merchandise
                  </p>
                </div>

                {/* Direct Link */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all duration-300">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Visit Store Now</span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
