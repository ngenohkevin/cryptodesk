'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowDownUp, ChevronDown, ArrowLeft } from 'lucide-react'
import { cryptoApiClient } from '@/utils/cryptoApiClient'

export default function BuySellWidget() {
  const { t } = useLanguage()
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [fromAmount, setFromAmount] = useState('100')
  const [toAmount, setToAmount] = useState('0')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('BTC')
  const [dropdownOpen, setDropdownOpen] = useState<'from' | 'to' | null>(null)
  const [dropdownExpanded, setDropdownExpanded] = useState<'from' | 'to' | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<'above' | 'below'>('below')
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0 })
  const fromDropdownRef = useRef<HTMLDivElement>(null)
  const toDropdownRef = useRef<HTMLDivElement>(null)
  const fromPortalRef = useRef<HTMLDivElement>(null)
  const toPortalRef = useRef<HTMLDivElement>(null)
  
  // Simple form state - no complex modal flow
  const [currentView, setCurrentView] = useState<'widget' | 'email' | 'payout' | 'country'>('widget')
  const [formData, setFormData] = useState({
    email: '',
    country: '',
    firstName: '',
    lastName: '',
    bankName: '',
    accountNumber: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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
  const [retryCount, setRetryCount] = useState(0)

  // Fetch real-time exchange rates using the robust API service
  const fetchExchangeRates = async () => {
    setLoading(true)
    try {
      const rates = await cryptoApiClient.fetchExchangeRates()
      
      // Only update if we got valid rates
      if (Object.keys(rates).length > 0) {
        setExchangeRates(rates)
        setRetryCount(0) // Reset retry count on success
      } else if (retryCount < 3) {
        // Retry if we got empty rates
        setRetryCount(prev => prev + 1)
        setTimeout(() => fetchExchangeRates(), 2000)
      }
    } catch {
      // Failed to fetch exchange rates
      // Retry up to 3 times with delay
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1)
        setTimeout(() => fetchExchangeRates(), 2000)
      }
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
          const result = amount / cryptoPrice
          // Use appropriate decimal places based on the crypto value
          let converted: string
          if (result >= 1) {
            converted = result.toFixed(4) // 4 decimals for whole coins
          } else if (result >= 0.01) {
            converted = result.toFixed(6) // 6 decimals for smaller amounts
          } else {
            converted = result.toFixed(8) // 8 decimals for very small amounts
          }
          // Remove trailing zeros
          converted = parseFloat(converted).toString()
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

  const handleDropdownToggle = (dropdown: 'from' | 'to') => {
    if (dropdownOpen === dropdown) {
      setDropdownOpen(null)
      setDropdownExpanded(null)
    } else {
      setDropdownOpen(dropdown)
      setDropdownExpanded(null)
      
      // Calculate position immediately
      const button = dropdown === 'from' ? fromDropdownRef.current : toDropdownRef.current
      if (button) {
        const rect = button.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top
        
        // If not enough space below (less than 250px) and more space above, show above
        if (spaceBelow < 250 && spaceAbove > spaceBelow) {
          setDropdownPosition('above')
          setDropdownCoords({
            top: rect.top - 210,
            left: rect.right - 192
          })
        } else {
          setDropdownPosition('below')
          setDropdownCoords({
            top: rect.bottom + 8,
            left: rect.right - 192
          })
        }
      }
    }
  }

  // Update dropdown position on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (dropdownOpen) {
        const button = dropdownOpen === 'from' ? fromDropdownRef.current : toDropdownRef.current
        if (button) {
          const rect = button.getBoundingClientRect()
          if (dropdownPosition === 'above') {
            setDropdownCoords({
              top: rect.top - 210,
              left: rect.right - 192
            })
          } else {
            setDropdownCoords({
              top: rect.bottom + 8,
              left: rect.right - 192
            })
          }
        }
      }
    }

    if (dropdownOpen) {
      window.addEventListener('scroll', handleScroll, true)
      return () => window.removeEventListener('scroll', handleScroll, true)
    }
  }, [dropdownOpen, dropdownPosition])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      if (dropdownOpen === 'from') {
        // Check if click is outside both the button and the portal dropdown
        if (fromDropdownRef.current && !fromDropdownRef.current.contains(target) &&
            fromPortalRef.current && !fromPortalRef.current.contains(target)) {
          setDropdownOpen(null)
          setDropdownExpanded(null)
        }
      } else if (dropdownOpen === 'to') {
        // Check if click is outside both the button and the portal dropdown
        if (toDropdownRef.current && !toDropdownRef.current.contains(target) &&
            toPortalRef.current && !toPortalRef.current.contains(target)) {
          setDropdownOpen(null)
          setDropdownExpanded(null)
        }
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])


  const handleBuySell = () => {
    if (mode === 'sell') {
      setCurrentView('email')
    } else {
      // For buy mode, keep existing modal flow for now
      setCurrentView('email')
    }
  }
  
  const handleEmailSubmit = () => {
    if (!formData.email) {
      setErrors({ email: 'Email is required' })
      return
    }
    
    if (mode === 'sell') {
      setCurrentView('payout')
    } else {
      // Handle buy flow
      setCurrentView('payout')
    }
  }
  
  const handlePayoutSubmit = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.country) newErrors.country = 'Country is required'
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.bankName) newErrors.bankName = 'Bank name is required'
    if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required'
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setCurrentView('country')
  }
  
  const handleCountryVerify = () => {
    // Simulate country verification
    // Country verified successfully
    // Reset to widget view
    setCurrentView('widget')
    setFormData({
      email: '',
      country: '',
      firstName: '',
      lastName: '',
      bankName: '',
      accountNumber: ''
    })
    setErrors({})
  }

  const handleBack = () => {
    if (currentView === 'email') {
      setCurrentView('widget')
    } else if (currentView === 'payout') {
      setCurrentView('email')
    } else if (currentView === 'country') {
      setCurrentView('payout')
    }
    setErrors({})
  }

  // Email step form
  if (currentView === 'email') {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full border border-gray-100/50 backdrop-blur-sm relative overflow-visible">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost there!</h2>
          <p className="text-gray-600">Enter your email to get started</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, email: e.target.value }))
                setErrors(prev => ({ ...prev, email: '' }))
              }}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              autoFocus
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-2">{errors.email}</p>
            )}
          </div>
          
          <button
            onClick={handleEmailSubmit}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 rounded-lg transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }
  
  // Payout details form
  if (currentView === 'payout') {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full border border-gray-100/50 backdrop-blur-sm relative overflow-visible">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Payout Details</h2>
          <p className="text-gray-600">We need some information to send you the funds</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country of Residence
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, country: e.target.value }))
                setErrors(prev => ({ ...prev, country: '' }))
              }}
              placeholder="United States"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              autoFocus
            />
            {errors.country && (
              <p className="text-sm text-red-500 mt-2">{errors.country}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, firstName: e.target.value }))
                  setErrors(prev => ({ ...prev, firstName: '' }))
                }}
                placeholder="John"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
              {errors.firstName && (
                <p className="text-sm text-red-500 mt-2">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, lastName: e.target.value }))
                  setErrors(prev => ({ ...prev, lastName: '' }))
                }}
                placeholder="Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
              {errors.lastName && (
                <p className="text-sm text-red-500 mt-2">{errors.lastName}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, bankName: e.target.value }))
                setErrors(prev => ({ ...prev, bankName: '' }))
              }}
              placeholder="Chase Bank"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
            {errors.bankName && (
              <p className="text-sm text-red-500 mt-2">{errors.bankName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, accountNumber: e.target.value }))
                setErrors(prev => ({ ...prev, accountNumber: '' }))
              }}
              placeholder="1234567890"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
            {errors.accountNumber && (
              <p className="text-sm text-red-500 mt-2">{errors.accountNumber}</p>
            )}
          </div>
          
          <button
            onClick={handlePayoutSubmit}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 rounded-lg transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }
  
  // Country verification step
  if (currentView === 'country') {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full border border-gray-100/50 backdrop-blur-sm relative overflow-visible">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Country</h2>
          <p className="text-gray-600">Confirming your country: <strong>{formData.country}</strong></p>
        </div>
        
        <div className="space-y-6">
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Country Verified!</h3>
            <p className="text-green-700">Your location has been confirmed successfully.</p>
          </div>
          
          <button
            onClick={handleCountryVerify}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 rounded-lg transition-all duration-200"
          >
            Complete Setup
          </button>
        </div>
      </div>
    )
  }
  
  // Main widget view
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 w-full border border-gray-100/50 backdrop-blur-sm relative overflow-visible">
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

      {/* Input Fields */}
      <div className="space-y-4 relative">
        <div className="space-y-2">
          <label className="text-sm text-gray-600 font-medium">
            {mode === 'buy' ? 'I want to spend' : 'I want to sell'}
          </label>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 flex items-center gap-3 shadow-sm hover:shadow-md hover:border-gray-300/60 transition-all duration-200">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="bg-transparent text-lg font-medium text-gray-900 placeholder-gray-500 border-0 outline-none flex-1 min-w-0 focus:placeholder-gray-400 transition-all duration-200"
              placeholder="0"
              disabled={loading}
            />
            {mode === 'buy' ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/70 flex-shrink-0 shadow-sm">
                <span className="font-semibold text-gray-700 text-base">USD</span>
              </div>
            ) : (
              <div className="relative" ref={fromDropdownRef}>
                <button
                  onClick={() => handleDropdownToggle('from')}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/70 hover:border-gray-300/70 hover:bg-white/90 transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md"
                >
                  <span className="font-semibold text-gray-700 text-base">{fromCurrency}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                    dropdownOpen === 'from' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {dropdownOpen === 'from' && typeof document !== 'undefined' && createPortal(
                  <div 
                    ref={fromPortalRef}
                    style={{
                      position: 'fixed',
                      top: dropdownCoords.top,
                      left: dropdownCoords.left,
                      zIndex: 50000,
                      width: '192px',
                      maxHeight: '240px'
                    }}
                    className="bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col"
                  >
                    <div className="overflow-y-auto flex-1 py-2">
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
                          <span>{curr.code}</span>
                        </button>
                      ))}
                    </div>
                    {dropdownExpanded !== 'from' && cryptoCurrencies.length > 6 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setDropdownExpanded('from')
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1 border-t border-gray-200"
                      >
                        <span className="text-xs">Show {cryptoCurrencies.length - 6} more</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>,
                  document.body
                )}
              </div>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2">
          <button
            onClick={handleSwapCurrencies}
            className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-3 rounded-full transition-all hover:rotate-180 duration-300"
          >
            <ArrowDownUp className="w-4 h-4" />
          </button>
        </div>

        {/* To Section */}
        <div className="space-y-2">
          <label className="text-sm text-gray-600 font-medium">
            {mode === 'sell' ? 'You will receive (approx.)' : 'You will receive'}
          </label>
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 flex items-center gap-3 shadow-sm transition-all duration-200">
            <input
              type="text"
              value={loading ? 'Loading...' : toAmount}
              readOnly
              className="bg-transparent text-lg font-medium text-gray-900 placeholder-gray-500 border-0 outline-none flex-1 min-w-0 cursor-default"
              placeholder="0"
            />
            {mode === 'sell' ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/70 flex-shrink-0 shadow-sm">
                <span className="font-semibold text-gray-700 text-base">USD</span>
              </div>
            ) : (
              <div className="relative" ref={toDropdownRef}>
                <button
                  onClick={() => handleDropdownToggle('to')}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200/70 hover:border-gray-300/70 hover:bg-white/90 transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md"
                >
                  <span className="font-semibold text-gray-700 text-base">{toCurrency}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                    dropdownOpen === 'to' ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {dropdownOpen === 'to' && typeof document !== 'undefined' && createPortal(
                  <div 
                    ref={toPortalRef}
                    style={{
                      position: 'fixed',
                      top: dropdownCoords.top,
                      left: dropdownCoords.left,
                      zIndex: 50000,
                      width: '192px',
                      maxHeight: '240px'
                    }}
                    className="bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col"
                  >
                    <div className="overflow-y-auto flex-1 py-2">
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
                          <span>{curr.code}</span>
                        </button>
                      ))}
                    </div>
                    {dropdownExpanded !== 'to' && cryptoCurrencies.length > 6 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setDropdownExpanded('to')
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1 border-t border-gray-200"
                      >
                        <span className="text-xs">Show {cryptoCurrencies.length - 6} more</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>,
                  document.body
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
          onClick={handleBuySell}
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