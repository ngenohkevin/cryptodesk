'use client'

import Link from 'next/link'
import { ChevronDown, Mail, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Logo from '@/components/common/Logo'

export default function Footer() {
  const { t } = useLanguage()
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
              <div className="flex items-center space-x-1 cursor-pointer">
                <span className="text-sm">🌐</span>
                <span className="text-sm">{t('header.language')}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
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
                <Link href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('footer.liveChat')}</span>
                </Link>
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