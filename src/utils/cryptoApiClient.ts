interface ExchangeRates {
  [key: string]: number
}

const COIN_IDS_MAP = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'LTC': 'litecoin',
  'USDT': 'tether',
  'USDT (ERC-20)': 'tether',
  'USDT (TRC20)': 'tether',
  'TRX': 'tron',
  'XRP': 'ripple',
  'SOL': 'solana',
  'DOGE': 'dogecoin',
  'ADA': 'cardano'
} as const

class CryptoApiClient {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 15000 // 15 seconds cache
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 1000 // 1 second initial delay
  private isRetrying = false

  async fetchWithTimeout(url: string, timeout = 5000): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  async fetchWithRetry(
    url: string, 
    retries = this.MAX_RETRIES, 
    delay = this.RETRY_DELAY
  ): Promise<Response | null> {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await this.fetchWithTimeout(url)
        if (response.ok) {
          return response
        }
        // If we get a 503, retry immediately as server might be warming up
        if (response.status === 503 && i < retries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
          continue
        }
        return response // Return even if not ok to handle errors properly
      } catch {
        if (i < retries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
        }
      }
    }
    return null
  }

  getCachedData<T>(cacheKey: string): T | null {
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T
    }
    return null
  }

  setCachedData(cacheKey: string, data: unknown): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    })
  }

  async fetchExchangeRates(): Promise<ExchangeRates> {
    const cacheKey = 'exchange-rates'
    
    // Check cache first
    const cachedData = this.getCachedData<ExchangeRates>(cacheKey)
    if (cachedData) {
      return cachedData
    }

    // Prevent multiple simultaneous retries
    if (this.isRetrying) {
      // Return last known data from cache even if expired
      const expiredCache = this.cache.get(cacheKey)
      return (expiredCache?.data as ExchangeRates) || {}
    }

    this.isRetrying = true

    try {
      // Always use server-side API
      const response = await this.fetchWithRetry('/api/crypto/prices')
      
      if (response) {
        const data = await response.json()
        
        if (data.rates && Object.keys(data.rates).length > 0) {
          this.setCachedData(cacheKey, data.rates)
          this.isRetrying = false
          return data.rates
        }
        
        // If API returned but with no data, return stale cache if available
        if (data.stale && data.rates) {
          this.isRetrying = false
          return data.rates
        }
      }
    } catch {
      // Failed to fetch exchange rates
    } finally {
      this.isRetrying = false
    }

    // Return last known data from cache even if expired
    const expiredCache = this.cache.get(cacheKey)
    return (expiredCache?.data as ExchangeRates) || {}
  }

  async fetchCryptoPrices(): Promise<Array<{
    symbol: string
    price: number
    change: number
  }>> {
    const cacheKey = 'crypto-prices'
    
    // Check cache first
    const cachedData = this.getCachedData<Array<{ symbol: string; price: number; change: number }>>(cacheKey)
    if (cachedData) {
      return cachedData
    }

    // Prevent multiple simultaneous retries
    if (this.isRetrying) {
      // Return last known data from cache even if expired
      const expiredCache = this.cache.get(cacheKey)
      return (expiredCache?.data as Array<{ symbol: string; price: number; change: number }>) || []
    }

    this.isRetrying = true

    try {
      // Always use server-side API
      const response = await this.fetchWithRetry('/api/crypto/prices')
      
      if (response) {
        const data = await response.json()
        
        if (data.prices && data.prices.length > 0) {
          this.setCachedData(cacheKey, data.prices)
          this.isRetrying = false
          return data.prices
        }
        
        // If API returned but with stale data, use it
        if (data.stale && data.prices) {
          this.isRetrying = false
          return data.prices
        }
      }
    } catch {
      // Failed to fetch crypto prices
    } finally {
      this.isRetrying = false
    }

    // Return last known data from cache even if expired
    const expiredCache = this.cache.get(cacheKey)
    return (expiredCache?.data as Array<{ symbol: string; price: number; change: number }>) || []
  }
}

// Export singleton instance
export const cryptoApiClient = new CryptoApiClient()
export { COIN_IDS_MAP }