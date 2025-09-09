import { Shield, Lock, Award, Eye, CheckCircle, Server, Key, FileCheck } from 'lucide-react'

const securityFeatures = [
  {
    icon: Shield,
    title: 'Industry-Leading Security',
    description: 'Utilizing advanced encryption and security protocols to safeguard your data.',
    color: 'blue'
  },
  {
    icon: Award,
    title: 'Regulated & Compliant',
    description: 'Adhering to strict regulatory standards, including KYC/AML policies.',
    color: 'green'
  },
  {
    icon: Lock,
    title: 'Secure Wallet Infrastructure',
    description: 'Multi-signature wallets and cold storage solutions for asset protection.',
    color: 'purple'
  },
  {
    icon: Eye,
    title: 'Data Privacy',
    description: 'Your personal information is handled with the utmost care and privacy.',
    color: 'orange'
  }
]

const complianceBadges = [
  { icon: Shield, label: 'SSL Secured' },
  { icon: FileCheck, label: 'PCI DSS' },
  { icon: Key, label: '2FA' },
  { icon: Server, label: 'ISO 27001' },
]

export default function SecuritySection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Your Security is Our Top Priority
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            We implement robust security measures to protect your assets and personal information.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {securityFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600',
            }
            
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-2xl flex items-center justify-center mb-4`}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Compliance Section */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Compliance & Security Partners
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {complianceBadges.map((badge, index) => {
              const IconComponent = badge.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                    <IconComponent className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {badge.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-1">256-bit</div>
                <div className="text-sm text-gray-600">SSL Encryption</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-1">99.9%</div>
                <div className="text-sm text-gray-600">Uptime Guarantee</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Security Monitoring</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Promise */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Your funds are SAFU (Secure Asset Fund for Users)</span>
          </div>
        </div>
      </div>
    </section>
  )
}