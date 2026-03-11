'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/ui/sidebar'
import {
  Power,
  Banknote,
  FileText,
  UserX,
  UserCog,
  FileBarChart,
  UserPlus,
  Filter,
  Inbox,
} from 'lucide-react'
import type { Activity } from '@/lib/activity-store'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Power,
  Banknote,
  FileText,
  UserX,
  UserCog,
  FileBarChart,
  UserPlus,
}

const typeColors: Record<Activity['type'], string> = {
  client_added: 'bg-emerald-500',
  payment_received: 'bg-blue-500',
  receipt_created: 'bg-cyan-500',
  status_changed: 'bg-amber-500',
  client_updated: 'bg-purple-500',
  client_deleted: 'bg-red-500',
  system: 'bg-gray-500',
}

const typeBorderColors: Record<Activity['type'], string> = {
  client_added: 'border-emerald-500/30',
  payment_received: 'border-blue-500/30',
  receipt_created: 'border-cyan-500/30',
  status_changed: 'border-amber-500/30',
  client_updated: 'border-purple-500/30',
  client_deleted: 'border-red-500/30',
  system: 'border-gray-500/30',
}

const typeGlowColors: Record<Activity['type'], string> = {
  client_added: 'rgba(16, 185, 129, 0.15)',
  payment_received: 'rgba(59, 130, 246, 0.15)',
  receipt_created: 'rgba(6, 182, 212, 0.15)',
  status_changed: 'rgba(245, 158, 11, 0.15)',
  client_updated: 'rgba(168, 85, 247, 0.15)',
  client_deleted: 'rgba(239, 68, 68, 0.15)',
  system: 'rgba(107, 114, 128, 0.15)',
}

type FilterType = 'all' | 'clients' | 'payments' | 'receipts' | 'system'

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'clients', label: 'العملاء' },
  { key: 'payments', label: 'المدفوعات' },
  { key: 'receipts', label: 'الإيصالات' },
  { key: 'system', label: 'النظام' },
]

function getRelativeTime(timestamp: string): string {
  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'الآن'
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`
  if (diffHours < 24) return `منذ ${diffHours} ساعة`
  if (diffDays < 7) return `منذ ${diffDays} يوم`
  return date.toLocaleDateString('ar-IQ')
}

function filterActivities(activities: Activity[], filter: FilterType): Activity[] {
  if (filter === 'all') return activities
  if (filter === 'clients') return activities.filter(a => ['client_added', 'client_updated', 'client_deleted', 'status_changed'].includes(a.type))
  if (filter === 'payments') return activities.filter(a => a.type === 'payment_received')
  if (filter === 'receipts') return activities.filter(a => a.type === 'receipt_created')
  if (filter === 'system') return activities.filter(a => a.type === 'system')
  return activities
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  useEffect(() => {
    async function fetchActivities() {
      try {
        const res = await fetch('/api/activity')
        if (res.ok) {
          const data = await res.json()
          setActivities(data)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
  }, [])

  const filtered = filterActivities(activities, activeFilter)

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">سجل النشاطات</h1>
          <p className="text-gray-400 text-sm">جميع الأحداث والإجراءات في النظام</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeFilter === f.key
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-gray-300'
              }`}
            >
              <Filter size={14} />
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              <Inbox size={28} className="text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium">لا توجد نشاطات</p>
            <p className="text-gray-600 text-sm mt-1">لم يتم تسجيل أي أحداث بعد</p>
          </div>
        )}

        {/* Timeline */}
        {!loading && filtered.length > 0 && (
          <div className="relative">
            {/* Vertical timeline line on the right side (RTL) */}
            <div
              className="absolute top-0 bottom-0 right-[19px] w-[2px]"
              style={{ background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.3), rgba(139, 92, 246, 0.1), transparent)' }}
            />

            <div className="space-y-4">
              {filtered.map((activity, index) => {
                const IconComponent = iconMap[activity.icon]
                return (
                  <div
                    key={activity.id}
                    className="relative flex items-start gap-4 group"
                    style={{
                      animation: `fadeInUp 0.4s ease-out ${index * 0.07}s both`,
                    }}
                  >
                    {/* Timeline circle */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`w-[38px] h-[38px] rounded-full flex items-center justify-center ${typeColors[activity.type]} ring-4 ring-[#0a0f1e] transition-transform duration-200 group-hover:scale-110`}
                      >
                        {IconComponent ? (
                          <IconComponent size={16} className="text-white" />
                        ) : (
                          <Power size={16} className="text-white" />
                        )}
                      </div>
                    </div>

                    {/* Activity card */}
                    <div
                      className={`flex-1 rounded-xl p-4 border ${typeBorderColors[activity.type]} transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-opacity-60`}
                      style={{
                        background: `linear-gradient(135deg, ${typeGlowColors[activity.type]}, rgba(255, 255, 255, 0.02))`,
                        backdropFilter: 'blur(12px)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-sm">{activity.title}</h3>
                          <p className="text-gray-400 text-sm mt-1 leading-relaxed">{activity.description}</p>
                        </div>
                        <span className="text-[11px] text-gray-500 whitespace-nowrap flex-shrink-0 mt-0.5">
                          {getRelativeTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Staggered fade-in-up animation */}
        <style jsx global>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </main>
    </div>
  )
}
