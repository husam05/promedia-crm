'use client'

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
  danger: { btn: 'bg-red-600 hover:bg-red-700', icon: '⚠' },
  warning: { btn: 'bg-amber-600 hover:bg-amber-700', icon: '⚠' },
  info: { btn: 'bg-blue-600 hover:bg-blue-700', icon: 'ℹ' },
}

export default function ConfirmDialog({ isOpen, title, message, confirmText = 'تأكيد', cancelText = 'إلغاء', onConfirm, onCancel, variant = 'danger' }: ConfirmDialogProps) {
  if (!isOpen) return null
  const config = variantConfig[variant]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="text-center mb-4">
          <span className="text-3xl">{config.icon}</span>
          <h3 className="text-lg font-bold text-white mt-2">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">{message}</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 text-white rounded-xl transition-colors text-sm font-medium ${config.btn}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
