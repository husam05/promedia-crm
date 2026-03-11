'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  LayoutDashboard,
  Users,
  Wallet,
  Zap,
  FileBarChart,
  Settings,
  UserPlus,
  Printer,
  RefreshCw,
  Command,
  type LucideIcon,
} from 'lucide-react'

interface CommandItem {
  id: string
  label: string
  icon: LucideIcon
  category: 'navigation' | 'actions'
  href?: string
  shortcut?: string
  action?: () => void
}

const navigationItems: CommandItem[] = [
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, category: 'navigation', href: '/dashboard', shortcut: '⌘ 1' },
  { id: 'clients', label: 'العملاء', icon: Users, category: 'navigation', href: '/clients', shortcut: '⌘ 2' },
  { id: 'financial', label: 'المالية', icon: Wallet, category: 'navigation', href: '/financial', shortcut: '⌘ 3' },
  { id: 'decisions', label: 'محرك القرارات', icon: Zap, category: 'navigation', href: '/decisions', shortcut: '⌘ 4' },
  { id: 'reports', label: 'التقارير', icon: FileBarChart, category: 'navigation', href: '/reports', shortcut: '⌘ 5' },
  { id: 'settings', label: 'الإعدادات', icon: Settings, category: 'navigation', href: '/settings', shortcut: '⌘ 6' },
]

const actionItems: CommandItem[] = [
  { id: 'add-client', label: 'إضافة عميل جديد', icon: UserPlus, category: 'actions', href: '/clients?action=new' },
  { id: 'print-report', label: 'طباعة التقرير', icon: Printer, category: 'actions' },
  { id: 'refresh-data', label: 'تحديث البيانات', icon: RefreshCw, category: 'actions' },
]

const allItems = [...navigationItems, ...actionItems]

const categoryLabels: Record<string, string> = {
  navigation: 'التنقل',
  actions: 'إجراءات سريعة',
}

function fuzzyMatch(text: string, query: string): boolean {
  const normalizedText = text.toLowerCase()
  const normalizedQuery = query.toLowerCase()

  if (normalizedText.includes(normalizedQuery)) return true

  let queryIndex = 0
  for (let i = 0; i < normalizedText.length && queryIndex < normalizedQuery.length; i++) {
    if (normalizedText[i] === normalizedQuery[queryIndex]) {
      queryIndex++
    }
  }
  return queryIndex === normalizedQuery.length
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems
    return allItems.filter((item) => fuzzyMatch(item.label, query))
  }, [query])

  const groupedItems = useMemo(() => {
    const groups: { category: string; items: CommandItem[] }[] = []
    const navItems = filteredItems.filter((i) => i.category === 'navigation')
    const actItems = filteredItems.filter((i) => i.category === 'actions')
    if (navItems.length > 0) groups.push({ category: 'navigation', items: navItems })
    if (actItems.length > 0) groups.push({ category: 'actions', items: actItems })
    return groups
  }, [filteredItems])

  const flatFiltered = useMemo(() => {
    return groupedItems.flatMap((g) => g.items)
  }, [groupedItems])

  const open = useCallback(() => {
    setIsOpen(true)
    setQuery('')
    setSelectedIndex(0)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(0)
  }, [])

  const executeItem = useCallback(
    (item: CommandItem) => {
      close()
      if (item.href) {
        router.push(item.href)
      } else if (item.action) {
        item.action()
      } else if (item.id === 'print-report') {
        window.print()
      } else if (item.id === 'refresh-data') {
        window.location.reload()
      }
    },
    [close, router]
  )

  // Global keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        e.stopPropagation()
        setIsOpen((prev) => {
          if (!prev) {
            setQuery('')
            setSelectedIndex(0)
          }
          return !prev
        })
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [isOpen])

  // Keyboard navigation inside palette
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % flatFiltered.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + flatFiltered.length) % flatFiltered.length)
          break
        case 'Enter':
          e.preventDefault()
          if (flatFiltered[selectedIndex]) {
            executeItem(flatFiltered[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          close()
          break
      }
    },
    [flatFiltered, selectedIndex, executeItem, close]
  )

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const selected = listRef.current.querySelector('[data-selected="true"]') as HTMLElement | null
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  if (!isOpen) return null

  let flatIndex = -1

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-md animate-fade-in"
      dir="rtl"
      onClick={close}
    >
      <div
        className="w-full max-w-lg mx-4 rounded-2xl overflow-hidden animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(12, 18, 34, 0.98))',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow:
            '0 24px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input */}
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          <Search size={18} className="text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="ابحث عن صفحة أو إجراء..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-600 outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium text-gray-600 shrink-0"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[360px] overflow-y-auto p-2" role="listbox">
          {flatFiltered.length === 0 ? (
            <div className="py-12 text-center">
              <Search size={28} className="mx-auto text-gray-700 mb-3" />
              <p className="text-sm text-gray-600">لا توجد نتائج لـ &quot;{query}&quot;</p>
            </div>
          ) : (
            groupedItems.map((group) => (
              <div key={group.category} className="mb-2 last:mb-0">
                <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider px-3 py-1.5">
                  {categoryLabels[group.category]}
                </p>
                {group.items.map((item) => {
                  flatIndex++
                  const isSelected = flatIndex === selectedIndex
                  const Icon = item.icon
                  const currentIndex = flatIndex

                  return (
                    <button
                      key={item.id}
                      data-selected={isSelected}
                      role="option"
                      aria-selected={isSelected}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start transition-all duration-150 group ${
                        isSelected
                          ? 'text-cyan-400'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                      style={
                        isSelected
                          ? {
                              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.05))',
                              border: '1px solid rgba(6, 182, 212, 0.15)',
                            }
                          : {
                              background: 'transparent',
                              border: '1px solid transparent',
                            }
                      }
                      onClick={() => executeItem(item)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                    >
                      <div
                        className={`p-1.5 rounded-lg transition-all duration-150 ${
                          isSelected ? 'bg-cyan-500/10' : 'bg-white/[0.03] group-hover:bg-white/5'
                        }`}
                      >
                        <Icon size={16} strokeWidth={isSelected ? 2 : 1.5} />
                      </div>
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      {item.shortcut && (
                        <span
                          className="text-[10px] text-gray-600 font-mono px-1.5 py-0.5 rounded-md"
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          {item.shortcut}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          <div className="flex items-center gap-3 text-[10px] text-gray-600">
            <span className="flex items-center gap-1">
              <kbd
                className="px-1.5 py-0.5 rounded"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                ↑↓
              </kbd>
              للتنقل
            </span>
            <span className="flex items-center gap-1">
              <kbd
                className="px-1.5 py-0.5 rounded"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                ↵
              </kbd>
              للفتح
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
            <Command size={10} />
            <span className="gradient-text font-semibold">ProMedia</span>
          </div>
        </div>
      </div>
    </div>
  )
}
