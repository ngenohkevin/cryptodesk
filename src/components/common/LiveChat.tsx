'use client'

import { useEffect } from 'react'

export default function LiveChat() {
  useEffect(() => {
    // Load Tidio chat widget
    const loadTidioScript = () => {
      const publicKey = process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY

      if (!publicKey) {
        console.error('Tidio public key not found in environment variables')
        return
      }

      const tidioScript = document.createElement('script')
      tidioScript.src = `//code.tidio.co/${publicKey}.js`
      tidioScript.async = true
      document.body.appendChild(tidioScript)
    }

    // Load script after a short delay to improve initial page load performance
    const timer = setTimeout(loadTidioScript, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return null
}