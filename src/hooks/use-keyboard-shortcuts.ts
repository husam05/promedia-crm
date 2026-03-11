'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useKeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea/select
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return

      // Navigation shortcuts: Alt+1 through Alt+6
      if (e.altKey) {
        switch (e.key) {
          case '1': e.preventDefault(); router.push('/dashboard'); break
          case '2': e.preventDefault(); router.push('/clients'); break
          case '3': e.preventDefault(); router.push('/financial'); break
          case '4': e.preventDefault(); router.push('/decisions'); break
          case '5': e.preventDefault(); router.push('/reports'); break
          case '6': e.preventDefault(); router.push('/settings'); break
        }
      }

      // Quick actions
      if (e.key === 'Escape') {
        // Close any open modals - dispatch custom event
        window.dispatchEvent(new CustomEvent('close-modals'))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])
}
