import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, Lightbulb, Shield, Users } from 'lucide-react'
import Image from 'next/image'

export const metadata = {
  title: 'About CryptoDesk | Our Mission & Vision',
  description: 'Learn about CryptoDesk\'s mission to make cryptocurrency accessible and secure for everyone. Discover our story, values, and the team behind the platform.',
}

const coreValues = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We constantly explore new technologies to enhance your crypto experience.',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Protecting your assets and data is our utmost priority.',
  },
  {
    icon: Users,
    title: 'User-Focus',
    description: 'We design our platform with your needs and ease of use in mind.',
  },
]

const partners = [
  {
    name: 'Antler',
    logo: 'https://img.icons8.com/?size=100&id=n74xIW3Zvba0&format=png&color=000000',
    website: 'https://www.antler.co'
  },
  {
    name: 'The Catalyst Fund',
    logo: 'https://img.icons8.com/?size=100&id=n74xIW3Zvba0&format=png&color=000000',
    website: 'https://thecatalystfund.com'
  }
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Back to Home */}
        <section className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About CryptoDesk
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              CryptoDesk is a dynamic new startup poised to make a significant impact in the cryptocurrency space. 
              We are driven by a passion for digital finance and a commitment to making crypto accessible, secure, 
              and user-friendly for everyone.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Mission: Innovating Crypto Together
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    CryptoDesk is a dynamic new startup poised to make a significant impact in the cryptocurrency space. 
                    We are driven by a passion for digital finance and a commitment to making crypto accessible, secure, 
                    and user-friendly for everyone.
                  </p>
                  <p className="font-medium text-gray-700">
                    "Our journey is just beginning, but our vision is clear: to build innovative solutions that empower 
                    individuals and businesses to navigate the world of digital assets with confidence."
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-block p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl">
                  <div className="w-32 h-32 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-4xl">C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Funding Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Journey, Fueled by Visionary Partners
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We are thrilled to announce that we've recently secured our first round of funding from two prestigious 
                venture capital firms. This milestone is a testament to our potential and the exciting future ahead for 
                CryptoDesk. We are proud to be backed by:
              </p>
            </div>
            
            <div className="flex justify-center items-center space-x-12">
              {partners.map((partner, index) => (
                <Link
                  key={index}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-6 bg-white rounded-xl hover:shadow-lg transition-all"
                >
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={48}
                    height={48}
                  />
                  <span className="font-semibold text-gray-900">{partner.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Our Core Values
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {coreValues.map((value, index) => {
                const IconComponent = value.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Future Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              The Future with CryptoDesk
            </h2>
            <p className="text-xl leading-relaxed mb-8">
              With this new support, we are accelerating the development of our platform and expanding our team. 
              We are excited to bring you a seamless and powerful cryptocurrency experience. Stay tuned for what's next!
            </p>
            <p className="text-blue-200 text-sm">
              Page last updated: January 8, 2025
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}