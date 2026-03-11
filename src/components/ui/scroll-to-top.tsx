'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <button
      onClick={scrollToTop}
      aria-label="العودة للأعلى"
      className={`fixed bottom-6 start-6 z-40 flex items-center justify-center w-11 h-11 rounded-xl text-cyan-400 transition-all duration-300 cursor-pointer hover:translate-y-[-2px] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-cyan-400 ${
        visible
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-75 pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(12, 18, 34, 0.9))',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(6, 182, 212, 0.05)',
      }}
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  )
}
