import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | CryptoDesk',
  description: 'Terms of Service for swiftnbuy cryptocurrency trading platform.',
}

export default function TermsOfServicePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Back to Home */}
        <section className="bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Terms of Service
              </h1>
            </div>

            <div className="prose prose-lg max-w-none">
              
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  By using our services, you confirm that you have read and agree to be bound by these terms. This applies to both individual and organizational users.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Eligibility
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Users must be 18+ years old and have the legal capacity to enter into a contract. Organizational users must have binding authority.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Account Registration
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You must:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Provide accurate, current information</li>
                  <li>Be responsible for account security</li>
                  <li>Notify us of unauthorized access</li>
                </ul>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Use of Services
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Services must be used for lawful purposes only. Prohibited activities include:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Exploiting minors</li>
                  <li>Spam or impersonation</li>
                  <li>Inappropriate solicitations</li>
                </ul>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Cryptocurrency Trading
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Trading cryptocurrencies involves significant risks:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Prices can fluctuate dramatically</li>
                  <li>Potential for significant financial losses</li>
                  <li>Unique cryptocurrency risks</li>
                  <li>Cryptocurrencies lack central bank protection</li>
                </ul>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Intellectual Property Rights
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Services content is protected by copyright and owned by swiftnbuy and its licensors.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Termination
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  The company can suspend access without notice. User rights cease upon termination.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Disclaimer of Warranties
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Services are provided "AS IS" with no explicit warranties offered.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Limitation of Liability
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We exclude indirect/consequential damages and limit our financial responsibility.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  10. Governing Law
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  These terms are governed by Kenyan law. Certain enforcement rights are waived.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  11. Changes to Terms
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify these terms with 30 days' notice for material changes.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  12. Contact Information
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Support email: {' '}
                  <a href="mailto:support@swiftnbuy.app" className="text-blue-600 hover:text-blue-700">
                    support@swiftnbuy.app
                  </a>
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}