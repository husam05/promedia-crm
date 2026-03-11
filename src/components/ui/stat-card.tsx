'use client'

import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple'
  icon?: LucideIcon
}

const colorConfig = {
  emerald: {
    gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    border: 'border-emerald-500/15 hover:border-emerald-500/25',
    accent: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    glow: 'hover:shadow-emerald-500/5',
  },
  blue: {
    gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
    border: 'border-blue-500/15 hover:border-blue-500/25',
    accent: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    glow: 'hover:shadow-blue-500/5',
  },
  amber: {
    gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    border: 'border-amber-500/15 hover:border-amber-500/25',
    accent: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    glow: 'hover:shadow-amber-500/5',
  },
  red: {
    gradient: 'from-red-500/10 via-red-500/5 to-transparent',
    border: 'border-red-500/15 hover:border-red-500/25',
    accent: 'text-red-400',
    iconBg: 'bg-red-500/10',
    glow: 'hover:shadow-red-500/5',
  },
  purple: {
    gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
    border: 'border-purple-500/15 hover:border-purple-500/25',
    accent: 'text-purple-400',
    iconBg: 'bg-purple-500/10',
    glow: 'hover:shadow-purple-500/5',
  },
}

export default function StatCard({ title, value, subtitle, trend, trendValue, color = 'emerald', icon }: StatCardProps) {
  const cfg = colorConfig[color]

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-bl ${cfg.gradient} ${cfg.border} border rounded-2xl p-5 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl ${cfg.glow} group`}
      style={{
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-l from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1.5 text-white animate-count-up">{value}</p>
          {subtitle && <p className="text-[11px] text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <span className={`${cfg.iconBg} ${cfg.accent} w-10 h-10 flex items-center justify-center rounded-xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300`}>
            {(() => { const IconComponent = icon; return <IconComponent size={20} /> })()}
          </span>
        )}
      </div>
      {trend && trendValue && (
        <div className={`mt-3 text-xs flex items-center gap-1.5 ${
          trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-500'
        }`}>
          {trend === 'up' ? <TrendingUp size={13} /> : trend === 'down' ? <TrendingDown size={13} /> : <Minus size={13} />}
          <span className="font-medium">{trendValue}</span>
        </div>
      )}
    </div>
  )
}
