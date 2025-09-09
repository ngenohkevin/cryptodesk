'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowDownUp, ChevronDown } from 'lucide-react'

export default function BuySellWidget() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [fromAmount, setFromAmount] = useState('100')
  const [toAmount, setToAmount] = useState('0')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('BTC')
  const [dropdownOpen, setDropdownOpen] = useState<'from' | 'to' | null>(null)
  const [dropdownExpanded, setDropdownExpanded] = useState<'from' | 'to' | null>(null)

  const cryptoCurrencies = [
    { code: 'BTC', name: 'Bitcoin', color: 'orange' },
    { code: 'ETH', name: 'Ethereum', color: 'blue' },
    { code: 'LTC', name: 'Litecoin', color: 'gray' },
    { code: 'USDT', name: 'Tether', color: 'green' },
    { code: 'USDT (TRC20)', name: 'Tether TRC20', color: 'green' },
    { code: 'TRX', name: 'TRON', color: 'red' },
    { code: 'XRP', name: 'Ripple', color: 'blue' },
    { code: 'SOL', name: 'Solana', color: 'purple' },
    { code: 'DOGE', name: 'Dogecoin', color: 'yellow' },
    { code: 'ADA', name: 'Cardano', color: 'blue' },
  ]

  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch real-time exchange rates from CoinGecko API
  const fetchExchangeRates = async () => {
    setLoading(true)
    try {
      // Map our crypto codes to CoinGecko IDs
      const coinIds = {
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
      }
      
      const ids = Object.values(coinIds).filter((v, i, a) => a.indexOf(v) === i).join(',')
      const response = await fetch(
        `https://corsproxy.io/?https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      )
      
      if (response.ok) {
        const data = await response.json()
        const rates: Record<string, number> = {}
        
        Object.entries(coinIds).forEach(([symbol, coinId]) => {
          if (data[coinId]?.usd) {
            rates[symbol] = data[coinId].usd
          }
        })
        
        setExchangeRates(rates)
      }
    } catch {
      // Error fetching exchange rates
    } finally {
      setLoading(false)
    }
  }

  // Fetch exchange rates on component mount and every 30 seconds
  useEffect(() => {
    fetchExchangeRates()
    const interval = setInterval(fetchExchangeRates, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Set currencies and default amounts based on mode
    if (mode === 'buy') {
      setFromCurrency('USD')
      setFromAmount('100') // Default $100 for buy mode
      if (toCurrency === 'USD') setToCurrency('BTC')
    } else {
      setToCurrency('USD')
      setFromCurrency('BTC')
      setFromAmount('0.1') // Default 0.1 BTC for sell mode
    }
  }, [mode])

  useEffect(() => {
    // Calculate conversion using real-time rates
    setError('') // Clear any previous errors
    
    if (fromAmount && exchangeRates) {
      const amount = parseFloat(fromAmount)
      if (isNaN(amount) || amount <= 0) {
        setToAmount('0')
        return
      }

      if (mode === 'buy') {
        // USD to crypto: divide USD amount by crypto price
        const cryptoPrice = exchangeRates[toCurrency]
        if (cryptoPrice) {
          const converted = (amount / cryptoPrice).toFixed(8)
          setToAmount(converted)
          
          // Check minimum buy amount
          if (amount < 20) {
            setError('Minimum buy amount is $20')
          }
        }
      } else {
        // Crypto to USD: multiply crypto amount by crypto price
        const cryptoPrice = exchangeRates[fromCurrency]
        if (cryptoPrice) {
          const usdValue = amount * cryptoPrice
          const converted = usdValue.toFixed(2)
          setToAmount(converted)
          
          // Check minimum sell amount
          if (usdValue < 45) {
            setError('Minimum sell amount is $45')
          }
        }
      }
    }
  }, [fromAmount, fromCurrency, toCurrency, exchangeRates, mode])

  const handleSwapCurrencies = () => {
    setMode(mode === 'buy' ? 'sell' : 'buy')
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const getCurrencyIcon = () => {
    // No icons - just return null to match the original site
    return null
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full max-w-full sm:max-w-md border border-gray-100/50 backdrop-blur-sm">
      {/* Tab Selection */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-4 sm:mb-6">
        <button
          onClick={() => setMode('buy')}
          className={`flex-1 py-2.5 text-center font-semibold rounded-lg transition-all duration-200 ${
            mode === 'buy'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('buySellWidget.buy')}
        </button>
        <button
          onClick={() => setMode('sell')}
          className={`flex-1 py-2.5 text-center font-semibold rounded-lg transition-all duration-200 ${
            mode === 'sell'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('buySellWidget.sell')}
        </button>
      </div>

      {/* From Section */}
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
          <label className="text-xs text-gray-500 font-medium mb-2 block uppercase tracking-wider">
            {mode === 'buy' ? t('buySellWidget.youPay') : t('buySellWidget.youPay')}
          </label>
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-white text-sm sm:text-base font-normal text-gray-900 placeholder-gray-400 border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-200 transition-colors flex-1 min-w-0"
              placeholder="0"
              disabled={loading}
            />
            {mode === 'buy' ? (
              <div className="flex items-center space-x-1 sm:space-x-2 bg-white rounded-lg px-2 sm:px-3 py-2 border border-gray-200 flex-shrink-0">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">USD</span>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === 'from' ? null : 'from')}
                  className="flex items-center space-x-1 sm:space-x-2 bg-white rounded-lg px-2 sm:px-3 py-2 border border-gray-200 hover:border-gray-300 transition-colors flex-shrink-0"
                >
                  {getCurrencyIcon(fromCurrency)}
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">{fromCurrency}</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform flex-shrink-0 ${
                    dropdownOpen === 'from' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {dropdownOpen === 'from' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10 max-h-80 overflow-y-auto">
                    <div className="px-3 py-1 text-xs text-gray-500 font-semibold">CRYPTO</div>
                    {(dropdownExpanded === 'from' ? cryptoCurrencies : cryptoCurrencies.slice(0, 6)).map(curr => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setFromCurrency(curr.code)
                          setDropdownOpen(null)
                          setDropdownExpanded(null)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        {getCurrencyIcon(curr.code)}
                        <span>{curr.code}</span>
                      </button>
                    ))}
                    {dropdownExpanded !== 'from' && cryptoCurrencies.length > 6 && (
                      <button
                        onClick={() => setDropdownExpanded('from')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1 border-t border-gray-200 mt-1 pt-3"
                      >
                        <span className="text-xs">Show {cryptoCurrencies.length - 6} more</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-1">
          <button
            onClick={handleSwapCurrencies}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white p-3 rounded-full shadow-lg transition-all hover:scale-110 hover:rotate-180 duration-300"
          >
            <ArrowDownUp className="w-5 h-5" />
          </button>
        </div>

        {/* To Section */}
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
          <label className="text-xs text-gray-500 font-medium mb-2 block uppercase tracking-wider">
            {t('buySellWidget.youReceive')}
          </label>
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <input
              type="text"
              value={loading ? 'Loading...' : toAmount}
              readOnly
              className="bg-white text-sm sm:text-base font-normal text-gray-900 placeholder-gray-400 border border-gray-200 rounded-md px-2 py-1.5 outline-none flex-1 min-w-0 cursor-default"
              placeholder="0"
            />
            {mode === 'sell' ? (
              <div className="flex items-center space-x-1 sm:space-x-2 bg-white rounded-lg px-2 sm:px-3 py-2 border border-gray-200 flex-shrink-0">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">USD</span>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === 'to' ? null : 'to')}
                  className="flex items-center space-x-1 sm:space-x-2 bg-white rounded-lg px-2 sm:px-3 py-2 border border-gray-200 hover:border-gray-300 transition-colors flex-shrink-0"
                >
                  {getCurrencyIcon(toCurrency)}
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">{toCurrency}</span>
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform flex-shrink-0 ${
                    dropdownOpen === 'to' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {dropdownOpen === 'to' && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10 max-h-80 overflow-y-auto">
                    <div className="px-3 py-1 text-xs text-gray-500 font-semibold">CRYPTO</div>
                    {(dropdownExpanded === 'to' ? cryptoCurrencies : cryptoCurrencies.slice(0, 6)).map(curr => (
                      <button
                        key={curr.code}
                        onClick={() => {
                          setToCurrency(curr.code)
                          setDropdownOpen(null)
                          setDropdownExpanded(null)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        {getCurrencyIcon(curr.code)}
                        <span>{curr.code}</span>
                      </button>
                    ))}
                    {dropdownExpanded !== 'to' && cryptoCurrencies.length > 6 && (
                      <button
                        onClick={() => setDropdownExpanded('to')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1 border-t border-gray-200 mt-1 pt-3"
                      >
                        <span className="text-xs">Show {cryptoCurrencies.length - 6} more</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-500 text-sm text-center py-2">
            {error}
          </div>
        )}

        {/* Action Button */}
        <button 
          className={`w-full font-bold py-3 sm:py-4 rounded-xl transition-all duration-300 text-base sm:text-lg shadow-lg transform ${
            error 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white hover:shadow-xl hover:-translate-y-0.5'
          }`}
          disabled={!!error}
        >
          {mode === 'buy' ? `${t('buySellWidget.buy')} ${toCurrency}` : `${t('buySellWidget.sell')} ${fromCurrency}`}
        </button>

        {/* Payment Methods */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-2 sm:mb-3 text-center">{t('buySellWidget.paymentMethods')}:</p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="flex items-center justify-center h-8 sm:h-9 border border-gray-100 rounded-md bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <img src="/images/visa.svg" alt="Visa" className="h-4 w-auto max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-8 sm:h-9 border border-gray-100 rounded-md bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <img src="/images/Mastercard-logo.svg" alt="Mastercard" className="h-4 w-auto max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-8 sm:h-9 border border-gray-100 rounded-md bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <img src="/images/PayPal.svg" alt="PayPal" className="h-4 w-auto max-w-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}