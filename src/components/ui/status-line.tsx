'use client'

import { useState, useEffect } from 'react'

export type StatusType = 'idle' | 'loading' | 'success' | 'error' | 'warning'

interface StatusLineProps {
  status: StatusType
  message: string
  onDismiss?: () => void
  autoHide?: boolean
  autoHideDelay?: number
}

const statusConfig: Record<StatusType, { icon: string; bg: string; border: string; text: string; animate: string }> = {
  idle: { icon: '●', bg: 'bg-gray-800/50', border: 'border-gray-700', text: 'text-gray-400', animate: '' },
  loading: { icon: '◌', bg: 'bg-blue-900/30', border: 'border-blue-500/40', text: 'text-blue-400', animate: 'animate-spin' },
  success: { icon: '✓', bg: 'bg-emerald-900/30', border: 'border-emerald-500/40', text: 'text-emerald-400', animate: '' },
  error: { icon: '✕', bg: 'bg-red-900/30', border: 'border-red-500/40', text: 'text-red-400', animate: '' },
  warning: { icon: '⚠', bg: 'bg-amber-900/30', border: 'border-amber-500/40', text: 'text-amber-400', animate: '' },
}

export default function StatusLine({ status, message, onDismiss, autoHide = true, autoHideDelay = 3000 }: StatusLineProps) {
  const [visible, setVisible] = useState(true)
  const config = statusConfig[status]

  useEffect(() => {
    setVisible(true)
    if (autoHide && status !== 'loading' && status !== 'idle') {
      const timer = setTimeout(() => {
        setVisible(false)
        onDismiss?.()
      }, autoHideDelay)
      return () => clearTimeout(timer)
    }
  }, [status, message, autoHide, autoHideDelay, onDismiss])

  if (!visible || status === 'idle') return null

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${config.bg} ${config.border} transition-all duration-300`}>
      {status === 'loading' ? (
        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <span className={`text-sm font-bold ${config.text}`}>{config.icon}</span>
      )}
      <span className={`text-sm ${config.text} flex-1`}>{message}</span>
      {status !== 'loading' && onDismiss && (
        <button onClick={() => { setVisible(false); onDismiss() }} className="text-gray-500 hover:text-gray-300 text-xs">
          ✕
        </button>
      )}
      {status === 'loading' && (
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      )}
    </div>
  )
}
