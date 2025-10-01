import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import CryptoList from '@/components/home/CryptoList'
import SecuritySection from '@/components/home/SecuritySection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import FAQSection from '@/components/home/FAQSection'
import CTASection from '@/components/home/CTASection'

import { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://cryptbuy.top',
  },
}

export default function Home() {
  return (
    <>
      <Header />
      <main id="buy-crypto" className="relative">
        <h1 className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0" style={{ clip: 'rect(0, 0, 0, 0)' }}>Sell Cryptocurrency with 15% Profit Bonus - Best Bitcoin, Ethereum, USDT Exchange</h1>
        <HeroSection />
        <FeaturesSection />
        <CryptoList />
        <SecuritySection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}