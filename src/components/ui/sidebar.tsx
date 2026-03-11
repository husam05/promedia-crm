'use client'

import { useState } from 'react'
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
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/clients', label: 'العملاء', icon: Users },
  { href: '/financial', label: 'المالية', icon: Wallet },
  { href: '/decisions', label: 'محرك القرارات', icon: Zap },
  { href: '/reports', label: 'التقارير', icon: FileBarChart },
  { href: '/settings', label: 'الإعدادات', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
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
            className="p-2 rounded-xl hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all duration-200"
          >
            {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
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
                <span className="relative z-10 text-sm font-medium">{item.label}</span>
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
              <Activity size={14} className="text-cyan-400" />
              <p className="text-[11px] text-gray-500">صحة الشركة</p>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: '72%',
                  background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-[10px] text-gray-600">0</p>
              <p className="text-[11px] font-semibold text-cyan-400">72 / 100</p>
              <p className="text-[10px] text-gray-600">100</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <span className="text-xs font-bold text-cyan-400">72</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
