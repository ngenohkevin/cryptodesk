import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import CryptoList from '@/components/home/CryptoList'
import SecuritySection from '@/components/home/SecuritySection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import FAQSection from '@/components/home/FAQSection'
import CTASection from '@/components/home/CTASection'

export default function Home() {
  return (
    <>
      <Header />
      <main id="buy-crypto">
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