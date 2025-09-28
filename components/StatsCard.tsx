'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color?: string
  delay?: number
}

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'text-spotify-green',
  delay = 0 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-sm text-spotify-green">{subtitle}</p>
          )}
        </div>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
    </motion.div>
  )
}
