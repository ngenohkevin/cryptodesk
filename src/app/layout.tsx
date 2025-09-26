import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import './mobile-fixes.css'
import LiveChat from '@/components/common/LiveChat'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: 'Crypulse | Buy & Sell Crypto Instantly',
  description: 'Securely buy, sell, and manage your crypto assets. Crypulse offers fast transactions, top-tier security, and 24/7 support for Bitcoin, Ethereum, Tether, and more.',
  keywords: 'cryptocurrency,crypto,buy bitcoin,sell bitcoin,ethereum,tether,litecoin,crypulse,digital assets,blockchain,crypto exchange',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    other: [
      { url: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  openGraph: {
    title: 'Crypulse | Buy & Sell Crypto Instantly',
    description: 'Securely buy, sell, and manage your crypto assets. Crypulse offers fast transactions, top-tier security, and 24/7 support for Bitcoin, Ethereum, Tether, and more.',
    type: 'website',
    siteName: 'Crypulse',
    images: [
      { url: '/icons/logo.svg', width: 64, height: 64, alt: 'Crypulse Logo' }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <LanguageProvider>
          {children}
          <LiveChat />
        </LanguageProvider>
      </body>
    </html>
  )
}