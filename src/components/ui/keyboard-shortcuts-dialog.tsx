'use client'
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface KeyboardShortcutsDialogProps {
  open: boolean
  onClose: () => void
}

interface Shortcut {
  keys: string[]
  description: string
}

const navigationShortcuts: Shortcut[] = [
  { keys: ['Alt', '1'], description: 'لوحة التحكم' },
  { keys: ['Alt', '2'], description: 'العملاء' },
  { keys: ['Alt', '3'], description: 'المالية' },
  { keys: ['Alt', '4'], description: 'القرارات' },
  { keys: ['Alt', '5'], description: 'التقارير' },
  { keys: ['Alt', '6'], description: 'الإعدادات' },
]

const actionShortcuts: Shortcut[] = [
  { keys: ['Ctrl', 'K'], description: 'لوحة الأوامر' },
  { keys: ['Esc'], description: 'إغلاق النافذة' },
  { keys: ['?'], description: 'هذه المساعدة' },
]

function Kbd({ children }: { children: string }) {
  return (
    <kbd className="bg-white/[0.06] border border-white/[0.1] rounded-lg px-2 py-1 text-xs font-mono text-gray-300">
      {children}
    </kbd>
  )
}

function ShortcutRow({ shortcut }: { shortcut: Shortcut }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-400">{shortcut.description}</span>
      <div className="flex items-center gap-1">
        {shortcut.keys.map((key, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-gray-600 text-xs">+</span>}
            <Kbd>{key}</Kbd>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function KeyboardShortcutsDialog({ open, onClose }: KeyboardShortcutsDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0a0e1a]/90 backdrop-blur-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">اختصارات لوحة المفاتيح</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors rounded-lg p-1 hover:bg-white/[0.06]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="mb-5">
          <h3 className="text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">التنقل</h3>
          <div className="divide-y divide-white/[0.06]">
            {navigationShortcuts.map((shortcut, i) => (
              <ShortcutRow key={i} shortcut={shortcut} />
            ))}
          </div>
        </div>

        {/* Actions Section */}
        <div>
          <h3 className="text-xs font-medium text-cyan-400 uppercase tracking-wider mb-2">إجراءات</h3>
          <div className="divide-y divide-white/[0.06]">
            {actionShortcuts.map((shortcut, i) => (
              <ShortcutRow key={i} shortcut={shortcut} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
