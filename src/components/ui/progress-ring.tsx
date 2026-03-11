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

  const getColor = () => {
    if (color) return color
    if (value >= 80) return '#10b981'
    if (value >= 60) return '#f59e0b'
    if (value >= 40) return '#f97316'
    return '#ef4444'
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-2xl font-bold text-white">{value}</span>
        {label && <p className="text-xs text-gray-400">{label}</p>}
      </div>
    </div>
  )
}
