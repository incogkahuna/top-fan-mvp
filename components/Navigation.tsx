'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, User, Music } from 'lucide-react'
import { useSpotifyAuth } from '@/lib/useSpotifyAuth'

export default function Navigation() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading: authLoading, disconnectSpotify } = useSpotifyAuth()
  
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/photos', label: 'Photos' },
    { href: '/tour', label: 'Tour Dates' },
    { href: '/shop', label: 'Shop' },
    { href: '/jeanmail', label: 'JeanMail' },
    { href: '/admin', label: 'Admin' },
  ]

  const handleLogout = async () => {
    await disconnectSpotify()
    router.push('/')
  }

  return (
        <nav className="border-b border-white/10 bg-[#282828]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center min-h-[5rem] py-4">
          {/* Logo removed - using main homepage title instead */}

          {/* Desktop Navigation - Clean minimal links */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                      className={`text-sm font-medium ${
                        isActive
                          ? 'bg-[#8B3A3A] text-white px-4 py-2 rounded-full'
                          : 'text-[#f5f1e8]/60 hover:text-[#f5f1e8] hover:bg-[#8B3A3A] hover:text-white hover:px-4 hover:py-2 hover:rounded-full'
                      }`}
                >
                  {item.label}
                </Link>
              )
            })}

            {/* User Status - ALWAYS VISIBLE */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                // LOGGED IN - Show user profile
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-sm font-medium text-[#f5f1e8] hover:text-[#f5f1e8] transition-colors bg-[#1DB954]/20 px-3 py-2 rounded-lg border border-[#1DB954]/30"
                >
                  {user.profile_image ? (
                    <img 
                      src={user.profile_image} 
                      alt={user.display_name}
                      className="w-8 h-8 rounded-full object-cover border border-[#1DB954]/50"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[#1DB954] text-white rounded-full flex items-center justify-center">
                      <Music className="h-4 w-4" />
                    </div>
                  )}
                  <span className="hidden sm:block font-semibold">{user.display_name}</span>
                  <span className="text-xs text-[#1DB954]">●</span>
                </button>
              ) : authLoading ? (
                // LOADING - Show loading state
                <div className="flex items-center space-x-2 text-sm text-[#f5f1e8]/60">
                  <div className="w-6 h-6 border-2 border-[#f5f1e8]/30 border-t-[#f5f1e8] rounded-full animate-spin"></div>
                  <span className="hidden sm:block">Loading...</span>
                </div>
              ) : (
                // NOT LOGGED IN - Show login prompt
                <Link 
                  href="/user"
                  className="flex items-center space-x-2 text-sm font-medium text-[#f5f1e8]/80 hover:text-[#f5f1e8] transition-colors bg-[#f5f1e8]/10 px-3 py-2 rounded-lg border border-[#f5f1e8]/20 hover:bg-[#f5f1e8]/20"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block">Login</span>
                </Link>
              )}

              {/* User Menu Dropdown - Only show when logged in */}
              {user && showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#1f1a16]/95 backdrop-blur-sm rounded-lg border border-[#f5f1e8]/10 shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-[#f5f1e8]/10">
                    <p className="text-sm font-medium text-[#f5f1e8]">{user.display_name}</p>
                    <p className="text-xs text-[#f5f1e8]/60">Connected via Spotify</p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        router.push('/profile')
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#f5f1e8]/80 hover:bg-[#f5f1e8]/5 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        window.open('https://open.spotify.com/user/' + user.spotify_id, '_blank')
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#f5f1e8]/80 hover:bg-[#f5f1e8]/5 transition-colors"
                    >
                      <Music className="h-4 w-4" />
                      <span>Open Spotify</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-[#f5f1e8]/10 pt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#f5f1e8]/80 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile User Status - Compact version */}
          <div className="md:hidden flex items-center">
            {user ? (
              <div className="flex items-center space-x-2">
                {user.profile_image ? (
                  <img 
                    src={user.profile_image} 
                    alt={user.display_name}
                    className="w-6 h-6 rounded-full object-cover border border-[#1DB954]/50"
                  />
                ) : (
                  <div className="w-6 h-6 bg-[#1DB954] text-white rounded-full flex items-center justify-center">
                    <Music className="h-3 w-3" />
                  </div>
                )}
                <span className="text-xs font-medium text-[#f5f1e8] truncate max-w-[80px]">{user.display_name}</span>
              </div>
            ) : authLoading ? (
              <div className="w-6 h-6 border-2 border-[#f5f1e8]/30 border-t-[#f5f1e8] rounded-full animate-spin"></div>
            ) : (
              <Link 
                href="/user"
                className="flex items-center space-x-1 text-xs font-medium text-[#f5f1e8]/80 hover:text-[#f5f1e8]"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation - Simplified */}
        <div className="md:hidden border-t border-white/10">
          {/* Horizontal Scrolling Navigation */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center space-x-1 px-4 py-3 min-w-max">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-[#8B3A3A] text-white shadow-md'
                        : 'text-[#f5f1e8]/60 hover:text-[#f5f1e8] hover:bg-[#f5f1e8]/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
              
              {/* Profile/Logout buttons for mobile */}
              {user && (
                <>
                  <div className="mx-2 h-6 w-px bg-white/20"></div>
                  <button
                    onClick={() => router.push('/profile')}
                    className="whitespace-nowrap px-3 py-2 text-sm text-[#f5f1e8]/60 hover:text-[#f5f1e8] hover:bg-[#f5f1e8]/10 rounded-full transition-all duration-200"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="whitespace-nowrap px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-full transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}