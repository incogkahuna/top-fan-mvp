'use client'

import { motion } from 'framer-motion'
import { Shield, Eye, Lock, Trash2, Mail, Calendar } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-16 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-[#E98B8B] mr-4" />
            <h1 className="text-5xl font-bold text-[#f5f1e8] logo-font">Privacy Policy</h1>
          </div>
          <p className="text-[#f5f1e8]/60 text-lg">
            How we collect, use, and protect your data on the Early Twenties Torture Fan Platform
          </p>
          <p className="text-[#f5f1e8]/40 text-sm mt-2">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Introduction */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-4 flex items-center">
              <Eye className="h-6 w-6 text-[#E98B8B] mr-3" />
              Introduction
            </h2>
            <p className="text-[#f5f1e8]/80 leading-relaxed">
              The Early Twenties Torture Fan Platform ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
              our fan engagement platform for Sadie Jean's music.
            </p>
            <p className="text-[#f5f1e8]/80 leading-relaxed mt-4">
              By using our platform, you consent to the data practices described in this policy. If you do not agree 
              with the terms of this Privacy Policy, please do not access or use our platform.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6 flex items-center">
              <Lock className="h-6 w-6 text-[#E98B8B] mr-3" />
              Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#f5f1e8] mb-3">Spotify Data</h3>
                <p className="text-[#f5f1e8]/80 leading-relaxed mb-3">
                  When you connect your Spotify account, we collect the following information with your explicit consent:
                </p>
                <ul className="list-disc list-inside text-[#f5f1e8]/80 space-y-2 ml-4">
                  <li><strong>Profile Information:</strong> Display name, email address, profile image</li>
                  <li><strong>Listening Data:</strong> Recently played tracks, listening history, play counts</li>
                  <li><strong>Music Preferences:</strong> Track names, artist names, album information</li>
                  <li><strong>Access Tokens:</strong> Secure tokens for accessing your Spotify data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#f5f1e8] mb-3">User-Generated Content</h3>
                <ul className="list-disc list-inside text-[#f5f1e8]/80 space-y-2 ml-4">
                  <li><strong>Profile Data:</strong> Custom handles, bio, privacy settings</li>
                  <li><strong>Uploads:</strong> Profile photos you choose to upload</li>
                  <li><strong>Preferences:</strong> Privacy settings and account preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[#f5f1e8] mb-3">Technical Data</h3>
                <ul className="list-disc list-inside text-[#f5f1e8]/80 space-y-2 ml-4">
                  <li><strong>Usage Analytics:</strong> How you interact with our platform</li>
                  <li><strong>Device Information:</strong> Browser type, device type, operating system</li>
                  <li><strong>Log Data:</strong> IP address, access times, pages visited</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">How We Use Your Information</h2>
            
            <div className="space-y-4">
              <div className="bg-[#282828] rounded-xl p-4">
                <h4 className="text-lg font-semibold text-[#E98B8B] mb-2">Fan Engagement</h4>
                <p className="text-[#f5f1e8]/80">
                  Create personalized leaderboards, track listening statistics, and provide fan rankings based on Sadie Jean song plays.
                </p>
              </div>
              
              <div className="bg-[#282828] rounded-xl p-4">
                <h4 className="text-lg font-semibold text-[#E98B8B] mb-2">Platform Functionality</h4>
                <p className="text-[#f5f1e8]/80">
                  Enable profile creation, custom handle assignment, and personalized fan experiences.
                </p>
              </div>
              
              <div className="bg-[#282828] rounded-xl p-4">
                <h4 className="text-lg font-semibold text-[#E98B8B] mb-2">Communication</h4>
                <p className="text-[#f5f1e8]/80">
                  Send tour updates, fan communications, and platform notifications through integrated services like Laylo.
                </p>
              </div>
              
              <div className="bg-[#282828] rounded-xl p-4">
                <h4 className="text-lg font-semibold text-[#E98B8B] mb-2">Analytics & Improvement</h4>
                <p className="text-[#f5f1e8]/80">
                  Analyze platform usage to improve user experience and develop new features.
                </p>
              </div>
            </div>
          </div>

          {/* Data Storage & Security */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Data Storage & Security</h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Database Storage</h4>
                <p className="text-[#f5f1e8]/80">
                  Your data is securely stored in Supabase, a SOC 2 compliant database service. We use Row Level Security (RLS) 
                  to ensure data access is properly restricted.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Encryption</h4>
                <p className="text-[#f5f1e8]/80">
                  All data is encrypted in transit and at rest. Spotify access tokens are securely stored and automatically 
                  refreshed when needed.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Access Control</h4>
                <p className="text-[#f5f1e8]/80">
                  Only authorized personnel have access to user data, and access is logged and monitored.
                </p>
              </div>
            </div>
          </div>

          {/* Third-Party Services */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Third-Party Services</h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Spotify</h4>
                <p className="text-[#f5f1e8]/80">
                  We integrate with Spotify's Web API to access your listening data. Your use of our platform is also 
                  subject to Spotify's Terms of Service and Privacy Policy.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Laylo</h4>
                <p className="text-[#f5f1e8]/80">
                  We may share your contact information with Laylo for fan communications and tour updates. You can opt-out 
                  of these communications at any time.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Supabase</h4>
                <p className="text-[#f5f1e8]/80">
                  We use Supabase for data storage and authentication. Their privacy policy applies to data processing.
                </p>
              </div>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6 flex items-center">
              <Trash2 className="h-6 w-6 text-[#E98B8B] mr-3" />
              Your Rights
            </h2>
            
            <div className="space-y-4">
              <div className="bg-[#282828] rounded-xl p-4">
                <h4 className="text-lg font-semibold text-[#E98B8B] mb-2">Access & Portability</h4>
                <p className="text-[#f5f1e8]/80">
                  You can request a copy of all data we have about you at any time.
                </p>
              </div>
              
              <div className="bg-[#282828] rounded-xl p-4">
                <h4 className="text-lg font-semibold text-[#E98B8B] mb-2">Correction</h4>
                <p className="text-[#f5f1e8]/80">
                  You can update your profile information, custom handle, and bio at any time through your profile settings.
                </p>
              </div>
              
              <div className="bg-[#282828] rounded-xl p-4">
                <h4 className="text-lg font-semibold text-[#E98B8B] mb-2">Deletion</h4>
                <p className="text-[#f5f1e8]/80">
                  You can request deletion of your account and all associated data. We will process deletion requests within 30 days.
                </p>
              </div>
              
              <div className="bg-[#282828] rounded-xl p-4">
                <h4 className="text-lg font-semibold text-[#E98B8B] mb-2">Withdrawal of Consent</h4>
                <p className="text-[#f5f1e8]/80">
                  You can disconnect your Spotify account at any time, which will stop data collection from Spotify.
                </p>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Data Retention</h2>
            <p className="text-[#f5f1e8]/80 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide you services. 
              If you delete your account, we will delete your personal information within 30 days, except where we are required 
              to retain it for legal compliance or legitimate business purposes.
            </p>
          </div>

          {/* Children's Privacy */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Children's Privacy</h2>
            <p className="text-[#f5f1e8]/80 leading-relaxed">
              Our platform is not intended for children under 13 years of age. We do not knowingly collect personal information 
              from children under 13. If we become aware that we have collected personal information from a child under 13, 
              we will take steps to delete such information.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6 flex items-center">
              <Mail className="h-6 w-6 text-[#E98B8B] mr-3" />
              Contact Us
            </h2>
            <p className="text-[#f5f1e8]/80 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-[#282828] rounded-xl p-4">
              <p className="text-[#f5f1e8]/80">
                <strong>Email:</strong> privacy@earlytwentiestorture.com
              </p>
              <p className="text-[#f5f1e8]/80 mt-2">
                <strong>For data requests:</strong> data@earlytwentiestorture.com
              </p>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6 flex items-center">
              <Calendar className="h-6 w-6 text-[#E98B8B] mr-3" />
              Policy Updates
            </h2>
            <p className="text-[#f5f1e8]/80 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy 
              periodically for any changes.
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-12 pt-8 border-t border-[#E98B8B]/20"
        >
          <p className="text-[#f5f1e8]/60">
            This Privacy Policy is effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
