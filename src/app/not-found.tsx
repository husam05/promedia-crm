import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#060b18' }}>
      <div
        className="glass-card p-8 max-w-md w-full text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.5))',
          border: '1px solid rgba(6, 182, 212, 0.15)',
        }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{
            background: 'rgba(6, 182, 212, 0.1)',
          }}
        >
          <span className="text-3xl font-bold text-cyan-400">404</span>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          الصفحة غير موجودة
        </h2>

        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:translate-y-[-1px]"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.2))',
            border: '1px solid rgba(6, 182, 212, 0.3)',
          }}
        >
          العودة للوحة التحكم
        </Link>
      </div>
    </div>
  )
}
