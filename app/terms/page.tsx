'use client'

import { motion } from 'framer-motion'
import { FileText, Users, Shield, AlertTriangle, XCircle, Mail, Calendar } from 'lucide-react'

export default function TermsOfService() {
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
            <FileText className="h-12 w-12 text-[#E98B8B] mr-4" />
            <h1 className="text-5xl font-bold text-[#f5f1e8] logo-font">Terms of Service</h1>
          </div>
          <p className="text-[#f5f1e8]/60 text-lg">
            Terms and conditions for using the Early Twenties Torture Fan Platform
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
          {/* Agreement */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6 flex items-center">
              <Users className="h-6 w-6 text-[#E98B8B] mr-3" />
              Agreement to Terms
            </h2>
            <p className="text-[#f5f1e8]/80 leading-relaxed mb-4">
              By accessing and using the Early Twenties Torture Fan Platform ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service ("Terms") govern your use of our fan engagement platform for Sadie Jean's music.
            </p>
            <p className="text-[#f5f1e8]/80 leading-relaxed">
              If you do not agree to abide by the above, please do not use this service. We reserve the right to modify these terms at any time without prior notice.
            </p>
          </div>

          {/* Platform Description */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Platform Description</h2>
            <p className="text-[#f5f1e8]/80 leading-relaxed mb-4">
              The Early Twenties Torture Fan Platform is a fan engagement platform that provides:
            </p>
            <ul className="list-disc list-inside text-[#f5f1e8]/80 space-y-2 ml-4">
              <li>Fan leaderboards based on Sadie Jean song listening activity</li>
              <li>Personal listening statistics and analytics</li>
              <li>User profiles with custom handles and bios</li>
              <li>Tour information and fan communications</li>
              <li>Integration with Spotify for music data access</li>
              <li>Profile photo uploads and customization</li>
            </ul>
          </div>

          {/* User Accounts */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">User Accounts</h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Account Creation</h4>
                <p className="text-[#f5f1e8]/80">
                  To use our platform, you must connect your Spotify account and create a user profile. You are responsible for maintaining the confidentiality of your account information.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Account Responsibility</h4>
                <p className="text-[#f5f1e8]/80">
                  You are responsible for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Profile Information</h4>
                <p className="text-[#f5f1e8]/80">
                  You may customize your profile with a custom handle, bio, and profile photo. All profile information must comply with our content guidelines.
                </p>
              </div>
            </div>
          </div>

          {/* Acceptable Use */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Acceptable Use Policy</h2>
            
            <div className="space-y-4">
              <div className="bg-[#282828] rounded-xl p-4">
                <h4 className="text-lg font-semibold text-[#E98B8B] mb-2">Permitted Uses</h4>
                <ul className="list-disc list-inside text-[#f5f1e8]/80 space-y-1 ml-4">
                  <li>Engaging with Sadie Jean's music and fan community</li>
                  <li>Creating and maintaining a personal fan profile</li>
                  <li>Participating in leaderboards and fan activities</li>
                  <li>Sharing appropriate fan content and interactions</li>
                </ul>
              </div>
              
              <div className="bg-[#282828] rounded-xl p-4">
                <h4 className="text-lg font-semibold text-[#E98B8B] mb-2">Prohibited Activities</h4>
                <ul className="list-disc list-inside text-[#f5f1e8]/80 space-y-1 ml-4">
                  <li>Creating fake accounts or using multiple accounts</li>
                  <li>Manipulating listening data or statistics</li>
                  <li>Sharing inappropriate, offensive, or harmful content</li>
                  <li>Violating any applicable laws or regulations</li>
                  <li>Attempting to hack or compromise the platform</li>
                  <li>Spamming or harassing other users</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6 flex items-center">
              <Shield className="h-6 w-6 text-[#E98B8B] mr-3" />
              Intellectual Property Rights
            </h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Sadie Jean's Music</h4>
                <p className="text-[#f5f1e8]/80">
                  All music, lyrics, album artwork, and related content belong to Sadie Jean and her respective rights holders. 
                  Our platform is a fan engagement tool and does not claim ownership of any musical content.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Platform Content</h4>
                <p className="text-[#f5f1e8]/80">
                  The platform design, code, and original content are owned by us. You may not copy, modify, or distribute 
                  our platform without permission.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">User Content</h4>
                <p className="text-[#f5f1e8]/80">
                  You retain ownership of content you create (profiles, comments, uploads), but grant us a license to use 
                  it for platform operation and fan engagement purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy and Data */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Privacy and Data Usage</h2>
            <p className="text-[#f5f1e8]/80 leading-relaxed mb-4">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, 
              which is incorporated into these Terms by reference.
            </p>
            <p className="text-[#f5f1e8]/80 leading-relaxed">
              By using our platform, you consent to the collection and use of your Spotify listening data, profile information, 
              and platform usage data as described in our Privacy Policy.
            </p>
          </div>

          {/* Third-Party Services */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Third-Party Services</h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Spotify Integration</h4>
                <p className="text-[#f5f1e8]/80">
                  Our platform integrates with Spotify's services. Your use of our platform is also subject to Spotify's Terms of Service 
                  and Privacy Policy. We are not responsible for Spotify's services or any issues arising from your Spotify account.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Laylo Integration</h4>
                <p className="text-[#f5f1e8]/80">
                  We may integrate with Laylo for fan communications and tour updates. Your participation in these services is voluntary 
                  and subject to Laylo's terms and conditions.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimers */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6 flex items-center">
              <AlertTriangle className="h-6 w-6 text-[#E98B8B] mr-3" />
              Disclaimers and Limitations
            </h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Service Availability</h4>
                <p className="text-[#f5f1e8]/80">
                  We strive to provide reliable service, but we cannot guarantee uninterrupted access. The platform may be temporarily 
                  unavailable for maintenance or technical issues.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Data Accuracy</h4>
                <p className="text-[#f5f1e8]/80">
                  While we strive for accuracy, listening data and statistics may not always be perfectly synchronized with Spotify's data. 
                  We are not responsible for discrepancies in music data.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Limitation of Liability</h4>
                <p className="text-[#f5f1e8]/80">
                  To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages arising from your use of the platform.
                </p>
              </div>
            </div>
          </div>

          {/* Account Termination */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6 flex items-center">
              <XCircle className="h-6 w-6 text-[#E98B8B] mr-3" />
              Account Termination
            </h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Termination by You</h4>
                <p className="text-[#f5f1e8]/80">
                  You may terminate your account at any time by disconnecting your Spotify account or contacting us. 
                  Upon termination, we will delete your personal data as described in our Privacy Policy.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Termination by Us</h4>
                <p className="text-[#f5f1e8]/80">
                  We may suspend or terminate your account if you violate these Terms, engage in prohibited activities, 
                  or for any other reason at our discretion.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-[#f5f1e8] mb-2">Effect of Termination</h4>
                <p className="text-[#f5f1e8]/80">
                  Upon termination, your right to use the platform ceases immediately. We may delete your account data, 
                  though some information may be retained for legal or operational purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6">Governing Law</h2>
            <p className="text-[#f5f1e8]/80 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to 
              conflict of law principles. Any disputes arising from these Terms or your use of the platform shall be resolved 
              through binding arbitration.
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6 flex items-center">
              <Mail className="h-6 w-6 text-[#E98B8B] mr-3" />
              Contact Information
            </h2>
            <p className="text-[#f5f1e8]/80 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-[#282828] rounded-xl p-4">
              <p className="text-[#f5f1e8]/80">
                <strong>Email:</strong> legal@earlytwentiestorture.com
              </p>
              <p className="text-[#f5f1e8]/80 mt-2">
                <strong>For general inquiries:</strong> support@earlytwentiestorture.com
              </p>
            </div>
          </div>

          {/* Updates */}
          <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-[#E98B8B]/20">
            <h2 className="text-2xl font-bold text-[#f5f1e8] mb-6 flex items-center">
              <Calendar className="h-6 w-6 text-[#E98B8B] mr-3" />
              Changes to Terms
            </h2>
            <p className="text-[#f5f1e8]/80 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting 
              the updated Terms on this page and updating the "Last updated" date. Your continued use of the platform after 
              such changes constitutes acceptance of the new Terms.
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
            These Terms of Service are effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
