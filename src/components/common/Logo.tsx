'use client'

import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'white' | 'dark'
  showText?: boolean
  className?: string
}

export default function Logo({
  size = 'md',
  variant = 'default',
  showText = true,
  className = ''
}: LogoProps) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl' }
  }

  const variants = {
    default: {
      text: 'bg-gradient-to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent'
    },
    white: {
      text: 'text-white'
    },
    dark: {
      text: 'text-gray-900'
    }
  }

  const textClasses = `${sizes[size].text} font-bold ${variants[variant].text}`

  return (
    <Link href="/" className={`flex items-center space-x-2 group ${className}`}>
      {/* Logo Icon - SVG */}
      <div className={`${sizes[size].icon} flex items-center justify-center group-hover:scale-110 transition-all duration-300`}>
        <Image
          src="/icons/logo.svg"
          alt="Crypulse Logo"
          width={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
          height={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
          className="w-full h-full"
          priority
        />
      </div>

      {/* Brand Name */}
      {showText && (
        <span className={textClasses}>
          Crypulse
        </span>
      )}
    </Link>
  )
}