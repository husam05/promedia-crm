'use client'

import { Alert } from '@/types'
import AlertBadge from '@/components/ui/alert-badge'

interface Props {
  alerts: Alert[]
}

export default function AlertsPanel({ alerts }: Props) {
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">التنبيهات</h2>
        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full">
          {alerts.filter(a => !a.isRead).length} جديد
        </span>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {sortedAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-xl border transition-all hover:bg-gray-800/50 ${
              alert.isRead ? 'border-gray-800 opacity-60' : 'border-gray-700 bg-gray-800/30'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertBadge severity={alert.severity} />
                  <span className="text-sm font-medium text-white">{alert.title}</span>
                </div>
                <p className="text-xs text-gray-400">{alert.message}</p>
                {alert.action && (
                  <button className="mt-2 text-xs text-emerald-400 hover:text-emerald-300">
                    {alert.action} ←
                  </button>
                )}
              </div>
              {!alert.isRead && (
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
