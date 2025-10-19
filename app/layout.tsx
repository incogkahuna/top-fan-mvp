import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://earlytwentiestorture.com'),
  title: 'Sadie Jean Early Twenties Torture Fan Platform',
  description: 'Join the fan community for Sadie Jean\'s Early Twenties Torture tour. Track your listening stats, compete on leaderboards, connect with other fans, and stay updated on tour dates.',
  keywords: [
    'Sadie Jean',
    'Early Twenties Torture',
    'fan community',
    'music leaderboard',
    'Spotify integration',
    'listening stats',
    'fan platform',
    'music analytics',
    'tour dates',
    'fan engagement'
  ],
  authors: [{ name: 'Sadie Jean Fan Platform' }],
  creator: 'Sadie Jean Fan Platform',
  publisher: 'Sadie Jean Fan Platform',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://earlytwentiestorture.com',
    title: 'Sadie Jean Early Twenties Torture Fan Platform',
    description: 'Join the fan community for Sadie Jean\'s Early Twenties Torture tour. Track your listening stats, compete on leaderboards, and connect with other fans.',
    siteName: 'Sadie Jean Early Twenties Torture Fan Platform',
    images: [
      {
        url: '/album-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Sadie Jean Early Twenties Torture Album Cover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sadie Jean Early Twenties Torture Fan Platform',
    description: 'Join the fan community for Sadie Jean\'s Early Twenties Torture tour. Track your listening stats, compete on leaderboards, and connect with other fans.',
    images: ['/album-cover.jpg'],
  },
  verification: {
    google: 'your-google-verification-code', // Add your actual verification code
  },
  alternates: {
    canonical: 'https://earlytwentiestorture.com',
  },
  other: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Anton:wght@400&family=Special+Elite&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="min-h-screen">
            <Navigation />
            {children}
          </div>
        </ErrorBoundary>
      </body>
    </html>
  )
}
