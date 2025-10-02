'use client'

import { motion } from 'framer-motion'
import { ExternalLink, ShoppingBag, Truck, Shield, Heart } from 'lucide-react'

// Featured merchandise items - you can customize these
const featuredItems = [
  {
    id: 1,
    name: "Early 20's Torture Tee",
    price: "$35",
    image: "👕",
    description: "Official band t-shirt"
  },
  {
    id: 2,
    name: "Tour Hoodie",
    price: "$65",
    image: "🧥",
    description: "Comfortable tour hoodie"
  },
  {
    id: 3,
    name: "Vinyl Record",
    price: "$25",
    image: "💿",
    description: "Limited edition vinyl"
  },
  {
    id: 4,
    name: "Band Poster",
    price: "$15",
    image: "📷",
    description: "Official tour poster"
  }
]

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
          <p className="text-white/60 text-lg">Official Early 20's Torture merchandise</p>
        </motion.div>

        {/* Main Shop Link */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <div className="card max-w-2xl mx-auto">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 text-orange-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Visit Our Official Store</h2>
              <p className="text-white/60 mb-8 text-lg">
                Shop the complete collection of Early 20's Torture merchandise, 
                including exclusive items and limited edition releases.
              </p>
              <a
                href="https://shop.sadiejean.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
              >
                <span>Shop Now</span>
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Featured Items Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Items</h2>
            <p className="text-white/60 text-lg">Popular merchandise from our collection</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="card group hover:scale-105 transition-transform duration-300"
              >
                <div className="aspect-square bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-6xl">{item.image}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-white/60 mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-400">{item.price}</span>
                  <button className="text-white/60 hover:text-white transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Store Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="card text-center">
            <Truck className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Fast Shipping</h3>
            <p className="text-white/60">Quick delivery worldwide</p>
          </div>

          <div className="card text-center">
            <Shield className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Secure Checkout</h3>
            <p className="text-white/60">Safe and encrypted payments</p>
          </div>

          <div className="card text-center">
            <Heart className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Official Merch</h3>
            <p className="text-white/60">Authentic band merchandise</p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="card max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Shop?</h2>
            <p className="text-white/60 mb-6">
              Browse our complete collection of official Early 20's Torture merchandise. 
              From clothing to accessories, find everything you need to show your support.
            </p>
            <a
              href="https://shop.sadiejean.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Visit Store</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
