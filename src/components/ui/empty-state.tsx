'use client'

import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in-up ${className || ''}`}
    >
      {/* Decorative pattern - concentric circles */}
      <div className="relative mb-6">
        {/* Outer rings */}
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40"
          viewBox="0 0 160 160"
          fill="none"
        >
          <circle cx="80" cy="80" r="78" stroke="white" strokeOpacity="0.03" strokeWidth="1" />
          <circle cx="80" cy="80" r="62" stroke="white" strokeOpacity="0.04" strokeWidth="1" />
          <circle cx="80" cy="80" r="46" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
          {/* Dot pattern */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180
            const x = 80 + 70 * Math.cos(rad)
            const y = 80 + 70 * Math.sin(rad)
            return (
              <circle
                key={angle}
                cx={x}
                cy={y}
                r="1.5"
                fill="white"
                fillOpacity="0.06"
              />
            )
          })}
        </svg>

        {/* Icon container with gradient circle bg */}
        <div
          className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))',
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
          }}
        >
          <Icon size={32} className="text-gray-400" strokeWidth={1.5} />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>

      {/* Description */}
      <p className="text-sm text-gray-400 max-w-sm leading-relaxed">{description}</p>

      {/* Optional action button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:translate-y-[-1px] hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(139, 92, 246, 0.2))',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            boxShadow: '0 4px 16px rgba(6, 182, 212, 0.1)',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
