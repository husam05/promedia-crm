'use client'

import { AlertTriangle, AlertCircle, Info } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}

const variantConfig = {
  danger: { icon: AlertTriangle, color: 'text-red-400', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' },
  warning: { icon: AlertCircle, color: 'text-amber-400', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' },
  info: { icon: Info, color: 'text-blue-400', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)' },
}

export default function ConfirmDialog({ isOpen, title, message, confirmText = 'تأكيد', cancelText = 'إلغاء', onConfirm, onCancel, variant = 'danger' }: ConfirmDialogProps) {
  if (!isOpen) return null
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={onCancel}>
      <div
        className="w-full max-w-md mx-4 p-6 animate-scale-in rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(12, 18, 34, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className={`w-12 h-12 rounded-2xl ${config.color} flex items-center justify-center mx-auto`} style={{ background: config.bg }}>
            <Icon size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mt-3">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">{message}</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] text-gray-400 rounded-xl hover:bg-white/[0.05] hover:text-gray-200 transition-all text-sm font-medium">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:translate-y-[-1px]"
            style={{ background: config.bg, border: `1px solid ${config.border}`, color: 'inherit' }}
          >
            <span className={config.color}>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
