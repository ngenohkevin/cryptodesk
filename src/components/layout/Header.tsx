'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { ChevronDown, Globe, Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()

  const languages = [
    { code: 'en', name: t('header.languages.english') },
    { code: 'es', name: t('header.languages.spanish') },
    { code: 'fr', name: t('header.languages.french') },
    { code: 'de', name: t('header.languages.german') }
  ]

  const switchLanguage = (newLanguage: 'en' | 'es' | 'fr' | 'de') => {
    setLanguage(newLanguage)
    setLanguageOpen(false)
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              {t('header.logo')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href={"/#buy-crypto#buy"} 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              {t('header.buyCrypto')}
            </Link>
            <Link 
              href={"/#buy-crypto#sell"} 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              {t('header.sellCrypto')}
            </Link>
            <Link 
              href={"/wallet"} 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              {t('header.wallet')}
            </Link>
            <Link 
              href={"/about"} 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              {t('header.aboutUs')}
            </Link>
            <Link 
              href={"/careers"} 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 relative"
            >
              {t('header.careers')}
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium hidden sm:inline">{t('header.language')}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${languageOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Language Dropdown */}
              {languageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-slide-down">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
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

            {/* Buy Now button */}
            <Link
              href={"/#buy-crypto#buy"}
              className="hidden sm:inline-flex bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {t('header.buyNow')}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-down">
            <nav className="flex flex-col space-y-3">
              <Link 
                href={"/#buy-crypto#buy"}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('header.buyCrypto')}
              </Link>
              <Link 
                href={"/#buy-crypto#sell"}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('header.sellCrypto')}
              </Link>
              <Link 
                href={"/wallet"}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('header.wallet')}
              </Link>
              <Link 
                href={"/about"}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('header.aboutUs')}
              </Link>
              <Link 
                href={"/careers"}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-primary-600 font-medium px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('header.careers')}
              </Link>
              <Link
                href={"/#buy-crypto#buy"}
                onClick={() => setMobileMenuOpen(false)}
                className="sm:hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2.5 rounded-xl font-semibold text-center"
              >
                {t('header.buyNow')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}