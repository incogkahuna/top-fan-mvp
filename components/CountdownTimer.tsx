'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Calendar } from 'lucide-react'

interface CountdownData {
  targetDate: string
  title: string
  description: string
  isActive: boolean
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer() {
  const [countdownData, setCountdownData] = useState<CountdownData | null>(null)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [hasExpired, setHasExpired] = useState(false)

  // Fetch countdown data from API
  useEffect(() => {
    const fetchCountdownData = async () => {
      try {
        const response = await fetch('/api/countdown')
        const data = await response.json()
        setCountdownData(data)
      } catch (error) {
        console.error('Failed to fetch countdown data:', error)
        // Set default countdown data if API fails
        setCountdownData({
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          title: "Next Release",
          description: "Stay tuned for updates!",
          isActive: true
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountdownData()
  }, [])

  // Calculate time left
  useEffect(() => {
    if (!countdownData?.targetDate || !countdownData.isActive || isLoading) {
      return
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = new Date(countdownData.targetDate).getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
        setHasExpired(false)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setHasExpired(true)
      }
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [countdownData, isLoading])

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-transparent backdrop-blur-sm rounded-2xl p-8 mb-8 border border-[#f5f1e8]/10 text-center">
        <div className="flex items-center justify-center mb-4">
          <Clock className="h-6 w-6 text-[#E98B8B] mr-2" />
          <h3 className="text-2xl font-bold text-[#f5f1e8]">Loading...</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-12 bg-[#f5f1e8]/20 rounded-lg mb-2"></div>
        </div>
      </div>
    )
  }

  // Show inactive state
  if (!countdownData || !countdownData.isActive) {
    return (
      <div className="bg-transparent backdrop-blur-sm rounded-2xl p-8 mb-8 border border-[#f5f1e8]/10 text-center">
        <div className="flex items-center justify-center mb-4">
          <Calendar className="h-6 w-6 text-[#E98B8B] mr-2" />
          <h3 className="text-2xl font-bold text-[#f5f1e8]">No Active Countdown</h3>
        </div>
        <p className="text-[#f5f1e8]/60">Check back later for upcoming releases!</p>
      </div>
    )
  }

  // Show countdown
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-transparent backdrop-blur-sm rounded-2xl p-8 mb-8 border border-[#f5f1e8]/10 text-center"
    >
      <div className="flex items-center justify-center mb-4">
        <Clock className="h-6 w-6 text-[#E98B8B] mr-2" />
        <h3 className="text-2xl font-bold text-[#f5f1e8]">{countdownData.title}</h3>
      </div>

      {hasExpired ? (
        <div className="mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-[#E98B8B] mb-4"
          >
            🎉 Released! 🎉
          </motion.div>
          <p className="text-[#f5f1e8]/80 text-lg">The wait is over! Check out the new release.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <motion.div
              key={`days-${timeLeft.days}`}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-[#E98B8B] bg-[#f5f1e8]/5 rounded-lg py-4 px-2">
                {timeLeft.days.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-[#f5f1e8]/60 mt-2">Days</div>
            </motion.div>
            
            <motion.div
              key={`hours-${timeLeft.hours}`}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-[#E98B8B] bg-[#f5f1e8]/5 rounded-lg py-4 px-2">
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-[#f5f1e8]/60 mt-2">Hours</div>
            </motion.div>
            
            <motion.div
              key={`minutes-${timeLeft.minutes}`}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-[#E98B8B] bg-[#f5f1e8]/5 rounded-lg py-4 px-2">
                {timeLeft.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-[#f5f1e8]/60 mt-2">Minutes</div>
            </motion.div>
            
            <motion.div
              key={`seconds-${timeLeft.seconds}`}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-[#E98B8B] bg-[#f5f1e8]/5 rounded-lg py-4 px-2">
                {timeLeft.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-[#f5f1e8]/60 mt-2">Seconds</div>
            </motion.div>
          </div>
          
          <p className="text-[#f5f1e8]/60 text-sm mb-4">
            Until {new Date(countdownData.targetDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </>
      )}

      <p className="text-[#f5f1e8]/60 text-sm">{countdownData.description}</p>
    </motion.div>
  )
}