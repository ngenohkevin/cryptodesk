'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '@/contexts/LanguageContext'
import { ArrowDownUp, ChevronDown, ArrowLeft, AlertCircle, Check, Copy, CheckCircle } from 'lucide-react'
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
  
  // Form state for multi-step flow
  const [currentView, setCurrentView] = useState<'widget' | 'email' | 'country' | 'payout' | 'deposit' | 'confirmation'>('widget')
  const [formData, setFormData] = useState({
    email: '',
    country: '',
    countryVerified: false,
    firstName: '',
    lastName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [depositSent, setDepositSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [transactionId, setTransactionId] = useState<string>('')

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

  // Allowed email domains like cryptbuy.top
  const allowedEmailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com']

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

  const validateEmail = (email: string) => {
    const emailDomain = email.split('@')[1]?.toLowerCase()
    if (!emailDomain || !allowedEmailDomains.includes(emailDomain)) {
      return `Email domain not allowed. Please use: ${allowedEmailDomains.join(', ')}`
    }
    return ''
  }

  const handleBuySell = () => {
    if (mode === 'sell') {
      // Sell flow - complete implementation
      setCurrentView('email')
    } else {
      // Buy flow - to be implemented
      alert('Buy feature is coming soon! The sell feature is fully functional.')
      // TODO: Implement buy flow when ready
      // setCurrentView('buy-flow-start')
    }
  }
  
  const handleEmailSubmit = () => {
    if (!formData.email) {
      setErrors({ email: 'Email is required' })
      return
    }
    
    const emailError = validateEmail(formData.email)
    if (emailError) {
      setErrors({ email: emailError })
      return
    }
    
    setErrors({})
    setCurrentView('country')
  }
  
  const handleCountrySubmit = () => {
    if (!formData.country) {
      setErrors({ country: 'Country is required' })
      return
    }
    
    // Trim whitespace and convert to lowercase for comparison
    const countryInput = formData.country.trim()
    const countryLower = countryInput.toLowerCase()
    
    if (countryInput.length < 2) {
      setErrors({ country: 'Please enter a valid country name' })
      return
    }
    
    // Check for obviously invalid inputs
    if (!/[a-zA-Z]/.test(countryInput)) {
      setErrors({ country: 'Please enter a valid country name' })
      return
    }
    
    // Map common abbreviations and codes to full country names
    const countryMappings: Record<string, string> = {
      'us': 'United States',
      'usa': 'United States',
      'america': 'United States',
      'uk': 'United Kingdom',
      'gb': 'United Kingdom',
      'britain': 'United Kingdom',
      'england': 'United Kingdom',
      'ca': 'Canada',
      'au': 'Australia',
      'aus': 'Australia',
      'de': 'Germany',
      'fr': 'France',
      'ch': 'Switzerland',
      'swiss': 'Switzerland',
      'nl': 'Netherlands',
      'holland': 'Netherlands',
      'se': 'Sweden',
      'no': 'Norway',
      'dk': 'Denmark',
      'jp': 'Japan',
      'sg': 'Singapore',
      'hk': 'Hong Kong',
      'nz': 'New Zealand',
      'at': 'Austria',
      'be': 'Belgium',
      'fi': 'Finland',
      'ie': 'Ireland',
      'it': 'Italy',
      'es': 'Spain',
      'pt': 'Portugal',
      'lu': 'Luxembourg',
      'mx': 'Mexico',
      'br': 'Brazil',
      'ar': 'Argentina',
      'in': 'India',
      'cn': 'China',
      'kr': 'South Korea',
      'za': 'South Africa',
      'ae': 'United Arab Emirates',
      'uae': 'United Arab Emirates',
      'il': 'Israel',
      'my': 'Malaysia',
      'th': 'Thailand',
      'ph': 'Philippines',
      'id': 'Indonesia',
      'vn': 'Vietnam',
      'pl': 'Poland',
      'cz': 'Czech Republic',
      'czechia': 'Czech Republic',
      'hu': 'Hungary',
      'ro': 'Romania',
      'gr': 'Greece',
      'tr': 'Turkey',
      'eg': 'Egypt',
      'sa': 'Saudi Arabia',
      'ksa': 'Saudi Arabia',
      'ng': 'Nigeria',
      'ke': 'Kenya',
      'cl': 'Chile',
      'co': 'Colombia',
      'pe': 'Peru',
      'tw': 'Taiwan',
      'is': 'Iceland',
      'ua': 'Ukraine',
      // Add sanctioned countries mapping (for codes)
      'ir': 'Iran',
      'ru': 'Russia',
      'kp': 'North Korea',
      'sy': 'Syria',
      'cu': 'Cuba',
      'by': 'Belarus',
      'mm': 'Myanmar',
      've': 'Venezuela',
      'sd': 'Sudan',
      'ss': 'South Sudan',
      'zw': 'Zimbabwe',
      'ly': 'Libya',
      'so': 'Somalia',
      'ye': 'Yemen',
      'cf': 'Central African Republic',
      'af': 'Afghanistan',
      'ml': 'Mali',
      'ni': 'Nicaragua',
      'lb': 'Lebanon',
      'iq': 'Iraq'
    }
    
    // List of all valid countries (comprehensive list)
    const validCountryNames = [
      // Africa
      'algeria', 'angola', 'benin', 'botswana', 'burkina faso', 'burundi', 'cameroon', 'cape verde',
      'chad', 'comoros', 'djibouti', 'egypt', 'equatorial guinea', 'eritrea', 'ethiopia', 'gabon',
      'gambia', 'ghana', 'guinea', 'guinea-bissau', 'ivory coast', 'kenya', 'lesotho', 'liberia',
      'madagascar', 'malawi', 'mauritania', 'mauritius', 'morocco', 'mozambique', 'namibia', 'niger',
      'nigeria', 'rwanda', 'sao tome and principe', 'senegal', 'seychelles', 'sierra leone',
      'south africa', 'swaziland', 'eswatini', 'tanzania', 'togo', 'tunisia', 'uganda', 'zambia',
      // Americas
      'argentina', 'bahamas', 'barbados', 'belize', 'bolivia', 'brazil', 'canada', 'chile', 'colombia',
      'costa rica', 'dominica', 'dominican republic', 'ecuador', 'el salvador', 'grenada', 'guatemala',
      'guyana', 'haiti', 'honduras', 'jamaica', 'mexico', 'panama', 'paraguay', 'peru',
      'saint kitts and nevis', 'saint lucia', 'saint vincent and the grenadines', 'suriname',
      'trinidad and tobago', 'united states', 'usa', 'uruguay',
      // Asia
      'bahrain', 'bangladesh', 'bhutan', 'brunei', 'cambodia', 'china', 'cyprus', 'georgia',
      'india', 'indonesia', 'israel', 'japan', 'jordan', 'kazakhstan', 'kuwait', 'kyrgyzstan',
      'laos', 'malaysia', 'maldives', 'mongolia', 'nepal', 'oman', 'pakistan', 'palestine',
      'philippines', 'qatar', 'saudi arabia', 'singapore', 'south korea', 'korea', 'sri lanka',
      'taiwan', 'tajikistan', 'thailand', 'timor-leste', 'turkey', 'turkmenistan',
      'united arab emirates', 'uae', 'uzbekistan', 'vietnam',
      // Europe
      'albania', 'andorra', 'armenia', 'austria', 'azerbaijan', 'belgium', 'bosnia and herzegovina',
      'bulgaria', 'croatia', 'czech republic', 'czechia', 'denmark', 'estonia', 'finland', 'france',
      'germany', 'greece', 'hungary', 'iceland', 'ireland', 'italy', 'kosovo', 'latvia',
      'liechtenstein', 'lithuania', 'luxembourg', 'macedonia', 'north macedonia', 'malta', 'moldova',
      'monaco', 'montenegro', 'netherlands', 'holland', 'norway', 'poland', 'portugal', 'romania',
      'san marino', 'serbia', 'slovakia', 'slovenia', 'spain', 'sweden', 'switzerland', 'swiss',
      'united kingdom', 'uk', 'great britain', 'britain', 'england', 'scotland', 'wales',
      'northern ireland', 'vatican city',
      // Oceania
      'australia', 'fiji', 'kiribati', 'marshall islands', 'micronesia', 'nauru', 'new zealand',
      'palau', 'papua new guinea', 'samoa', 'solomon islands', 'tonga', 'tuvalu', 'vanuatu'
    ]
    
    // Check if the input matches any valid country (after normalization)
    const isValidCountry = validCountryNames.some(country => 
      country === countryLower || 
      countryLower.includes(country) || 
      country.includes(countryLower)
    )
    
    // Also check if it's a valid mapping
    const isMappedCountry = countryMappings.hasOwnProperty(countryLower)
    
    if (!isValidCountry && !isMappedCountry) {
      setErrors({ country: 'Please enter a valid country name. If you believe this is an error, try using the full country name.' })
      return
    }
    
    // Get the normalized country name (either from mapping or original input)
    const normalizedCountry = countryMappings[countryLower] || countryInput
    
    // List of restricted/sanctioned countries (OFAC and international sanctions)
    const restrictedCountries = [
      // North Korea
      'north korea', 'dprk', 'democratic people\'s republic of korea', 'kp',
      // Iran
      'iran', 'islamic republic of iran', 'ir',
      // Syria
      'syria', 'syrian arab republic', 'sy',
      // Cuba
      'cuba', 'cu',
      // Crimea region
      'crimea', 'sevastopol',
      // Russia
      'russia', 'russian federation', 'ru',
      // Belarus
      'belarus', 'by',
      // Myanmar (Burma)
      'myanmar', 'burma', 'mm',
      // Venezuela
      'venezuela', 've',
      // Sudan
      'sudan', 'sd',
      // South Sudan
      'south sudan', 'ss',
      // Zimbabwe
      'zimbabwe', 'zw',
      // Libya
      'libya', 'ly',
      // Somalia
      'somalia', 'so',
      // Yemen
      'yemen', 'ye',
      // Central African Republic
      'central african republic', 'car', 'cf',
      // Democratic Republic of Congo (certain regions)
      'congo drc', 'democratic republic of congo', 'drc',
      // Afghanistan (under Taliban)
      'afghanistan', 'af',
      // Mali (certain regions)
      'mali', 'ml',
      // Nicaragua
      'nicaragua', 'ni',
      // Lebanon (certain entities)
      'lebanon', 'lb',
      // Iraq (certain regions)
      'iraq', 'iq'
    ]

    // Additional mapping for sanctioned country names to codes
    const sanctionedCountryMappings: Record<string, string[]> = {
      'ir': ['iran', 'islamic republic of iran'],
      'ru': ['russia', 'russian federation'],
      'kp': ['north korea', 'dprk', 'democratic people\'s republic of korea', 'democratic peoples republic of korea'],
      'sy': ['syria', 'syrian arab republic'],
      'cu': ['cuba'],
      'by': ['belarus'],
      'mm': ['myanmar', 'burma'],
      've': ['venezuela'],
      'sd': ['sudan'],
      'ss': ['south sudan'],
      'zw': ['zimbabwe'],
      'ly': ['libya'],
      'so': ['somalia'],
      'ye': ['yemen'],
      'cf': ['central african republic', 'car'],
      'af': ['afghanistan'],
      'ml': ['mali'],
      'ni': ['nicaragua'],
      'lb': ['lebanon'],
      'iq': ['iraq']
    }

    // Check if input matches any sanctioned country (code or full name)
    const isRestricted = restrictedCountries.some(restricted => {
      // Direct match with the restricted list
      if (countryLower === restricted || normalizedCountry.toLowerCase() === restricted) {
        return true
      }

      // Check if the input contains the restricted country name
      if (countryLower.includes(restricted) || restricted.includes(countryLower)) {
        return true
      }

      return false
    }) || Object.entries(sanctionedCountryMappings).some(([code, names]) => {
      // Check if input is the country code
      if (countryLower === code.toLowerCase()) {
        return true
      }

      // Check if input matches any of the full names for this sanctioned country
      return names.some(name => {
        const nameLower = name.toLowerCase()
        return countryLower === nameLower ||
               countryLower.includes(nameLower) ||
               nameLower.includes(countryLower)
      })
    })
    
    if (isRestricted) {
      setErrors({ country: 'Service is currently not available in this country due to regulatory restrictions.' })
      return
    }
    
    // Country verified successfully - store the normalized name
    setFormData(prev => ({ ...prev, country: normalizedCountry, countryVerified: true }))
    setErrors({})
    // Small delay to show verification success
    setTimeout(() => {
      setCurrentView('payout')
    }, 500)
  }
  
  const handlePayoutSubmit = () => {
    const newErrors: Record<string, string> = {}
    
    // Validate first name
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    } else if (!/^[a-zA-Z\s-']+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes'
    }
    
    // Validate last name
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    } else if (!/^[a-zA-Z\s-']+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes'
    }
    
    // Validate bank name
    if (!formData.bankName) {
      newErrors.bankName = 'Bank name is required'
    } else if (formData.bankName.length < 3) {
      newErrors.bankName = 'Bank name must be at least 3 characters'
    }
    
    // Validate account number
    if (!formData.accountNumber) {
      newErrors.accountNumber = 'Account number is required'
    } else if (!/^\d+$/.test(formData.accountNumber)) {
      newErrors.accountNumber = 'Account number must contain only digits'
    } else if (formData.accountNumber.length < 8 || formData.accountNumber.length > 17) {
      newErrors.accountNumber = 'Account number must be between 8 and 17 digits'
    }
    
    // Validate routing number (optional but if provided, must be valid)
    if (formData.routingNumber) {
      if (!/^\d+$/.test(formData.routingNumber)) {
        newErrors.routingNumber = 'Routing number must contain only digits'
      } else if (formData.routingNumber.length !== 9) {
        newErrors.routingNumber = 'Routing number must be exactly 9 digits'
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    setCurrentView('deposit')
  }
  
  const handleDepositConfirm = () => {
    setDepositSent(true)
    // Generate transaction ID only when needed
    setTransactionId(`TXN-${Date.now()}`)
    // Show notification for 3 seconds
    setTimeout(() => {
      setDepositSent(false)
      setCurrentView('confirmation')
    }, 3000)
  }
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText('bc1qtuy6y0am5x8zmtp4edg2qyk7uh4f8g0kpq9mm6')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleBack = () => {
    if (currentView === 'email') {
      setCurrentView('widget')
    } else if (currentView === 'country') {
      setCurrentView('email')
    } else if (currentView === 'payout') {
      // Reset country verification when going back from payout to country
      setFormData(prev => ({ ...prev, countryVerified: false }))
      setCurrentView('country')
    } else if (currentView === 'deposit') {
      setCurrentView('payout')
    } else if (currentView === 'confirmation') {
      // Reset everything and go back to widget
      setCurrentView('widget')
      setFormData({
        email: '',
        country: '',
        countryVerified: false,
        firstName: '',
        lastName: '',
        bankName: '',
        accountNumber: '',
        routingNumber: ''
      })
      setErrors({})
      setDepositSent(false)
      setTransactionId('')
    }
    setErrors({})
  }

  // Single container with all views inside
  return (
    <div className="bg-white rounded-2xl shadow-xl w-full border border-gray-100/50 backdrop-blur-sm relative overflow-hidden" style={{ minHeight: '620px' }}>
      {/* Email View */}
      <div className={`absolute inset-0 p-4 sm:p-6 lg:p-8 transition-transform duration-300 ${currentView === 'email' ? 'translate-x-0' : 'translate-x-full'}`}>
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex flex-col justify-center" style={{ minHeight: '480px' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enter Your Email</h3>
            <p className="text-gray-600">We'll use this to send you transaction updates.</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                  setErrors(prev => ({ ...prev, email: '' }))
                }}
                placeholder="your.email@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                autoFocus={currentView === 'email'}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-2">{errors.email}</p>
              )}
            </div>
            
            <button
              onClick={handleEmailSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-all duration-200"
            >
              Proceed to Payout Details
            </button>
          </div>
        </div>
      </div>

      {/* Country View */}
      <div className={`absolute inset-0 p-4 sm:p-6 lg:p-8 transition-transform duration-300 ${currentView === 'country' ? 'translate-x-0' : 'translate-x-full'}`}>
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex flex-col justify-center" style={{ minHeight: '480px' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enter Payout Details</h3>
            <p className="text-gray-600">Provide your payout info to receive funds.</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country of Residence
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, country: e.target.value, countryVerified: false }))
                    setErrors(prev => ({ ...prev, country: '' }))
                  }}
                  placeholder="Enter your country"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                    formData.countryVerified ? 'border-green-500 bg-green-50' : 'border-gray-300'
                  }`}
                  autoFocus={currentView === 'country' && !formData.countryVerified}
                />
                {formData.countryVerified && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                )}
              </div>
              {errors.country && (
                <p className="text-sm text-red-500 mt-2">{errors.country}</p>
              )}
              {formData.countryVerified && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">✓ Country verified successfully!</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleCountrySubmit}
              disabled={formData.countryVerified}
              className={`w-full font-bold py-4 rounded-lg transition-all duration-200 ${
                formData.countryVerified 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {formData.countryVerified ? 'Country Verified' : 'Verify Country'}
            </button>
          </div>
        </div>
      </div>

      {/* Payout View */}
      <div className={`absolute inset-0 transition-transform duration-300 ${currentView === 'payout' ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-hidden">
          <button
            onClick={handleBack}
            className="self-start p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors mb-2"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-center mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Enter Payout Details</h3>
            <p className="text-xs text-gray-600">Provide your payout info to receive funds.</p>
          </div>
          
          <div className="flex-1 overflow-y-auto -mx-2 px-2 space-y-3">
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, firstName: e.target.value }))
                    setErrors(prev => ({ ...prev, firstName: '' }))
                  }}
                  placeholder="Enter first name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, lastName: e.target.value }))
                    setErrors(prev => ({ ...prev, lastName: '' }))
                  }}
                  placeholder="Enter last name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, bankName: e.target.value }))
                  setErrors(prev => ({ ...prev, bankName: '' }))
                }}
                placeholder="Enter bank name"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {errors.bankName && (
                <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, accountNumber: e.target.value }))
                  setErrors(prev => ({ ...prev, accountNumber: '' }))
                }}
                placeholder="e.g., 1234567890"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {errors.accountNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Routing Number (Optional)
              </label>
              <input
                type="text"
                value={formData.routingNumber}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, routingNumber: e.target.value }))
                  setErrors(prev => ({ ...prev, routingNumber: '' }))
                }}
                placeholder="e.g., 021000021"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {errors.routingNumber && (
                <p className="text-xs text-red-500 mt-1">{errors.routingNumber}</p>
              )}
            </div>
            
            <p className="text-xs text-gray-600 mt-2">
              Ensure these details are correct. We will send funds here.
            </p>
            
            <button
              onClick={handlePayoutSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 text-sm mt-2"
            >
              Proceed to Crypto Deposit
            </button>
          </div>
        </div>
      </div>

      {/* Deposit View */}
      <div className={`absolute inset-0 transition-transform duration-300 ${currentView === 'deposit' ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8">
          <button
            onClick={handleBack}
            className="self-start p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors mb-2"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1 overflow-y-auto">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Deposit Your {fromCurrency}</h3>
              <p className="text-sm text-gray-600">Send exactly {fromAmount} {fromCurrency} to the address below.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {fromCurrency} Deposit Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value="bc1qtuy6y0am5x8zmtp4edg2qyk7uh4f8g0kpq9mm6"
                    readOnly
                    className="w-full px-3 py-2 pr-10 bg-gray-50 border border-gray-300 rounded-lg font-mono text-xs"
                  />
                  <button
                    onClick={handleCopyAddress}
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Copy address"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-3">Or scan QR code</p>
                <div className="inline-block p-3 bg-white border-2 border-gray-300 rounded-lg">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">[QR Code]</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    <strong>IMPORTANT:</strong> Only send {fromCurrency} to this address. Sending other coins may result in permanent loss.
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleDepositConfirm}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 text-sm"
              >
                I Have Sent The Crypto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation View */}
      <div className={`absolute inset-0 p-4 sm:p-6 lg:p-8 transition-transform duration-300 ${currentView === 'confirmation' ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col justify-center" style={{ minHeight: '480px' }}>
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Processing Transaction</h3>
            <p className="text-gray-600 mb-8">
              We're checking for your {fromCurrency} deposit. This usually takes a few minutes.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-amber-600">Waiting for deposit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount to receive:</span>
                  <span className="font-medium">${toAmount} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payout method:</span>
                  <span className="font-medium">Bank Transfer</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              Transaction ID: {transactionId}
            </p>
            
            <button
              onClick={handleBack}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 rounded-lg transition-all duration-200"
            >
              Start New Transaction
            </button>
          </div>
        </div>
      </div>

      {/* Main Widget View */}
      <div className={`transition-transform duration-300 ${currentView === 'widget' ? 'translate-x-0' : '-translate-x-full absolute inset-0'}`}>
        <div className="p-4 sm:p-6 lg:p-8 h-full">
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
                : mode === 'buy'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-xl hover:-translate-y-0.5'
            }`}
            disabled={!!error}
          >
            {mode === 'buy'
              ? `${t('buySellWidget.buy')} ${toCurrency} (Coming Soon)`
              : `${t('buySellWidget.sell')} ${fromCurrency}`}
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
      </div>

      {/* Deposit Notification */}
      {depositSent && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in-right">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">No {fromCurrency} Deposit Detected</p>
            <p className="text-sm opacity-90">Please double-check the address and amount, or wait a bit longer for network confirmations.</p>
          </div>
        </div>
      )}
    </div>
  )
}