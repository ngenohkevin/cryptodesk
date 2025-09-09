'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "What is CryptoDesk?",
    answer: "CryptoDesk is a comprehensive cryptocurrency trading platform that allows you to buy, sell, and manage digital assets securely. We provide fast transactions, competitive rates, and top-tier security for all your crypto needs."
  },
  {
    question: "Is CryptoDesk secure?",
    answer: "Yes, security is our top priority. We use industry-leading encryption, multi-signature wallets, cold storage solutions, and comply with strict regulatory standards including KYC/AML policies to protect your assets and personal information."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept major payment methods including Visa, Mastercard, PayPal, bank transfers, and various other payment options depending on your region. All payments are processed securely through our verified payment partners."
  },
  {
    question: "How long do transactions take?",
    answer: "Most crypto purchases are completed within minutes. Bank transfers may take 1-3 business days to process. Crypto-to-crypto swaps are typically instant, while crypto sales to fiat may take 1-2 business days to reach your account."
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-6">
            <span className="text-2xl">❓</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Find answers to common questions about CryptoDesk services and cryptocurrency trading.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="h-px bg-gray-200 mb-4" />
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}