import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LiveChat from '@/components/common/LiveChat'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CryptoDesk | Buy & Sell Crypto Instantly',
  description: 'Securely buy, sell, and manage your crypto assets. CryptoDesk offers fast transactions, top-tier security, and 24/7 support for Bitcoin, Ethereum, Tether, and more.',
  keywords: 'cryptocurrency,crypto,buy bitcoin,sell bitcoin,ethereum,tether,litecoin,cryptodesk,digital assets,blockchain,crypto exchange',
  openGraph: {
    title: 'CryptoDesk | Buy & Sell Crypto Instantly',
    description: 'Securely buy, sell, and manage your crypto assets. CryptoDesk offers fast transactions, top-tier security, and 24/7 support for Bitcoin, Ethereum, Tether, and more.',
    type: 'website',
    siteName: 'CryptoDesk'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <LiveChat />
      </body>
    </html>
  )
}