'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface CryptoData {
  symbol: string
  name: string
  price: string
  change: number
  icon: string
  color: string
}

const cryptoData: CryptoData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '$67,890.12',
    change: 2.35,
    icon: '₿',
    color: 'orange'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '$3,750.45',
    change: 1.80,
    icon: 'Ξ',
    color: 'purple'
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    price: '$1.00',
    change: -0.01,
    icon: '₮',
    color: 'green'
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    price: '$610.70',
    change: 0.55,
    icon: 'BNB',
    color: 'yellow'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: '$165.20',
    change: -1.10,
    icon: 'SOL',
    color: 'purple'
  }
]

export default function CryptoList() {
  const [prices, setPrices] = useState(cryptoData)
  const [animateIndex, setAnimateIndex] = useState(-1)

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map((crypto, index) => {
        const variance = Math.random() * 2 - 1 // -1 to 1
        const newChange = crypto.change + variance * 0.1
        
        // Random animation trigger
        if (Math.random() > 0.8) {
          setAnimateIndex(index)
          setTimeout(() => setAnimateIndex(-1), 500)
        }
        
        return {
          ...crypto,
          change: newChange
        }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getIconBg = (color: string) => {
    const bgColors = {
      orange: 'bg-orange-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
    }
    return bgColors[color as keyof typeof bgColors] || 'bg-gray-500'
  }

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Wide Range of Cryptocurrencies
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Explore and invest in popular digital assets. Find your next opportunity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
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
                <div className={`w-10 h-10 ${getIconBg(crypto.color)} rounded-full flex items-center justify-center text-white font-bold`}>
                  {crypto.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{crypto.name}</h3>
                  <p className="text-sm text-gray-500">{crypto.symbol}</p>
                </div>
              </div>

              {/* Price and Change */}
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{crypto.price}</p>
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
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link 
            href="/cryptocurrencies"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            View All Cryptocurrencies
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}