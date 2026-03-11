'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: 'لوحة التحكم', icon: '📊' },
  { href: '/clients', label: 'العملاء', icon: '👥' },
  { href: '/financial', label: 'المالية', icon: '💰' },
  { href: '/decisions', label: 'محرك القرارات', icon: '⚡' },
  { href: '/reports', label: 'التقارير', icon: '📋' },
  { href: '/settings', label: 'الإعدادات', icon: '⚙️' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-gray-900 border-l border-gray-800 min-h-screen transition-all duration-300 flex flex-col`}>
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-emerald-400">ProMedia</h1>
              <p className="text-xs text-gray-400">نظام إدارة العملاء الذكي</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400"
          >
            {collapsed ? '◀' : '▶'}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        {!collapsed && (
          <div className="bg-gray-800 rounded-xl p-3">
            <p className="text-xs text-gray-400">صحة الشركة</p>
            <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '72%' }} />
            </div>
            <p className="text-xs text-emerald-400 mt-1">72 / 100</p>
          </div>
        )}
      </div>
    </aside>
  )
}
