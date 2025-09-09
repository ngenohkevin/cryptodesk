'use client'

import { Zap, Shield, Headphones, Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const features = [
  {
    icon: Zap,
    titleKey: 'features.fast.title',
    descriptionKey: 'features.fast.description',
    color: 'orange',
  },
  {
    icon: Shield,
    titleKey: 'features.security.title',
    descriptionKey: 'features.security.description',
    color: 'blue',
  },
  {
    icon: Headphones,
    titleKey: 'features.support.title',
    descriptionKey: 'features.support.description',
    color: 'purple',
  },
  {
    icon: Globe,
    titleKey: 'features.global.title',
    descriptionKey: 'features.global.description',
    color: 'green',
  },
]

export default function FeaturesSection() {
  const { t } = useLanguage()
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#353B40' }}>
{t('features.title')}
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            const colorClasses = {
              orange: 'bg-orange-100 text-orange-600 group-hover:bg-orange-200',
              blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
              purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
              green: 'bg-green-100 text-green-600 group-hover:bg-green-200',
            }
            
            return (
              <div
                key={index}
                className="group bg-white p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-2xl mb-4 transition-all duration-300`}>
                  <IconComponent className="w-7 h-7 lg:w-8 lg:h-8" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold mb-3" style={{ color: '#353B40' }}>
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}