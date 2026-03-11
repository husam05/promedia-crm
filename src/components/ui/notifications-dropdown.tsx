'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Bell } from 'lucide-react'
import { Alert } from '@/types'
import AlertBadge from '@/components/ui/alert-badge'

interface NotificationsDropdownProps {
  alerts: Alert[]
  className?: string
}

const severityOrder: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMinutes < 1) return 'الآن'
  if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`
  if (diffHours < 24) return `منذ ${diffHours} ساعة`
  if (diffDays < 7) return `منذ ${diffDays} يوم`
  return date.toLocaleDateString('ar-IQ')
}

export default function NotificationsDropdown({ alerts, className }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  const unreadAlerts = useMemo(
    () => alerts.filter(a => !a.isRead && !readIds.has(a.id)),
    [alerts, readIds]
  )

  const sortedAlerts = useMemo(
    () => [...alerts].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]),
    [alerts]
  )

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleMarkAllRead = () => {
    setReadIds(new Set(alerts.map(a => a.id)))
  }

  const isAlertUnread = (alert: Alert) => !alert.isRead && !readIds.has(alert.id)

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="p-2.5 rounded-xl text-gray-400 hover:text-gray-200 transition-all bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]"
      >
        <Bell size={16} />
      </button>

      {/* Unread Badge */}
      {unreadAlerts.length > 0 && (
        <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-medium">
          {unreadAlerts.length}
        </span>
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute top-full mt-2 end-0 w-96 max-h-96 overflow-y-auto rounded-2xl border border-white/[0.08] animate-fade-in-down z-50"
          style={{
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.92), rgba(17, 24, 39, 0.85))',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 px-4 py-3 border-b border-white/[0.06]" style={{ background: 'rgba(17, 24, 39, 0.95)', backdropFilter: 'blur(24px)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">التنبيهات</h3>
                {unreadAlerts.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                    {unreadAlerts.length} جديد
                  </span>
                )}
              </div>
              {unreadAlerts.length > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  تحديد الكل كمقروء
                </button>
              )}
            </div>
          </div>

          {/* Alert List */}
          {sortedAlerts.length > 0 ? (
            <div className="py-1">
              {sortedAlerts.map(alert => {
                const unread = isAlertUnread(alert)
                return (
                  <div
                    key={alert.id}
                    className={`px-4 py-3 border-b border-white/[0.04] transition-colors hover:bg-white/[0.03] ${
                      unread ? 'bg-cyan-500/[0.04]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Unread dot */}
                      <div className="pt-1.5 shrink-0">
                        {unread ? (
                          <span className="block w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.4)]" />
                        ) : (
                          <span className="block w-2 h-2 rounded-full bg-transparent" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertBadge severity={alert.severity} />
                          <span className="text-xs font-semibold text-white truncate">
                            {alert.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                          {alert.message}
                        </p>
                        <p className="text-[10px] text-gray-600 mt-1.5">
                          {timeAgo(alert.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3">
                <Bell size={20} className="text-gray-600" />
              </div>
              <p className="text-sm text-gray-500 font-medium">لا توجد تنبيهات جديدة</p>
            </div>
          )}

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-white/[0.06] px-4 py-2.5" style={{ background: 'rgba(17, 24, 39, 0.95)', backdropFilter: 'blur(24px)' }}>
            <button className="w-full text-center text-[12px] text-cyan-400 hover:text-cyan-300 transition-colors font-medium py-1">
              عرض جميع التنبيهات
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
