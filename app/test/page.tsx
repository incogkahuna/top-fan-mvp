'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react'

export default function TestPage() {
  const [tests, setTests] = useState([
    { name: 'Environment Variables', status: 'pending', message: '' },
    { name: 'Supabase Connection', status: 'pending', message: '' },
    { name: 'Spotify API', status: 'pending', message: '' },
    { name: 'Database Schema', status: 'pending', message: '' }
  ])

  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    const newTests = [...tests]

    // Test 1: Environment Variables
    try {
      const requiredEnvVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SPOTIFY_CLIENT_ID',
        'SPOTIFY_CLIENT_SECRET'
      ]
      
      const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
      
      if (missingVars.length === 0) {
        newTests[0] = { name: 'Environment Variables', status: 'success', message: 'All required environment variables are set' }
      } else {
        newTests[0] = { name: 'Environment Variables', status: 'error', message: `Missing: ${missingVars.join(', ')}` }
      }
    } catch (error) {
      newTests[0] = { name: 'Environment Variables', status: 'error', message: 'Error checking environment variables' }
    }

    setTests([...newTests])
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Test 2: Supabase Connection
    try {
      const response = await fetch('/api/test/supabase')
      if (response.ok) {
        newTests[1] = { name: 'Supabase Connection', status: 'success', message: 'Successfully connected to Supabase' }
      } else {
        newTests[1] = { name: 'Supabase Connection', status: 'error', message: 'Failed to connect to Supabase' }
      }
    } catch (error) {
      newTests[1] = { name: 'Supabase Connection', status: 'error', message: 'Supabase connection test failed' }
    }

    setTests([...newTests])
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Test 3: Spotify API
    try {
      const response = await fetch('/api/test/spotify')
      if (response.ok) {
        newTests[2] = { name: 'Spotify API', status: 'success', message: 'Spotify API credentials are valid' }
      } else {
        newTests[2] = { name: 'Spotify API', status: 'error', message: 'Spotify API test failed' }
      }
    } catch (error) {
      newTests[2] = { name: 'Spotify API', status: 'error', message: 'Spotify API test failed' }
    }

    setTests([...newTests])
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Test 4: Database Schema
    try {
      const response = await fetch('/api/test/database')
      if (response.ok) {
        newTests[3] = { name: 'Database Schema', status: 'success', message: 'Database schema is properly set up' }
      } else {
        newTests[3] = { name: 'Database Schema', status: 'error', message: 'Database schema test failed' }
      }
    } catch (error) {
      newTests[3] = { name: 'Database Schema', status: 'error', message: 'Database schema test failed' }
    }

    setTests([...newTests])
    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
      default:
        return <Loader className="h-5 w-5 text-gray-400 animate-spin" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-400 bg-green-400/10'
      case 'error':
        return 'border-red-400 bg-red-400/10'
      case 'warning':
        return 'border-yellow-400 bg-yellow-400/10'
      default:
        return 'border-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">System Test</h1>
          <p className="text-gray-300">Verify that all components are properly configured</p>
        </div>

        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Configuration Tests</h2>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="btn-primary flex items-center space-x-2"
            >
              {isRunning ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Running Tests...</span>
                </>
              ) : (
                <span>Run Tests</span>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {tests.map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <span className="text-white font-medium">{test.name}</span>
                  </div>
                  <span className={`text-sm ${
                    test.status === 'success' ? 'text-green-400' :
                    test.status === 'error' ? 'text-red-400' :
                    test.status === 'warning' ? 'text-yellow-400' :
                    'text-gray-400'
                  }`}>
                    {test.status === 'pending' ? 'Pending' :
                     test.status === 'success' ? 'Passed' :
                     test.status === 'error' ? 'Failed' :
                     'Warning'}
                  </span>
                </div>
                {test.message && (
                  <p className="text-sm text-gray-300 mt-2 ml-8">{test.message}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Setup Checklist</h3>
          <div className="space-y-2">
            {[
              'Create Spotify Developer App',
              'Set up Supabase project',
              'Run database schema',
              'Update environment variables',
              'Install dependencies',
              'Start development server'
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-gray-400 rounded"></div>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
