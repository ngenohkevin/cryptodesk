import Link from 'next/link'
import { ChevronDown, Mail, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-semibold">CryptoDesk</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Cryptocurrency services are provided by CryptoDesk Group. Trading cryptocurrencies carries a high level of risk and may not be suitable for all investors.
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300">Language:</span>
              <div className="flex items-center space-x-1 cursor-pointer">
                <span className="text-sm">🌐</span>
                <span className="text-sm">English</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Products</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#buy-crypto" className="text-gray-300 hover:text-white transition-colors">
                  Buy Bitcoin
                </Link>
              </li>
              <li>
                <Link href="/#buy-crypto" className="text-gray-300 hover:text-white transition-colors">
                  Buy Ethereum
                </Link>
              </li>
              <li>
                <Link href="/#sell-crypto" className="text-gray-300 hover:text-white transition-colors">
                  Sell Tether
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/wallet" className="text-gray-300 hover:text-white transition-colors">
                  Wallet
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <span>Careers</span>
                  <span className="bg-green-600 text-xs px-2 py-1 rounded-full">Hiring</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="mailto:support@cryptodesk.app" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>support@cryptodesk.app</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Live Chat</span>
                </Link>
              </li>
            </ul>
            <div className="space-y-2 mt-6">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">© 2025 CryptoDesk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}