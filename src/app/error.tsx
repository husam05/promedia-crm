'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#060b18' }}>
      <div
        className="glass-card p-8 max-w-md w-full text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.5))',
          border: '1px solid rgba(239, 68, 68, 0.15)',
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.08)',
          }}
        >
          <AlertTriangle size={28} className="text-red-400" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          حدث خطأ غير متوقع
        </h2>

        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-right">
            <p className="text-xs text-red-400/80 font-mono break-all" dir="ltr">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:translate-y-[-1px]"
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.2))',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              boxShadow: '0 4px 16px rgba(6, 182, 212, 0.1)',
            }}
          >
            <RotateCcw size={14} />
            إعادة المحاولة
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-200 transition-all duration-200 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]"
          >
            <RefreshCw size={14} />
            تحديث الصفحة
          </button>
        </div>
      </div>
    </div>
  )
}
