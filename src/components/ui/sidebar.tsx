'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Wallet,
  Zap,
  FileBarChart,
  Settings,
  ChevronRight,
  ChevronLeft,
  Activity,
  Menu,
  X,
} from 'lucide-react'

interface DashboardHealth {
  score: number
}

interface DashboardAlert {
  id: string
  type: string
  isRead: boolean
}

interface SidebarDashboardData {
  health: DashboardHealth
  alerts: DashboardAlert[]
}

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutDashboard
  shortcut: string
  badgeKey?: 'decisions' | 'reports'
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, shortcut: '⌘1' },
  { href: '/clients', label: 'العملاء', icon: Users, shortcut: '⌘2' },
  { href: '/financial', label: 'المالية', icon: Wallet, shortcut: '⌘3' },
  { href: '/decisions', label: 'محرك القرارات', icon: Zap, shortcut: '⌘4', badgeKey: 'decisions' },
  { href: '/reports', label: 'التقارير', icon: FileBarChart, shortcut: '⌘5', badgeKey: 'reports' },
  { href: '/activity', label: 'سجل النشاط', icon: Activity, shortcut: '⌘6' },
  { href: '/settings', label: 'الإعدادات', icon: Settings, shortcut: '⌘7' },
]

function getHealthBarGradient(score: number): string {
  if (score >= 70) return 'linear-gradient(90deg, #10b981, #06b6d4)'
  if (score >= 50) return 'linear-gradient(90deg, #f59e0b, #f97316)'
  return 'linear-gradient(90deg, #ef4444, #ec4899)'
}

function getHealthTextColor(score: number): string {
  if (score >= 70) return 'text-emerald-400'
  if (score >= 50) return 'text-amber-400'
  return 'text-red-400'
}

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [healthScore, setHealthScore] = useState<number>(72)
  const [badges, setBadges] = useState<{ decisions: number; reports: number }>({ decisions: 0, reports: 0 })

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard')
      if (!res.ok) return
      const data: SidebarDashboardData = await res.json()
      if (data.health && typeof data.health.score === 'number') {
        setHealthScore(data.health.score)
      }
      if (data.alerts && Array.isArray(data.alerts)) {
        const unreadAlerts = data.alerts.filter((a) => !a.isRead)
        const decisionsCount = unreadAlerts.filter(
          (a) => a.type === 'capacity' || a.type === 'financial' || a.type === 'emergency'
        ).length
        const reportsCount = unreadAlerts.filter(
          (a) => a.type === 'payment' || a.type === 'contract'
        ).length
        setBadges({ decisions: decisionsCount, reports: reportsCount })
      }
    } catch {
      // silently keep defaults
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const sidebarContent = (
    <aside
      className={`${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      } min-h-screen flex flex-col transition-all duration-300 ease-in-out relative`}
      style={{
        background: 'linear-gradient(180deg, rgba(12, 18, 34, 0.95), rgba(6, 11, 24, 0.98))',
        borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold gradient-text">ProMedia</h1>
              <p className="text-[10px] text-gray-500 mt-0.5">نظام إدارة العملاء الذكي</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all duration-200 hidden lg:block"
          >
            {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
          {/* Close button for mobile overlay */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all duration-200 lg:hidden"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* User Avatar Section */}
      <div className={`border-b border-white/5 ${collapsed ? 'p-3' : 'p-4'}`}>
        <div className={`flex ${collapsed ? 'justify-center' : 'flex-col items-center gap-2'}`}>
          <div
            className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
              collapsed ? 'w-9 h-9 text-[11px]' : 'w-14 h-14 text-base'
            }`}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            }}
          >
            م.أ
          </div>
          {!collapsed && (
            <div className="text-center animate-fade-in">
              <p className="text-sm font-semibold text-white leading-tight">مدير النظام</p>
              <p className="text-[10px] text-gray-500 mt-0.5">المسؤول</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const badgeCount =
            item.badgeKey === 'decisions'
              ? badges.decisions
              : item.badgeKey === 'reports'
              ? badges.reports
              : 0
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-cyan-400'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.05))',
                    border: '1px solid rgba(6, 182, 212, 0.15)',
                  }}
                />
              )}
              <div className={`relative z-10 p-1.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/10'
                  : 'group-hover:bg-white/5'
              }`}>
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              </div>
              {!collapsed && (
                <span className="relative z-10 text-sm font-medium flex-1">{item.label}</span>
              )}
              {/* Notification badge */}
              {badgeCount > 0 && (
                <span
                  className={`z-10 flex items-center justify-center bg-red-500 text-white font-bold rounded-full ${
                    collapsed
                      ? 'absolute -top-1 -left-1 w-4 h-4 text-[8px]'
                      : 'w-5 h-5 text-[9px]'
                  }`}
                >
                  {badgeCount}
                </span>
              )}
              {/* Keyboard shortcut hint */}
              {!collapsed && (
                <span className="relative z-10 text-[9px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-auto">
                  {item.shortcut}
                </span>
              )}
              {isActive && !collapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-cyan-400 rounded-r-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Company Health Footer */}
      <div className="p-3 border-t border-white/5">
        {!collapsed ? (
          <div className="rounded-xl p-3 animate-fade-in" style={{ background: 'rgba(255, 255, 255, 0.02)' }}>
            <div className="flex items-center gap-2 mb-2.5">
              <Activity size={14} className={getHealthTextColor(healthScore)} />
              <p className="text-[11px] text-gray-500">صحة الشركة</p>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${healthScore}%`,
                  background: getHealthBarGradient(healthScore),
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[10px] text-gray-600">0</p>
              <p className={`text-[11px] font-semibold ${getHealthTextColor(healthScore)}`}>{healthScore} / 100</p>
              <p className="text-[10px] text-gray-600">100</p>
            </div>

            {/* Version Footer */}
            <div className="mt-3 pt-2.5 border-t border-white/5 text-center">
              <p className="text-[9px] text-gray-700">ProMedia CRM v1.0</p>
              <p className="text-[9px] text-gray-700 mt-0.5">بغداد، العراق</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background:
                  healthScore >= 70
                    ? 'rgba(16, 185, 129, 0.1)'
                    : healthScore >= 50
                    ? 'rgba(245, 158, 11, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)',
              }}
            >
              <span className={`text-xs font-bold ${getHealthTextColor(healthScore)}`}>{healthScore}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl text-gray-400 hover:text-white transition-all lg:hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(12, 18, 34, 0.95), rgba(6, 11, 24, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Menu size={20} />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">{sidebarContent}</div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar sliding from right (RTL) */}
          <div className="absolute top-0 right-0 h-full animate-slide-in-right">
            {sidebarContent}
          </div>
        </div>
      )}

    </>
  )
}
