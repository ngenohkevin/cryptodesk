import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | CryptoDesk',
  description: 'Privacy Policy for swiftnbuy cryptocurrency platform.',
}

export default function PrivacyPolicyPage() {
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
                Privacy Policy
              </h1>
            </div>

            <div className="prose prose-lg max-w-none">

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Information Collection
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We collect log data, device data, and personal information as necessary to provide our services.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Logs include IP address, browser details, page visits, and device information.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Legal Bases for Processing
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We process information based on:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Contract performance</li>
                  <li>Legitimate interests</li>
                  <li>User consent</li>
                  <li>Legal obligations</li>
                </ul>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Information Usage
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Provide and maintain services</li>
                  <li>Improve and personalize user experience</li>
                  <li>Communicate with users</li>
                  <li>Process transactions</li>
                  <li>Prevent fraud</li>
                </ul>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Information Security
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We use commercially acceptable means to protect your data. However, we acknowledge that no transmission method is 100% secure.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Information Sharing
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We do not share any personally identifying information publicly or with third-parties, except when required to by law.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. User Rights
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Refuse personal information requests</li>
                  <li>Access collected data</li>
                  <li>Request data correction</li>
                  <li>Request data deletion</li>
                  <li>Object to data processing</li>
                </ul>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Children's Privacy
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We do not serve users under 18. We immediately delete any inadvertently collected child data.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Policy Changes
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this policy periodically. Changes are effective immediately upon posting.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Contact
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