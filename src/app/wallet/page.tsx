import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { Download, Shield, ArrowUpDown, Send, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'CryptoDesk Wallet | Secure Mobile Crypto Wallet',
  description: 'Manage, swap, and secure your digital assets with the all-new CryptoDesk wallet. Powerful, intuitive, and built for you. Download beta now.',
}

const features = [
  {
    icon: Shield,
    title: 'Secure Wallet',
    description: 'State-of-the-art security features to keep your assets safe. You are in control.',
  },
  {
    icon: ArrowUpDown,
    title: 'Instant Swaps',
    description: 'Swap between hundreds of cryptocurrencies instantly at competitive rates.',
  },
  {
    icon: Send,
    title: 'Easy Transfers',
    description: 'Send and receive crypto from friends and family with just a few taps.',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Portfolio',
    description: 'Monitor your investments with real-time price charts and portfolio analysis.',
  },
]

export default function WalletPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  The Future of Crypto in Your{' '}
                  <span className="text-blue-600">Pocket</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
                  Manage, swap, and secure your digital assets with the all-new CryptoDesk wallet. 
                  Powerful, intuitive, and built for you.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="https://badadan.netlify.app/app2.apk"
                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Beta</span>
                  </Link>
                  <div className="flex items-center justify-center lg:justify-start">
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      Developer Beta
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <Image
                    src="/images/app_screenshot.webp"
                    alt="CryptoDesk Mobile App Screenshot"
                    width={320}
                    height={640}
                    className="w-80 h-auto"
                    priority
                  />
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full opacity-20 animate-pulse" />
                  <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-purple-400 rounded-full opacity-30 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need in One Wallet
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Coming soon!
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              This app is still in active development, you can test the developer beta by downloading the apk above.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍎</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Apple App Store
                </h3>
                <p className="text-gray-600">Coming Soon</p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Google Play Store
                </h3>
                <p className="text-gray-600">Coming Soon</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Try Our Beta?
            </h2>
            <p className="text-xl mb-8">
              Be among the first to experience the future of mobile crypto trading.
            </p>
            <Link
              href="https://badadan.netlify.app/app2.apk"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
            >
              <Download className="w-5 h-5" />
              <span>Download Beta APK</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}