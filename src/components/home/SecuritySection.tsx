'use client'

import { useState, useEffect } from 'react'
import { Shield, Lock, Database, Eye } from 'lucide-react'

const securityFeatures = [
  {
    icon: Shield,
    title: 'Industry-Leading Security',
    description: 'Utilizing advanced encryption and security protocols to safeguard your data.'
  },
  {
    icon: Lock,
    title: 'Regulated & Compliant',
    description: 'Adhering to strict regulatory standards, including KYC/AML policies.'
  },
  {
    icon: Database,
    title: 'Secure Wallet Infrastructure',
    description: 'Multi-signature wallets and cold storage solutions for asset protection.'
  },
  {
    icon: Eye,
    title: 'Data Privacy',
    description: 'Your personal information is handled with the utmost care and privacy.'
  }
]

const securityPartners = [
  {
    image: '/images/ssl.png',
    alt: 'SSL Certificate',
    tooltip: 'SSL Secured - All data transmission is encrypted using industry-standard SSL/TLS protocols'
  },
  {
    image: '/images/gdpr.png',
    alt: 'GDPR Compliant',
    tooltip: 'GDPR Compliant - We adhere to the European General Data Protection Regulation'
  },
  {
    image: '/images/avg.png',
    alt: 'Data Protection',
    tooltip: 'Advanced security measures protect your data and transactions'
  },
  {
    image: '/images/eu.png',
    alt: 'EU Compliance',
    tooltip: 'European Union compliant - Meeting all EU regulatory requirements'
  }
]

export default function SecuritySection() {
  const [hoveredPartner, setHoveredPartner] = useState<number | null>(null)

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setHoveredPartner(null)
    }

    if (hoveredPartner !== null) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [hoveredPartner])

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Your Security is Our Top Priority
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            We implement robust security measures to protect your assets and personal information.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-16">
          {securityFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Compliance & Security Partners Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Compliance & Security Partners
          </h3>
          
          <div className="flex justify-center items-center gap-4 sm:gap-8 flex-wrap relative px-4">
            {securityPartners.map((partner, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredPartner(index)}
                onMouseLeave={() => setHoveredPartner(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  setHoveredPartner(hoveredPartner === index ? null : index)
                }}
              >
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-200 p-2 hover:shadow-md transition-shadow duration-300 cursor-pointer">
                  <img
                    src={partner.image}
                    alt={partner.alt}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Mobile-optimized Tooltip */}
                {hoveredPartner === index && (
                  <div className={`absolute bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg z-50 shadow-xl animate-in fade-in-0 zoom-in-95 duration-200 w-48 sm:w-auto sm:max-w-xs text-center ${
                    index <= 1 ? 'left-0' : index >= securityPartners.length - 2 ? 'right-0' : 'left-1/2 transform -translate-x-1/2'
                  }`}>
                    <div className="whitespace-normal leading-tight">
                      {partner.tooltip}
                    </div>
                    <div className={`absolute top-full w-2 h-2 bg-gray-900 rotate-45 ${
                      index <= 1 ? 'left-4' : index >= securityPartners.length - 2 ? 'right-4' : 'left-1/2 transform -translate-x-1/2'
                    }`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}