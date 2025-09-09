import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Your Crypto Journey?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join millions who trust CryptoDesk for fast, secure, and easy crypto transactions. Sign up today!
        </p>
        
        <Link
          href="#buy-crypto"
          className="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg"
        >
          <span>Get Started Now</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  )
}