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
  metadataBase: new URL('https://cryptbuy.top'),
  title: {
    default: 'Sell Crypto with 15% Profit Bonus | Crypulse - Best Cryptocurrency Exchange',
    template: '%s | Crypulse - Sell Crypto with 15% Profit Bonus'
  },
  description: 'Sell Bitcoin, Ethereum, USDT and get instant 15% profit bonus! Best crypto selling platform with instant USD payouts. Sell BTC, ETH, LTC, SOL, DOGE, ADA, XRP with guaranteed 15% extra profit. Fast, secure, and profitable cryptocurrency exchange.',
  keywords: [
    'sell cryptocurrency 15% profit',
    'sell bitcoin profit bonus',
    'sell crypto instant payout',
    'cryptocurrency selling platform',
    'sell BTC 15% bonus',
    'sell ethereum profit',
    'best crypto exchange profit',
    'sell USDT profit bonus',
    'instant crypto to USD',
    'sell bitcoin fast payout',
    'sell cryptocurrency with profit',
    '15% crypto profit bonus',
    'sell litecoin bonus',
    'sell solana profit',
    'sell dogecoin bonus',
    'cryptocurrency exchange bonus',
    'crypto cashout profit',
    'sell bitcoin highest rate',
    'sell ethereum best price',
    'crypto selling with bonus'
  ],
  authors: [{ name: 'Crypulse' }],
  creator: 'Crypulse',
  publisher: 'Crypulse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cryptbuy.top',
    siteName: 'Crypulse',
    title: 'Sell Crypto with 15% Profit Bonus | Best Cryptocurrency Exchange',
    description: 'Get instant 15% profit bonus when you sell Bitcoin, Ethereum, USDT and other cryptocurrencies. Fast USD payouts, highest rates, secure platform. Sell BTC, ETH, LTC, SOL with guaranteed profit!',
    images: [
      {
        url: 'https://cryptbuy.top/icons/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Crypulse - Sell Crypto with 15% Profit Bonus',
        type: 'image/png'
      },
      {
        url: 'https://cryptbuy.top/icons/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Crypulse Logo',
        type: 'image/svg+xml'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sell Crypto with 15% Profit Bonus | Crypulse',
    description: 'Get instant 15% profit bonus when selling Bitcoin, Ethereum, USDT. Fast payouts, highest rates, secure platform.',
    images: ['https://cryptbuy.top/icons/android-chrome-512x512.png'],
    creator: '@crypulse',
    site: '@crypulse'
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://cryptbuy.top',
  },
  category: 'finance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // JSON-LD structured data for SEO - Organization and Website
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Crypulse',
    alternateName: 'Crypulse Crypto Exchange',
    url: 'https://cryptbuy.top',
    logo: 'https://cryptbuy.top/icons/logo.svg',
    description: 'Leading cryptocurrency exchange offering 15% profit bonus on crypto sales',
    sameAs: [
      'https://twitter.com/crypulse',
      'https://facebook.com/crypulse',
      'https://linkedin.com/company/crypulse'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English'],
      areaServed: 'Worldwide'
    }
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Crypulse',
    url: 'https://cryptbuy.top',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://cryptbuy.top/?s={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const financialServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'Crypulse',
    description: 'Sell Bitcoin, Ethereum, USDT and get instant 15% profit bonus! Best crypto selling platform with instant USD payouts.',
    url: 'https://cryptbuy.top',
    logo: 'https://cryptbuy.top/icons/logo.svg',
    image: 'https://cryptbuy.top/icons/android-chrome-512x512.png',
    telephone: '+1-800-CRYPTO',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US'
    },
    sameAs: [
      'https://twitter.com/crypulse',
      'https://facebook.com/crypulse',
      'https://linkedin.com/company/crypulse'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1250',
      bestRating: '5',
      worstRating: '1'
    },
    serviceType: 'Cryptocurrency Exchange',
    areaServed: {
      '@type': 'Country',
      name: 'Worldwide'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Cryptocurrency Trading Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sell Cryptocurrency with 15% Profit Bonus',
            description: 'Sell Bitcoin, Ethereum, USDT and other cryptocurrencies with an instant 15% profit bonus on top of market rates'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Instant USD Payouts',
            description: 'Fast and secure USD payouts directly to your bank account'
          }
        }
      ]
    }
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://cryptbuy.top'
      }
    ]
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <LanguageProvider>
          {children}
          <LiveChat />
        </LanguageProvider>
      </body>
    </html>
  )
}