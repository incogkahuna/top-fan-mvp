'use client'

import { useEffect, useState } from 'react'

interface AutoSyncProps {
  onDataUpdate?: () => void
  userId?: string
}

export default function AutoSync({ onDataUpdate, userId }: AutoSyncProps) {
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!userId) return

    let intervalId: NodeJS.Timeout

    const performSync = async () => {
      try {
        setIsRunning(true)
        
        const response = await fetch('/api/data/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        
        if (result && result.success && result.synced > 0) {
          console.log(`🔄 Auto-sync: ${result.synced} new tracks found`)
          
          // Trigger dashboard refresh if new data was found
          if (onDataUpdate) {
            onDataUpdate()
          }
        }
        
        setLastSync(new Date())
      } catch (error) {
        console.error('Auto-sync error:', error)
      } finally {
        setIsRunning(false)
      }
    }

    // Only start auto-sync if we're in the browser
    if (typeof window !== 'undefined') {
      // Perform initial sync after 5 seconds
      const initialTimeout = setTimeout(performSync, 5000)

      // Then sync every 5 seconds (very fast for testing)
      intervalId = setInterval(performSync, 5000)

      return () => {
        clearTimeout(initialTimeout)
        clearInterval(intervalId)
      }
    }
  }, [userId, onDataUpdate])

  // Don't render anything - this is a background component
  return null
}

// Hook to use auto-sync functionality
export function useAutoSync() {
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle')

  const triggerSync = async (userId: string) => {
    setSyncStatus('syncing')
    try {
      const response = await fetch('/api/data/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      
      if (response.ok) {
        setSyncStatus('idle')
        setLastSyncTime(new Date())
        return true
      } else {
        setSyncStatus('error')
        return false
      }
    } catch (error) {
      setSyncStatus('error')
      return false
    }
  }

  return { lastSyncTime, syncStatus, triggerSync }
}
