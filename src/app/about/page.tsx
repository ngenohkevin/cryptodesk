import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, Lightbulb, Shield, Users, DollarSign } from 'lucide-react'

export const metadata = {
  title: 'About Us | CryptoDesk',
  description: 'About swiftnbuy - A dynamic new startup in the cryptocurrency space.',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        {/* Back to Home */}
        <section className="bg-white py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </section>

        {/* Hero Section with Logo */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              About swiftnbuy
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
              swiftnbuy is a dynamic new startup poised to make a significant impact in the cryptocurrency space. We are driven by a passion for digital finance and a commitment to making crypto accessible, secure, and user-friendly for everyone.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-12 shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Our Mission: Innovating Crypto Together
              </h2>
              <div className="space-y-6 text-gray-600">
                <p className="leading-relaxed">
                  swiftnbuy is a dynamic new startup poised to make a significant impact in the cryptocurrency space. We are driven by a passion for digital finance and a commitment to making crypto accessible, secure, and user-friendly for everyone.
                </p>
                <p className="leading-relaxed">
                  Our journey is just beginning, but our vision is clear: to build innovative solutions that empower individuals and businesses to navigate the world of digital assets with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Funding Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-100 rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Journey, Fueled by Visionary Partners
              </h2>
              <p className="text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto">
                We are thrilled to announce that we've recently secured our first round of funding from two prestigious venture capital firms. This milestone is a testament to our potential and the exciting future ahead for swiftnbuy. We are proud to be backed by:
              </p>
              <div className="flex justify-center items-center space-x-16">
                <a 
                  href="https://www.antler.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-center hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="https://cdn.prod.website-files.com/62d19f82a58657afab15127b/634e9d046e47a91122da631d_antler-logo-red.svg" 
                    alt="Antler logo" 
                    className="h-12 mx-auto mb-2"
                  />
                  <p className="text-gray-600 text-sm">Antler</p>
                </a>
                <a 
                  href="https://www.thecatalystfund.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-center hover:opacity-80 transition-opacity"
                >
                  <img 
                    src="https://cdn.prod.website-files.com/6704d988d44fef67a9c2878e/6749cd4bf1f583e1b4ab5c5c_%E2%80%8BHorizontal%20logo%2C%20full%20color-p-500.png" 
                    alt="The Catalyst Fund logo" 
                    className="h-12 mx-auto mb-2"
                  />
                  <p className="text-gray-600 text-sm">The Catalyst Fund</p>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Innovation</h3>
                <p className="text-gray-600 leading-relaxed">
                  We constantly explore new technologies to enhance your crypto experience.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  Protecting your assets and data is our utmost priority.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">User-Focus</h3>
                <p className="text-gray-600 leading-relaxed">
                  We design our platform with your needs and ease of use in mind.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Future Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-900 rounded-2xl p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-6">
                The Future with swiftnbuy
              </h2>
              <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
                With this new support, we are accelerating the development of our platform and expanding our team. We are excited to bring you a seamless and powerful cryptocurrency experience. Stay tuned for what's next!
              </p>
            </div>
          </div>
        </section>

        {/* Last Updated */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 text-sm">
              Page last updated: {(() => {
                const date = new Date();
                date.setDate(date.getDate() - 2); // Always 2 days ago
                return date.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                });
              })()}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}