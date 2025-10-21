'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Clock, Ticket, Plus, Edit, Trash2, Save, X } from 'lucide-react'

interface TourDate {
  id?: string
  date: string
  time: string
  venue: string
  city: string
  state: string
  country: string
  ticket_link: string
  ticket_price: number
  capacity: number
  sold: number
  status: string
  description: string
  is_active: boolean
}

export default function AdminTourDates() {
  const [tourDates, setTourDates] = useState<TourDate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [formData, setFormData] = useState<Partial<TourDate>>({
    date: '',
    time: '',
    venue: '',
    city: '',
    state: '',
    country: 'United States',
    ticket_link: '',
    ticket_price: 0,
    capacity: 0,
    sold: 0,
    status: 'On Sale',
    description: '',
    is_active: true
  })

  useEffect(() => {
    loadTourDates()
  }, [])

  const loadTourDates = async () => {
    try {
      const response = await fetch('/api/admin/tour-dates')
      if (response.ok) {
        const data = await response.json()
        setTourDates(data.tourDates || [])
      }
    } catch (error) {
      console.error('Error loading tour dates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/admin/tour-dates/${editingId}` : '/api/admin/tour-dates'
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await loadTourDates()
        setEditingId(null)
        setShowAddForm(false)
        setFormData({
          date: '',
          time: '',
          venue: '',
          city: '',
          state: '',
          country: 'United States',
          ticket_link: '',
          ticket_price: 0,
          capacity: 0,
          sold: 0,
          status: 'On Sale',
          description: '',
          is_active: true
        })
      }
    } catch (error) {
      console.error('Error saving tour date:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour date?')) return
    
    try {
      const response = await fetch(`/api/admin/tour-dates/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadTourDates()
      }
    } catch (error) {
      console.error('Error deleting tour date:', error)
    }
  }

  const handleSyncLaylo = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/admin/tour-dates/sync-laylo', {
        method: 'POST'
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Sync successful:', data.message)
        await loadTourDates() // Reload the tour dates
        alert(`Successfully synced ${data.total} tour dates from Laylo!`)
      } else {
        const error = await response.json()
        console.error('Sync failed:', error)
        alert('Failed to sync from Laylo: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error syncing from Laylo:', error)
      alert('Error syncing from Laylo: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSyncing(false)
    }
  }

  const startEdit = (tourDate: TourDate) => {
    setEditingId(tourDate.id!)
    setFormData(tourDate)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setShowAddForm(false)
    setFormData({
      date: '',
      time: '',
      venue: '',
      city: '',
      state: '',
      country: 'United States',
      ticket_link: '',
      ticket_price: 0,
      capacity: 0,
      sold: 0,
      status: 'On Sale',
      description: '',
      is_active: true
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading tour dates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Tour Dates Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleSyncLaylo}
              disabled={syncing}
              className="btn-secondary inline-flex items-center space-x-2 disabled:opacity-50"
            >
              {syncing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Calendar className="h-5 w-5" />
              )}
              <span>{syncing ? 'Syncing...' : 'Sync from Laylo'}</span>
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Tour Date</span>
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Tour Date' : 'Add New Tour Date'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Venue *</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ticket Link</label>
                <input
                  type="url"
                  value={formData.ticket_link}
                  onChange={(e) => setFormData({ ...formData, ticket_link: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ticket Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.ticket_price}
                  onChange={(e) => setFormData({ ...formData, ticket_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tickets Sold</label>
                <input
                  type="number"
                  value={formData.sold}
                  onChange={(e) => setFormData({ ...formData, sold: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                  <option value="On Sale">On Sale</option>
                  <option value="Sold Out">Sold Out</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Postponed">Postponed</option>
                  <option value="Announced">Announced</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div className="flex items-center space-x-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-orange-400 bg-gray-800 border-gray-600 rounded focus:ring-orange-400"
                />
                <label htmlFor="is_active" className="text-sm">Active (visible to public)</label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4 inline mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingId ? 'Update' : 'Create'}</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Tour Dates List */}
        <div className="grid gap-6">
          {tourDates.map((tourDate, index) => (
            <motion.div
              key={tourDate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-orange-400" />
                      <span className="font-semibold">{new Date(tourDate.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-orange-400" />
                      <span>{tourDate.time || 'TBA'}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      tourDate.status === 'Sold Out' 
                        ? 'bg-red-500/20 text-red-400' 
                        : tourDate.status === 'On Sale'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {tourDate.status}
                    </span>
                    {!tourDate.is_active && (
                      <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">
                        Inactive
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{tourDate.venue}</h3>
                  
                  <div className="flex items-center space-x-2 text-white/60 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{tourDate.city}{tourDate.state && `, ${tourDate.state}`}</span>
                  </div>

                  {tourDate.description && (
                    <p className="text-white/80 mb-4">{tourDate.description}</p>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {tourDate.ticket_price > 0 && (
                      <div>
                        <span className="text-white/60">Price:</span>
                        <span className="ml-1 font-semibold">${tourDate.ticket_price.toFixed(2)}</span>
                      </div>
                    )}
                    {tourDate.capacity > 0 && (
                      <div>
                        <span className="text-white/60">Capacity:</span>
                        <span className="ml-1">{tourDate.capacity}</span>
                      </div>
                    )}
                    {tourDate.sold > 0 && (
                      <div>
                        <span className="text-white/60">Sold:</span>
                        <span className="ml-1">{tourDate.sold}</span>
                      </div>
                    )}
                    {tourDate.ticket_link && (
                      <div>
                        <span className="text-white/60">Tickets:</span>
                        <a 
                          href={tourDate.ticket_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-1 text-orange-400 hover:text-orange-300"
                        >
                          <Ticket className="h-4 w-4 inline" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => startEdit(tourDate)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(tourDate.id!)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {tourDates.length === 0 && (
          <div className="card text-center py-16">
            <Calendar className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Tour Dates</h3>
            <p className="text-white/60 text-lg">Add your first tour date to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}
