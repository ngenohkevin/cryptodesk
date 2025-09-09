'use client'

import { useState, useEffect } from 'react'
import { ArrowDownUp, ChevronDown } from 'lucide-react'

export default function BuySellWidget() {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [fromAmount, setFromAmount] = useState('100')
  const [toAmount, setToAmount] = useState('0.001478')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('BTC')
  const [dropdownOpen, setDropdownOpen] = useState<'from' | 'to' | null>(null)

  const currencies = {
    fiat: [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' },
    ],
    crypto: [
      { code: 'BTC', name: 'Bitcoin', icon: '₿', color: 'orange' },
      { code: 'ETH', name: 'Ethereum', icon: 'Ξ', color: 'purple' },
      { code: 'USDT', name: 'Tether', icon: '₮', color: 'green' },
      { code: 'BNB', name: 'BNB', icon: 'BNB', color: 'yellow' },
      { code: 'SOL', name: 'Solana', icon: 'SOL', color: 'purple' },
    ]
  }

  // Simulated exchange rates
  const exchangeRates: Record<string, Record<string, number>> = {
    USD: { BTC: 0.00001478, ETH: 0.000267, USDT: 1, BNB: 0.00164, SOL: 0.00605 },
    BTC: { USD: 67650, ETH: 18.05, USDT: 67650, BNB: 110.8, SOL: 409.3 },
    ETH: { USD: 3750, BTC: 0.0554, USDT: 3750, BNB: 6.14, SOL: 22.7 },
  }

  useEffect(() => {
    // Calculate conversion
    if (fromAmount && exchangeRates[fromCurrency]?.[toCurrency]) {
      const converted = (parseFloat(fromAmount) * exchangeRates[fromCurrency][toCurrency]).toFixed(6)
      setToAmount(converted)
    }
  }, [fromAmount, fromCurrency, toCurrency])

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const getCurrencyIcon = (code: string) => {
    const crypto = currencies.crypto.find(c => c.code === code)
    if (crypto) {
      return (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs
          ${crypto.color === 'orange' ? 'bg-orange-500' : ''}
          ${crypto.color === 'purple' ? 'bg-purple-500' : ''}
          ${crypto.color === 'green' ? 'bg-green-500' : ''}
          ${crypto.color === 'yellow' ? 'bg-yellow-500' : ''}
        `}>
          {crypto.icon}
        </div>
      )
    }
    const fiat = currencies.fiat.find(c => c.code === code)
    if (fiat) {
      return <span className="text-gray-600 font-semibold">{fiat.symbol}</span>
    }
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
          Buy
        </button>
        <button
          onClick={() => setMode('sell')}
          className={`flex-1 py-2.5 text-center font-semibold rounded-lg transition-all duration-200 ${
            mode === 'sell'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Sell
        </button>
      </div>

      {/* From Section */}
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
          <label className="text-xs text-gray-500 font-medium mb-2 block uppercase tracking-wider">
            {mode === 'buy' ? 'I want to spend' : 'I want to sell'}
          </label>
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-transparent text-xl sm:text-2xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none flex-1 min-w-0 w-0"
              placeholder="0"
            />
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10 max-h-64 overflow-y-auto">
                  <div className="px-3 py-1 text-xs text-gray-500 font-semibold">FIAT</div>
                  {currencies.fiat.map(curr => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setFromCurrency(curr.code)
                        setDropdownOpen(null)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span className="font-semibold">{curr.symbol}</span>
                      <span>{curr.code}</span>
                    </button>
                  ))}
                  <div className="px-3 py-1 text-xs text-gray-500 font-semibold mt-2">CRYPTO</div>
                  {currencies.crypto.map(curr => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setFromCurrency(curr.code)
                        setDropdownOpen(null)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      {getCurrencyIcon(curr.code)}
                      <span>{curr.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
          <label className="text-xs text-gray-500 font-medium mb-2 block uppercase tracking-wider">
            You will receive
          </label>
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <input
              type="text"
              value={toAmount}
              readOnly
              className="bg-transparent text-xl sm:text-2xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none flex-1 min-w-0 w-0"
              placeholder="0"
            />
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10 max-h-64 overflow-y-auto">
                  <div className="px-3 py-1 text-xs text-gray-500 font-semibold">CRYPTO</div>
                  {currencies.crypto.map(curr => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setToCurrency(curr.code)
                        setDropdownOpen(null)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      {getCurrencyIcon(curr.code)}
                      <span>{curr.code}</span>
                    </button>
                  ))}
                  <div className="px-3 py-1 text-xs text-gray-500 font-semibold mt-2">FIAT</div>
                  {currencies.fiat.map(curr => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setToCurrency(curr.code)
                        setDropdownOpen(null)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span className="font-semibold">{curr.symbol}</span>
                      <span>{curr.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3 sm:py-4 rounded-xl transition-all duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          {mode === 'buy' ? `Buy ${toCurrency}` : `Sell ${fromCurrency}`}
        </button>

        {/* Payment Methods */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium mb-2 sm:mb-3 text-center">Supported Payment Methods:</p>
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
              <svg className="h-5" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                <path d="M20.5 12L16 20H14L11.5 14.5C11.3 14 11.2 13.8 10.7 13.5C10 13.2 9 12.8 8 12.5L8.1 12H12.4C13 12 13.5 12.4 13.6 13.1L14.9 19.2L18.4 12H20.5ZM29.8 17.3C29.8 14.9 26.5 14.8 26.5 13.8C26.5 13.5 26.8 13.1 27.5 13C28 12.9 29.1 12.9 30.4 13.5L30.8 11.7C30.1 11.4 29.1 11.2 28 11.2C25.9 11.2 24.5 12.4 24.5 14C24.5 15.2 25.5 15.9 26.3 16.3C27.1 16.7 27.4 17 27.4 17.4C27.4 18 26.7 18.2 26.1 18.2C24.8 18.2 24.1 17.9 23.4 17.5L23 19.3C23.7 19.7 24.9 20 26.2 20C28.5 20 29.8 18.8 29.8 17.3ZM37 20H38.8L37.2 12H35.6C35.1 12 34.6 12.3 34.4 12.8L31.2 20H33.3L33.8 18.5H36.5L37 20ZM34.4 16.8L35.5 13.9L36.2 16.8H34.4ZM22.8 12L21.2 20H23.2L24.8 12H22.8Z" fill="white"/>
              </svg>
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
              <svg className="h-5" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#EB001B"/>
                <circle cx="19" cy="16" r="7" fill="#FF5F00"/>
                <circle cx="29" cy="16" r="7" fill="#F79E1B"/>
              </svg>
            </div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
              <svg className="h-5" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#003087"/>
                <path d="M17 11H14.5C13.7 11 13 11.7 13 12.5V19.5C13 20.3 13.7 21 14.5 21H17C18.7 21 20 19.7 20 18V14C20 12.3 18.7 11 17 11ZM18 18C18 18.6 17.6 19 17 19H15V13H17C17.6 13 18 13.4 18 14V18Z" fill="white"/>
                <path d="M25 11H23V21H25V17H26C27.7 17 29 15.7 29 14C29 12.3 27.7 11 26 11ZM26 15H25V13H26C26.6 13 27 13.4 27 14C27 14.6 26.6 15 26 15Z" fill="#009CDE"/>
                <path d="M34 11H32V19H30V21H36V19H34V11Z" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}