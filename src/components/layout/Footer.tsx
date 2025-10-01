'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, Mail, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Logo from '@/components/common/Logo'

export default function Footer() {
  const { language, setLanguage, t } = useLanguage()
  const [languageOpen, setLanguageOpen] = useState(false)
  const languageDropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
  ]

  const openTidioChat = () => {
    if (typeof window !== 'undefined' && (window as any).tidioChatApi) {
      (window as any).tidioChatApi.open()
    }
  }

  const switchLanguage = (newLanguage: 'en' | 'es' | 'fr' | 'de') => {
    setLanguage(newLanguage)
    setLanguageOpen(false)
  }

  const currentLanguageName = languages.find(lang => lang.code === language)?.name || 'English'

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setLanguageOpen(false)
      }
    }

    if (languageOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [languageOpen])

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo size="sm" variant="white" />
            <p className="text-gray-300 text-sm">
              {t('footer.description')}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">{t('footer.language')}</span>
              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="flex items-center space-x-1 cursor-pointer hover:text-white transition-colors"
                >
                  <span className="text-sm">🌐</span>
                  <span className="text-sm">{currentLanguageName}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${languageOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Language Dropdown */}
                {languageOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code as 'en' | 'es' | 'fr' | 'de')}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          language === lang.code
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('footer.products')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#buy-crypto" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.buyBitcoin')}
                </Link>
              </li>
              <li>
                <Link href="/#buy-crypto" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.buyEthereum')}
                </Link>
              </li>
              <li>
                <Link href="/#sell-crypto" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.sellTether')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('footer.company')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  {t('header.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/wallet" className="text-gray-300 hover:text-white transition-colors">
                  {t('header.wallet')}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <span>{t('header.careers')}</span>
                  <span className="bg-green-600 text-xs px-2 py-1 rounded-full">{t('footer.hiring')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t('footer.support')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="mailto:support@crypulse.top" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{t('footer.email')}</span>
                </Link>
              </li>
              <li>
                <button onClick={openTidioChat} className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('footer.liveChat')}</span>
                </button>
              </li>
            </ul>
            <div className="space-y-2 mt-6">
              <h4 className="font-semibold">{t('footer.legal')}</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors text-sm">
                    {t('footer.terms')}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                    {t('footer.privacy')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}