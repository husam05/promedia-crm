'use client'

interface ProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  color?: string
}

export default function ProgressRing({ value, size = 120, strokeWidth = 8, label, color }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference
  const gradientId = `ring-gradient-${Math.random().toString(36).slice(2, 7)}`

  const getColors = () => {
    if (color) return { start: color, end: color }
    if (value >= 80) return { start: '#10b981', end: '#06b6d4' }
    if (value >= 60) return { start: '#f59e0b', end: '#f97316' }
    if (value >= 40) return { start: '#f97316', end: '#ef4444' }
    return { start: '#ef4444', end: '#dc2626' }
  }

  const colors = getColors()

  return (
    <div className="relative inline-flex items-center justify-center animate-ring-glow">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 6px ${colors.start}40)`,
          }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-2xl font-bold text-white">{value}</span>
        {label && <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>}
      </div>
    </div>
  )
}
