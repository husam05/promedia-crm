interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple'
  icon?: string
}

const colorMap = {
  emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
  blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
  amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
  red: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
  purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
}

export default function StatCard({ title, value, subtitle, trend, trendValue, color = 'emerald', icon }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-bl ${colorMap[color]} border rounded-2xl p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1 text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {icon && <span className="text-3xl opacity-60">{icon}</span>}
      </div>
      {trend && trendValue && (
        <div className={`mt-3 text-xs flex items-center gap-1 ${
          trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
        }`}>
          <span>{trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●'}</span>
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  )
}
