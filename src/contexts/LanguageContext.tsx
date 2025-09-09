'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

// Import translation files directly
import enTranslations from '../../messages/en.json'
import esTranslations from '../../messages/es.json'
import frTranslations from '../../messages/fr.json'
import deTranslations from '../../messages/de.json'

const translations = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
  de: deTranslations
}

type Language = 'en' | 'es' | 'fr' | 'de'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: unknown = translations[language]

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }

    return (typeof value === 'string' ? value : key)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}