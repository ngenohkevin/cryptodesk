'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface CryptoData {
  symbol: string
  name: string
  price: number
  change: number
  icon: string
  color: string
}

const initialCryptoData: CryptoData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 0,
    change: 0,
    icon: '/images/bitcoin-btc-logo.png',
    color: 'orange'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 0,
    change: 0,
    icon: '/images/ethereum-logo.png',
    color: 'blue'
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    price: 0,
    change: 0,
    icon: '/images/litecoin-ltc-logo.png',
    color: 'gray'
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    price: 0,
    change: 0,
    icon: '/images/tether-usdt-logo.png',
    color: 'green'
  },
  {
    symbol: 'TRX',
    name: 'TRON',
    price: 0,
    change: 0,
    icon: '/images/tron-trx-logo.png',
    color: 'red'
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    price: 0,
    change: 0,
    icon: '/images/xrp-xrp-logo.png',
    color: 'blue'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 0,
    change: 0,
    icon: '/images/solana-sol-logo.png',
    color: 'purple'
  },
  {
    symbol: 'DOGE',
    name: 'Dogecoin',
    price: 0,
    change: 0,
    icon: '/images/dogecoin-doge-logo.png',
    color: 'yellow'
  }
]

export default function CryptoList() {
  const { t } = useLanguage()
  const [prices, setPrices] = useState(initialCryptoData)
  const [animateIndex, setAnimateIndex] = useState(-1)
  const [loading, setLoading] = useState(true)

  // Fetch real-time prices from CoinGecko
  const fetchCryptoPrices = async () => {
    try {
      const coinIds = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'LTC': 'litecoin',
        'USDT': 'tether',
        'TRX': 'tron',
        'XRP': 'ripple',
        'SOL': 'solana',
        'DOGE': 'dogecoin'
      }
      
      const ids = Object.values(coinIds).join(',')
      const response = await fetch(
        `https://corsproxy.io/?https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
      )
      
      if (response.ok) {
        const data = await response.json()
        
        setPrices(prev => prev.map(crypto => {
          const coinId = coinIds[crypto.symbol as keyof typeof coinIds]
          if (data[coinId]) {
            return {
              ...crypto,
              price: data[coinId].usd,
              change: data[coinId].usd_24h_change || 0
            }
          }
          return crypto
        }))
      }
    } catch {
      // Error fetching crypto prices
    } finally {
      setLoading(false)
    }
  }

  // Fetch prices on mount and every 30 seconds
  useEffect(() => {
    fetchCryptoPrices()
    const interval = setInterval(fetchCryptoPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  // Animation trigger
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const randomIndex = Math.floor(Math.random() * prices.length)
        setAnimateIndex(randomIndex)
        setTimeout(() => setAnimateIndex(-1), 500)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [prices.length])


  const formatPrice = (price: number) => {
    if (price === 0 && loading) return t('common.loading')
    if (price >= 1) {
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return `$${price.toFixed(4)}`
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t('cryptoList.title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('cryptoList.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {prices.map((crypto, index) => (
            <div
              key={crypto.symbol}
              className={`
                bg-white rounded-2xl p-6 border border-gray-100 
                hover:shadow-xl hover:border-primary-200 
                transition-all duration-300 transform hover:-translate-y-1
                ${animateIndex === index ? 'animate-pulse-slow' : ''}
              `}
            >
              {/* Header with Icon and Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full p-1.5 bg-white shadow-sm border border-gray-100">
                  <img 
                    src={crypto.icon} 
                    alt={`${crypto.name} logo`}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{crypto.name}</h3>
                  <p className="text-sm text-gray-500">{crypto.symbol}</p>
                </div>
              </div>

              {/* Price and Change */}
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{formatPrice(crypto.price)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {crypto.change >= 0 ? (
                      <>
                        <span className="text-green-600 font-semibold text-sm">
                          +{crypto.change.toFixed(2)}%
                        </span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </>
                    ) : (
                      <>
                        <span className="text-red-600 font-semibold text-sm">
                          {crypto.change.toFixed(2)}%
                        </span>
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      </>
                    )}
                  </div>
                </div>

                {/* Buy Button */}
                <Link 
                  href="/#buy-crypto"
                  className="block w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold py-2.5 rounded-xl text-center transition-all duration-300 transform hover:scale-105"
                >
                  {t('header.buyNow')}
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}