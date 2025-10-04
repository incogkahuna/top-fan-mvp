'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  TrendingUp, 
  Music, 
  BarChart3, 
  Settings, 
  Shield, 
  Activity,
  Crown,
  Clock,
  Star,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalPlays: number
  totalPoints: number
  topFan: {
    name: string
    plays: number
    points: number
  }
  recentActivity: Array<{
    id: string
    user: string
    action: string
    timestamp: string
  }>
}

interface UserData {
  id: string
  name: string
  email: string
  totalPlays: number
  points: number
  rank: number
  lastActive: string
  profileImage?: string
  isActive: boolean
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [systemHealth, setSystemHealth] = useState<any>(null)

  // Countdown management functions
  const updateCountdown = async () => {
    try {
      const title = (document.getElementById('countdown-title') as HTMLInputElement)?.value
      const targetDate = (document.getElementById('countdown-date') as HTMLInputElement)?.value
      const description = (document.getElementById('countdown-description') as HTMLTextAreaElement)?.value
      const isActive = (document.getElementById('countdown-active') as HTMLInputElement)?.checked

      if (!title || !targetDate || !description) {
        alert('Please fill in all countdown fields')
        return
      }

      const response = await fetch('/api/countdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          targetDate: new Date(targetDate).toISOString(),
          description,
          isActive
        }),
      })

      if (response.ok) {
        alert('Countdown updated successfully!')
      } else {
        alert('Failed to update countdown')
      }
    } catch (error) {
      console.error('Error updating countdown:', error)
      alert('Error updating countdown')
    }
  }

  const previewCountdown = () => {
    // Open homepage in new tab for preview
    window.open('/', '_blank')
  }

  useEffect(() => {
    fetchAdminData()
    fetchSystemHealth()
  }, [])

  const fetchSystemHealth = async () => {
    try {
      const response = await fetch('/api/admin/health')
      const health = await response.json()
      setSystemHealth(health)
    } catch (error) {
      console.error('Health check error:', error)
    }
  }

  const exportData = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/export?type=${type}&format=csv`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `export-${type}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    }
  }

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      // Fetch admin stats
      const statsResponse = await fetch('/api/admin/stats')
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch users data
      const usersResponse = await fetch('/api/admin/users')
      const usersData = await usersResponse.json()
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                          (filterStatus === 'active' && user.isActive) ||
                          (filterStatus === 'inactive' && !user.isActive)
    return matchesSearch && matchesFilter
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'content', label: 'Content', icon: Music },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-[#282828]">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#f5f1e8]">Admin Dashboard</h1>
              <p className="text-[#f5f1e8]/60 mt-1">Manage your fan community and track performance</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-[#f5f1e8]/60">
                <Shield className="h-4 w-4" />
                <span>Admin Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => exportData('users')}
                  className="bg-[#8B3A3A] text-white px-4 py-2 rounded-lg hover:bg-[#A04747] transition-colors"
                >
                  Export Users
                </button>
                <button 
                  onClick={() => exportData('analytics')}
                  className="bg-[#8B3A3A] text-white px-4 py-2 rounded-lg hover:bg-[#A04747] transition-colors"
                >
                  Export Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-[#333333] p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'text-[#f5f1e8]/60 hover:text-[#f5f1e8] hover:bg-white hover:text-black'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#f5f1e8]/60 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-[#f5f1e8]">{stats?.totalUsers || 0}</p>
                  </div>
                  <Users className="h-8 w-8 text-pink-300" />
                </div>
              </div>

              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#f5f1e8]/60 text-sm">Active Users</p>
                    <p className="text-3xl font-bold text-[#f5f1e8]">{stats?.activeUsers || 0}</p>
                  </div>
                  <Activity className="h-8 w-8 text-pink-300" />
                </div>
              </div>

              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#f5f1e8]/60 text-sm">Total Plays</p>
                    <p className="text-3xl font-bold text-[#f5f1e8]">{stats?.totalPlays?.toLocaleString() || 0}</p>
                  </div>
                  <Music className="h-8 w-8 text-pink-300" />
                </div>
              </div>

              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#f5f1e8]/60 text-sm">Total Points</p>
                    <p className="text-3xl font-bold text-[#f5f1e8]">{stats?.totalPoints?.toLocaleString() || 0}</p>
                  </div>
                  <Star className="h-8 w-8 text-pink-300" />
                </div>
              </div>
            </div>

            {/* Top Fan & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold text-[#f5f1e8] mb-4 flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-pink-300" />
                  <span>Top Fan</span>
                </h3>
                {stats?.topFan ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">#1</span>
                      </div>
                      <div>
                        <p className="font-semibold text-[#f5f1e8]">{stats.topFan.name}</p>
                        <p className="text-sm text-[#f5f1e8]/60">{stats.topFan.plays} plays • {stats.topFan.points} points</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#f5f1e8]/60">No data available</p>
                )}
              </div>

              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold text-[#f5f1e8] mb-4 flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-pink-300" />
                  <span>Recent Activity</span>
                </h3>
                <div className="space-y-3">
                  {stats?.recentActivity?.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm text-[#f5f1e8]">{activity.user}</p>
                        <p className="text-xs text-[#f5f1e8]/60">{activity.action}</p>
                      </div>
                      <span className="text-xs text-[#f5f1e8]/40">{activity.timestamp}</span>
                    </div>
                  )) || <p className="text-[#f5f1e8]/60">No recent activity</p>}
                </div>
              </div>
            </div>

            {/* System Health */}
            {systemHealth && (
              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold text-[#f5f1e8] mb-4 flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-pink-300" />
                  <span>System Health</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#f5f1e8]/80">Database</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      systemHealth.services?.database?.status === 'healthy' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {systemHealth.services?.database?.status || 'unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#f5f1e8]/80">Spotify</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      systemHealth.services?.spotify?.status === 'healthy' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {systemHealth.services?.spotify?.status || 'unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#f5f1e8]/80">Storage</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      systemHealth.services?.storage?.status === 'healthy' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {systemHealth.services?.storage?.status || 'unknown'}
                    </span>
                  </div>
                </div>
                {systemHealth.metrics && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-[#f5f1e8]/60">Uptime:</span>
                        <span className="text-[#f5f1e8] ml-2">{Math.round(systemHealth.metrics.uptime / 3600)}h</span>
                      </div>
                      <div>
                        <span className="text-[#f5f1e8]/60">Memory:</span>
                        <span className="text-[#f5f1e8] ml-2">{Math.round(systemHealth.metrics.memoryUsage?.heapUsed / 1024 / 1024)}MB</span>
                      </div>
                      <div>
                        <span className="text-[#f5f1e8]/60">Node:</span>
                        <span className="text-[#f5f1e8] ml-2">{systemHealth.metrics.nodeVersion}</span>
                      </div>
                      <div>
                        <span className="text-[#f5f1e8]/60">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                          systemHealth.status === 'healthy' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {systemHealth.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#f5f1e8]/40" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#333333] border border-white/10 rounded-lg text-[#f5f1e8] placeholder-[#f5f1e8]/40 focus:outline-none focus:border-pink-300"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-[#333333] border border-white/10 rounded-lg text-[#f5f1e8] focus:outline-none focus:border-pink-300"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="bg-[#333333] rounded-lg border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1a1a1a] border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#f5f1e8]">User</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#f5f1e8]">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#f5f1e8]">Plays</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#f5f1e8]">Points</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#f5f1e8]">Last Active</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-[#f5f1e8]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-[#404040]">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {user.profileImage ? (
                              <img 
                                src={user.profileImage} 
                                alt={user.name}
                                className="w-10 h-10 rounded-full border border-pink-300"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">♪</span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-[#f5f1e8]">{user.name}</p>
                              <p className="text-sm text-[#f5f1e8]/60">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-pink-300">#{user.rank}</span>
                        </td>
                        <td className="px-6 py-4 text-[#f5f1e8]">{user.totalPlays.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#f5f1e8]">{user.points.toLocaleString()}</td>
                        <td className="px-6 py-4 text-[#f5f1e8]/60">{user.lastActive}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-white hover:text-black rounded transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1 hover:bg-white hover:text-black rounded transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-1 hover:bg-red-500 hover:text-white rounded transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold text-[#f5f1e8] mb-4">User Growth</h3>
                <div className="h-64 flex items-center justify-center text-[#f5f1e8]/60">
                  Chart placeholder - User growth over time
                </div>
              </div>

              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold text-[#f5f1e8] mb-4">Listening Patterns</h3>
                <div className="h-64 flex items-center justify-center text-[#f5f1e8]/60">
                  Chart placeholder - Peak listening hours
                </div>
              </div>
            </div>

            <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-bold text-[#f5f1e8] mb-4">Top Performing Content</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-300 to-pink-500 rounded-lg flex items-center justify-center">
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[#f5f1e8]">Song Name</p>
                      <p className="text-sm text-[#f5f1e8]/60">Most played track</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#f5f1e8]">1,234 plays</p>
                    <p className="text-sm text-[#f5f1e8]/60">+12% this week</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#f5f1e8]">Content Management</h3>
              <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-pink-200 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Content</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Songs</h4>
                <p className="text-[#f5f1e8]/60 mb-4">Manage your music catalog</p>
                <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-pink-200 transition-colors">
                  Manage Songs
                </button>
              </div>

              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Photos</h4>
                <p className="text-[#f5f1e8]/60 mb-4">Upload and organize photos</p>
                <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-pink-200 transition-colors">
                  Manage Photos
                </button>
              </div>

              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Tour Dates</h4>
                <p className="text-[#f5f1e8]/60 mb-4">Update tour information</p>
                <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-pink-200 transition-colors">
                  Manage Tours
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold text-[#f5f1e8] mb-4">Site Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#f5f1e8] mb-2">Site Title</label>
                    <input
                      type="text"
                      defaultValue="Early Twenties Torture"
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#f5f1e8] focus:outline-none focus:border-pink-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#f5f1e8] mb-2">Description</label>
                    <textarea
                      rows={3}
                      defaultValue="New music out now"
                      className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#f5f1e8] focus:outline-none focus:border-pink-300"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold text-[#f5f1e8] mb-4">Leaderboard Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[#f5f1e8]">Enable Leaderboard</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#f5f1e8]">Show Points</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#f5f1e8]">Allow Profile Photos</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-bold text-[#f5f1e8] mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-[#E98B8B]" />
                Countdown Timer Management
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#f5f1e8] mb-2">Countdown Title</label>
                  <input
                    type="text"
                    id="countdown-title"
                    defaultValue=""
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#f5f1e8] focus:outline-none focus:border-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#f5f1e8] mb-2">Target Date & Time</label>
                  <input
                    type="datetime-local"
                    id="countdown-date"
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#f5f1e8] focus:outline-none focus:border-pink-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#f5f1e8] mb-2">Description</label>
                  <textarea
                    rows={2}
                    id="countdown-description"
                    defaultValue="Stay tuned for updates!"
                    className="w-full px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-[#f5f1e8] focus:outline-none focus:border-pink-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#f5f1e8]">Enable Countdown</span>
                  <input type="checkbox" id="countdown-active" defaultChecked className="rounded" />
                </div>
                <div className="flex space-x-4">
                  <button 
                    onClick={updateCountdown}
                    className="bg-[#E98B8B] text-white px-6 py-2 rounded-lg hover:bg-[#E98B8B]/80 transition-colors"
                  >
                    Update Countdown
                  </button>
                  <button 
                    onClick={previewCountdown}
                    className="bg-transparent border border-[#E98B8B] text-[#E98B8B] px-6 py-2 rounded-lg hover:bg-[#E98B8B]/10 transition-colors"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#333333] rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-bold text-[#f5f1e8] mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                  Reset All Data
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                  Delete All Users
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
