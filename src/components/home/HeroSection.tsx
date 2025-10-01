'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { Zap, Shield, Clock } from 'lucide-react'
import BuySellWidget from './BuySellWidget'

export default function HeroSection() {
  const { t } = useLanguage()
  return (
    <section className="relative" style={{ backgroundColor: '#F0F6FE' }} aria-label="Hero section for selling cryptocurrency with 15% profit bonus">
      {/* Abstract background */}
      <div className="absolute inset-0">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-center lg:text-left animate-fade-in w-full">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ color: '#353B40' }}>
              {t('hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              {t('hero.description')}
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mb-8 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm sm:text-base">{t('hero.features.fastEasy')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm sm:text-base">{t('hero.features.secure')}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-secondary-600" />
                </div>
                <span className="text-gray-700 font-medium text-sm sm:text-base">{t('hero.features.support')}</span>
              </div>
            </div>

            {/* Abstract decorative image */}
            <div className="hidden lg:block absolute -left-20 top-1/2 -translate-y-1/2 opacity-10">
              <div className="w-96 h-96 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full filter blur-3xl"></div>
            </div>
          </div>

          {/* Right side - Buy/Sell Widget */}
          <div className="relative flex justify-center lg:justify-end animate-scale-in w-full" style={{ zIndex: 20 }}>
            <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-0" style={{ position: 'relative', zIndex: 30 }}>
              <BuySellWidget />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}