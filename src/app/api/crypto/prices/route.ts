import { NextResponse } from 'next/server'

interface PriceData {
  [coinId: string]: {
    usd: number
    usd_24h_change?: number
  }
}

const COIN_IDS_MAP = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'LTC': 'litecoin',
  'USDT': 'tether',
  'USDT (TRC20)': 'tether',
  'TRX': 'tron',
  'XRP': 'ripple',
  'SOL': 'solana',
  'DOGE': 'dogecoin',
  'ADA': 'cardano'
} as const

// Server-side cache implementation
interface CacheData {
  rates: { [key: string]: number }
  prices: Array<{ symbol: string; price: number; change: number }>
  timestamp: number
  source: string
  stale?: boolean
}

let priceCache: { data: CacheData; timestamp: number } | null = null
const CACHE_DURATION = 30000 // 30 seconds cache

async function fetchWithTimeout(url: string, timeout = 8000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CryptoDesk/1.0'
      },
      next: { revalidate: 30 } // Next.js cache for 30 seconds
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

async function fetchFromMultipleSources(ids: string): Promise<PriceData | null> {
  // Try multiple API endpoints in order of preference
  const endpoints = [
    {
      name: 'CoinGecko',
      url: `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      parser: (data: PriceData) => data
    },
    {
      name: 'CoinGecko Demo',
      url: `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&x_cg_demo_api_key=CG-demo`,
      parser: (data: PriceData) => data
    },
    {
      name: 'Binance',
      url: 'https://api.binance.com/api/v3/ticker/24hr',
      parser: (data: Array<{ symbol: string; lastPrice: string; priceChangePercent: string }>) => {
        // Map Binance symbols to our format
        const symbolMap: Record<string, string> = {
          'BTCUSDT': 'bitcoin',
          'ETHUSDT': 'ethereum',
          'LTCUSDT': 'litecoin',
          'USDTUSDT': 'tether',
          'TRXUSDT': 'tron',
          'XRPUSDT': 'ripple',
          'SOLUSDT': 'solana',
          'DOGEUSDT': 'dogecoin',
          'ADAUSDT': 'cardano'
        }
        
        const result: PriceData = {}
        if (Array.isArray(data)) {
          data.forEach((ticker) => {
            const coinId = symbolMap[ticker.symbol]
            if (coinId) {
              result[coinId] = {
                usd: parseFloat(ticker.lastPrice),
                usd_24h_change: parseFloat(ticker.priceChangePercent)
              }
            }
          })
        }
        return result
      }
    },
    {
      name: 'CoinCap',
      url: 'https://api.coincap.io/v2/assets?limit=100',
      parser: (data: { data?: Array<{ id: string; priceUsd: string; changePercent24Hr: string }> }) => {
        const nameMap: Record<string, string> = {
          'bitcoin': 'bitcoin',
          'ethereum': 'ethereum',
          'litecoin': 'litecoin',
          'tether': 'tether',
          'tron': 'tron',
          'xrp': 'ripple',
          'solana': 'solana',
          'dogecoin': 'dogecoin',
          'cardano': 'cardano'
        }
        
        const result: PriceData = {}
        if (data?.data && Array.isArray(data.data)) {
          data.data.forEach((asset) => {
            const coinId = nameMap[asset.id]
            if (coinId) {
              result[coinId] = {
                usd: parseFloat(asset.priceUsd),
                usd_24h_change: parseFloat(asset.changePercent24Hr)
              }
            }
          })
        }
        return result
      }
    },
    {
      name: 'Coinbase',
      url: 'https://api.coinbase.com/v2/exchange-rates?currency=USD',
      parser: (data: { data?: { rates?: { [key: string]: string } } }) => {
        const result: PriceData = {}
        if (data?.data?.rates) {
          const rates = data.data.rates
          // Coinbase provides inverse rates (USD to crypto)
          if (rates.BTC) result.bitcoin = { usd: 1 / parseFloat(rates.BTC), usd_24h_change: 0 }
          if (rates.ETH) result.ethereum = { usd: 1 / parseFloat(rates.ETH), usd_24h_change: 0 }
          if (rates.LTC) result.litecoin = { usd: 1 / parseFloat(rates.LTC), usd_24h_change: 0 }
          if (rates.USDT) result.tether = { usd: 1 / parseFloat(rates.USDT), usd_24h_change: 0 }
          if (rates.TRX) result.tron = { usd: 1 / parseFloat(rates.TRX), usd_24h_change: 0 }
          if (rates.XRP) result.ripple = { usd: 1 / parseFloat(rates.XRP), usd_24h_change: 0 }
          if (rates.SOL) result.solana = { usd: 1 / parseFloat(rates.SOL), usd_24h_change: 0 }
          if (rates.DOGE) result.dogecoin = { usd: 1 / parseFloat(rates.DOGE), usd_24h_change: 0 }
          if (rates.ADA) result.cardano = { usd: 1 / parseFloat(rates.ADA), usd_24h_change: 0 }
        }
        return result
      }
    }
  ]
  
  // Try each endpoint until one succeeds
  for (const endpoint of endpoints) {
    try {
      // Trying endpoint
      const response = await fetchWithTimeout(endpoint.url)
      
      if (response.ok) {
        const data = await response.json()
        const parsed = endpoint.parser(data)
        
        // Validate we got some data
        if (parsed && Object.keys(parsed).length > 0) {
          // Successfully fetched data
          return parsed
        }
      }
    } catch {
      // Failed to fetch from endpoint
      continue
    }
  }
  
  return null
}

export async function GET() {
  try {
    // Check cache first
    if (priceCache && Date.now() - priceCache.timestamp < CACHE_DURATION) {
      // Returning cached prices
      return NextResponse.json(priceCache.data)
    }
    
    // Get unique coin IDs for APIs that need them
    const uniqueIds = Array.from(new Set(Object.values(COIN_IDS_MAP))).join(',')
    
    // Try to fetch fresh data from multiple sources
    const priceData = await fetchFromMultipleSources(uniqueIds)
    
    if (!priceData || Object.keys(priceData).length === 0) {
      // If all APIs fail but we have old cache, return it
      if (priceCache) {
        // All APIs failed, returning stale cache
        return NextResponse.json({
          ...priceCache.data,
          stale: true
        })
      }
      
      // No data available at all
      return NextResponse.json({
        error: 'Unable to fetch prices',
        rates: {},
        prices: []
      }, { status: 503 })
    }
    
    // Transform data to our format
    const result: { [key: string]: number } = {}
    const pricesWithChange: Array<{ symbol: string; price: number; change: number }> = []
    
    Object.entries(COIN_IDS_MAP).forEach(([symbol, coinId]) => {
      if (priceData[coinId]) {
        result[symbol] = priceData[coinId].usd
        pricesWithChange.push({
          symbol,
          price: priceData[coinId].usd,
          change: priceData[coinId].usd_24h_change || 0
        })
      }
    })
    
    const responseData = {
      rates: result,
      prices: pricesWithChange,
      timestamp: Date.now(),
      source: 'live'
    }
    
    // Update cache
    priceCache = {
      data: responseData,
      timestamp: Date.now()
    }
    
    return NextResponse.json(responseData)
  } catch {
    // Error in crypto prices API
    
    // Return cached data if available
    if (priceCache) {
      return NextResponse.json({
        ...priceCache.data,
        stale: true
      })
    }
    
    return NextResponse.json({
      error: 'Service temporarily unavailable',
      rates: {},
      prices: []
    }, { status: 503 })
  }
}