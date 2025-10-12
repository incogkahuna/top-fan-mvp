'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, Lock, AlertTriangle } from 'lucide-react'

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'GET',
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (response.ok && data.authenticated) {
        setIsAuthorized(true)
      } else {
        setError('Admin authentication required')
      }
    } catch (error) {
      console.error('Admin access check failed:', error)
      setError('Failed to verify admin access')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginRedirect = () => {
    router.push('/admin-login')
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
      router.push('/admin-login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#282828] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <p className="text-[#f5f1e8] text-lg">Verifying admin access...</p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#282828] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#333333] rounded-lg p-8 border border-white/10 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-2xl font-bold text-[#f5f1e8] mb-2">Access Denied</h1>
            <p className="text-[#f5f1e8]/60 mb-6">
              {error || 'Admin authentication required to access this page.'}
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-gradient-to-r from-pink-300 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-400 hover:to-pink-600 transition-all duration-200"
              >
                Admin Login
              </button>
              
              <button
                onClick={() => router.push('/')}
                className="w-full bg-transparent border border-white/20 text-[#f5f1e8] py-3 px-4 rounded-lg font-medium hover:bg-white/10 transition-all duration-200"
              >
                Back to Home
              </button>
            </div>
            
            <div className="mt-6 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Admin access is restricted</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#282828]">
      {/* Admin Header with Logout */}
      <div className="bg-[#1a1a1a] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#f5f1e8]">Admin Dashboard</h1>
                <p className="text-sm text-[#f5f1e8]/60">Secure admin access</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Admin Session Active</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Admin Content */}
      {children}
    </div>
  )
}
