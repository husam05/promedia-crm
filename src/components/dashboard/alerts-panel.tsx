'use client'

import { Alert } from '@/types'
import AlertBadge from '@/components/ui/alert-badge'
import { Bell } from 'lucide-react'

interface Props {
  alerts: Alert[]
}

export default function AlertsPanel({ alerts }: Props) {
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })

  const unreadCount = alerts.filter(a => !a.isRead).length

  return (
    <div className="glass-card p-5 animate-fade-in-up stagger-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Bell size={16} className="text-cyan-400" />
          التنبيهات
        </h2>
        {unreadCount > 0 && (
          <span className="bg-red-500/10 text-red-400 text-[11px] px-2.5 py-1 rounded-lg font-medium animate-pulse-glow">
            {unreadCount} جديد
          </span>
        )}
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-xl border transition-all duration-200 hover:bg-white/[0.02] ${
              alert.isRead
                ? 'border-white/[0.03] opacity-50'
                : 'border-white/[0.06] bg-white/[0.01]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertBadge severity={alert.severity} />
                  <span className="text-sm font-medium text-white">{alert.title}</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">{alert.message}</p>
                {alert.action && (
                  <button className="mt-2 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                    {alert.action} ←
                  </button>
                )}
              </div>
              {!alert.isRead && (
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0 animate-pulse-glow" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
