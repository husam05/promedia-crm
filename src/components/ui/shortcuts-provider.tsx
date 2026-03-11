'use client'
import { useState, useEffect, useCallback } from 'react'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import KeyboardShortcutsDialog from '@/components/ui/keyboard-shortcuts-dialog'

export default function ShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [showHelp, setShowHelp] = useState(false)

  useKeyboardShortcuts()

  const handleClose = useCallback(() => setShowHelp(false), [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return

      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault()
        setShowHelp((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Listen for close-modals custom event
  useEffect(() => {
    const handleCloseModals = () => setShowHelp(false)
    window.addEventListener('close-modals', handleCloseModals)
    return () => window.removeEventListener('close-modals', handleCloseModals)
  }, [])

  return (
    <>
      {children}
      <KeyboardShortcutsDialog open={showHelp} onClose={handleClose} />
    </>
  )
}
