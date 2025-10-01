import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { ArrowLeft, MapPin, Send, ExternalLink } from 'lucide-react'

export const metadata = {
  title: 'Careers at CryptoDesk | Join Our Growing Team',
  description: 'We are passionate about building the future of finance. If you are driven, innovative, and want to make an impact, explore our open positions.',
}

const jobOpenings = [
  {
    title: 'Intermediate Flutter Developer',
    location: 'Fully Remote',
    type: 'remote',
    description: 'Develop and maintain high-quality mobile applications using Flutter. Collaborate with cross-functional teams to define, design, and ship new features.',
    applyEmail: 'support@cryptodesk.app?subject=Application%20for%20Intermediate%20Flutter%20Developer'
  },
  {
    title: 'Django Backend Developer',
    location: 'Remote',
    type: 'remote',
    description: 'Design, build, and maintain efficient, reusable, and reliable Python code using the Django framework. Ensure the best possible performance, quality, and responsiveness of applications.',
    applyEmail: 'support@cryptodesk.app?subject=Application%20for%20Django%20Backend%20Developer'
  },
  {
    title: 'React Developer',
    location: 'Remote',
    type: 'remote',
    description: 'Develop and implement user interface components using React.js concepts and workflows such as Redux, Flux, and Webpack. Optimize components for maximum performance.',
    applyEmail: 'support@cryptodesk.app?subject=Application%20for%20React%20Developer'
  },
  {
    title: 'Regional Marketer',
    location: 'Nairobi (On-site)',
    type: 'onsite',
    description: 'Develop and execute marketing strategies to enhance brand visibility and drive growth in the Nairobi region. Manage local marketing campaigns and events.',
    applyEmail: 'support@cryptodesk.app?subject=Application%20for%20Regional%20Marketer'
  },
  {
    title: 'Blockchain Developer (Rust)',
    location: 'Fully Remote',
    type: 'remote',
    description: 'Design, implement, and support blockchain-based networks and applications using Rust. Work on cutting-edge decentralized technologies.',
    applyEmail: 'support@cryptodesk.app?subject=Application%20for%20Blockchain%20Developer%20(Rust)'
  }
]

export default function CareersPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Careers at CryptoDesk
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We are passionate about building the future of finance. If you are driven, innovative, 
              and want to make an impact, explore our open positions below.
            </p>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Open Positions
              </h2>
            </div>

            <div className="space-y-6">
              {jobOpenings.map((job, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          job.type === 'remote' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {job.type === 'remote' ? 'Remote' : 'On-site'}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`mailto:${job.applyEmail}`}
                      className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
                      target="_self"
                      rel="noopener"
                    >
                      <Send className="w-4 h-4" />
                      <span>Apply Now</span>
                    </a>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {job.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Apply */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                How to Apply
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Interested candidates are invited to send their CV and a cover letter to support@cryptodesk.app 
                with the job title in the subject line.
              </p>
              
              <a
                href="mailto:support@cryptodesk.app"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
                target="_self"
                rel="noopener"
              >
                <Send className="w-5 h-5" />
                <span>support@cryptodesk.app</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Page last updated: January 8, 2025
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Shape the Future of Crypto?
            </h2>
            <p className="text-xl mb-8">
              Join our mission to make cryptocurrency accessible and secure for everyone.
            </p>
            <a
              href="mailto:support@cryptodesk.app"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
              target="_self"
              rel="noopener"
            >
              <Send className="w-5 h-5" />
              <span>Get In Touch</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}