'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut, User } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  // const { user, logout } = useAuth() // DISABLED FOR DEBUGGING
  const user = null
  const logout = () => {}

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/photos', label: 'Photos' },
    { href: '/tour', label: 'Tour Dates' },
    { href: '/shop', label: 'Shop' },
    { href: '/jeanmail', label: 'JeanMail' },
    { href: '/admin', label: 'Admin' },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
        <nav className="border-b border-white/10 bg-[#282828]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Script font like Sadie Jean */}
          <Link href="/" className="text-3xl text-[#f5f1e8] tracking-tight logo-font">
            Early 20's Torture
          </Link>

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
                          ? 'bg-pink-200 text-black px-4 py-2 rounded-full'
                          : 'text-[#f5f1e8]/60 hover:text-[#f5f1e8] hover:bg-pink-200 hover:text-black hover:px-4 hover:py-2 hover:rounded-full'
                      }`}
                >
                  {item.label}
                </Link>
              )
            })}

            {/* User Menu */}
            {user && (
              <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 text-sm font-medium text-[#f5f1e8]/80 hover:text-[#f5f1e8]"
                    >
                  {user.profile_image_url ? (
                    <img 
                      src={user.profile_image_url} 
                      alt={user.display_name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                        <div className="w-8 h-8 bg-[#f5f1e8]/20 text-[#f5f1e8] rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold">{user.display_name.charAt(0).toUpperCase()}</span>
                        </div>
                  )}
                  <span>{user.display_name}</span>
                </button>

                {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#1f1a16]/90 rounded-lg border border-[#f5f1e8]/10 shadow-lg py-2 z-50">
                      <div className="px-4 py-3 border-b border-[#f5f1e8]/10">
                        <p className="text-sm font-medium text-[#f5f1e8]">{user.display_name}</p>
                        <p className="text-xs text-[#f5f1e8]/60">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-[#f5f1e8]/80 hover:bg-[#f5f1e8]/5"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-[#f5f1e8] hover:text-[#f5f1e8]/60 focus:outline-none"
                >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
            <div className="md:hidden border-t border-white/10">
              <div className="py-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                          className={`block px-4 py-3 text-sm font-medium ${
                            isActive
                              ? 'bg-pink-200 text-black rounded-full mx-2'
                              : 'text-[#f5f1e8]/60 hover:text-[#f5f1e8] hover:bg-pink-200 hover:text-black hover:rounded-full hover:mx-2'
                          }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                })}
                
                {user && (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-[#f5f1e8]/60 hover:text-[#f5f1e8] hover:bg-[#f5f1e8]/5"
                      >
                    Logout
                  </button>
                )}
              </div>
            </div>
        )}
      </div>
    </nav>
  )
}