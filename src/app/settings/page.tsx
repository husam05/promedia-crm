'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/ui/sidebar'
import StatusLine from '@/components/ui/status-line'
import type { StatusType } from '@/components/ui/status-line'
import { Save, Building2, Bell, Zap, Shield, Palette, Download, Upload, Keyboard } from 'lucide-react'

interface Settings {
  companyName: string
  email: string
  phone: string
  currency: string
  taxRate: number
  notifications: Record<string, boolean>
  collectionThreshold: number
  delayDays: number
  expenseRatio: number
}

const defaultSettings: Settings = {
  companyName: 'ProMedia',
  email: 'admin@promedia.iq',
  phone: '+964770000000',
  currency: 'د.ع',
  taxRate: 15,
  notifications: {
    email: true,
    browser: true,
    pwa: false,
    weeklyReport: true,
    financialEmergency: true,
    contractExpiry: true,
    newPayment: true,
  },
  collectionThreshold: 60,
  delayDays: 15,
  expenseRatio: 80,
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [statusType, setStatusType] = useState<StatusType>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('promedia-settings')
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch { /* use defaults */ }
    }
  }, [])

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const toggleNotification = (key: string) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    setStatusType('loading')
    setStatusMessage('جاري حفظ الإعدادات...')
    setTimeout(() => {
      localStorage.setItem('promedia-settings', JSON.stringify(settings))
      setStatusType('success')
      setStatusMessage('تم حفظ الإعدادات بنجاح')
      setHasChanges(false)
    }, 600)
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'promedia-settings.json'
    a.click()
    URL.revokeObjectURL(url)
    setStatusType('success')
    setStatusMessage('تم تصدير الإعدادات')
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string)
          setSettings(data)
          setHasChanges(true)
          setStatusType('success')
          setStatusMessage('تم استيراد الإعدادات - اضغط حفظ للتطبيق')
        } catch {
          setStatusType('error')
          setStatusMessage('فشل في قراءة الملف')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const inputClass = 'w-full glass-input'

  const notificationItems = [
    { key: 'email', label: 'تنبيهات البريد الإلكتروني', desc: 'إرسال إشعارات عبر البريد' },
    { key: 'browser', label: 'إشعارات المتصفح', desc: 'إشعارات سطح المكتب' },
    { key: 'pwa', label: 'تنبيهات الهاتف (PWA)', desc: 'إشعارات التطبيق المحمول' },
    { key: 'weeklyReport', label: 'تقرير CEO الأسبوعي', desc: 'تقرير تلقائي كل أحد' },
    { key: 'financialEmergency', label: 'تنبيهات الطوارئ المالية', desc: 'عند تجاوز حد المصروفات' },
    { key: 'contractExpiry', label: 'تنبيه انتهاء العقود', desc: 'قبل 30 يوم من انتهاء العقد' },
    { key: 'newPayment', label: 'إشعار الدفعات الجديدة', desc: 'عند استلام دفعة' },
  ]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-start justify-between mb-6 animate-fade-in-down">
          <div>
            <h1 className="text-2xl font-bold text-white">الإعدادات</h1>
            <p className="text-xs text-gray-500 mt-0.5">إعدادات النظام والتكوين</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleImport}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:text-gray-200 transition-all"
            >
              <Upload size={14} />
              استيراد
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:text-gray-200 transition-all"
            >
              <Download size={14} />
              تصدير
            </button>
          </div>
        </div>

        <div className="mb-4">
          <StatusLine status={statusType} message={statusMessage} onDismiss={() => setStatusType('idle')} />
        </div>

        <div className="max-w-3xl space-y-5">
          {/* Company Settings */}
          <div className="glass-card p-5 animate-fade-in-up stagger-1">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Building2 size={16} className="text-cyan-400" />
              </div>
              بيانات الشركة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">اسم الشركة</label>
                <input type="text" value={settings.companyName} onChange={e => updateSetting('companyName', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">البريد الإلكتروني</label>
                <input type="email" value={settings.email} onChange={e => updateSetting('email', e.target.value)} className={inputClass} dir="ltr" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">رقم الهاتف</label>
                <input type="tel" value={settings.phone} onChange={e => updateSetting('phone', e.target.value)} className={inputClass} dir="ltr" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">العملة</label>
                <input type="text" value={settings.currency} onChange={e => updateSetting('currency', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">نسبة الضريبة (%)</label>
                <input type="number" value={settings.taxRate} onChange={e => updateSetting('taxRate', Number(e.target.value))} className={inputClass} min="0" max="100" />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="glass-card p-5 animate-fade-in-up stagger-2">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Bell size={16} className="text-amber-400" />
              </div>
              إعدادات التنبيهات
            </h2>
            <div className="space-y-1">
              {notificationItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors group">
                  <div>
                    <span className="text-sm text-gray-300">{item.label}</span>
                    <p className="text-[10px] text-gray-600 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotification(item.key)}
                    className={`w-11 h-6 rounded-full transition-all duration-300 cursor-pointer relative ${settings.notifications[item.key] ? 'bg-cyan-500/30' : 'bg-white/5'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 absolute top-0.5 ${settings.notifications[item.key] ? 'right-0.5' : 'right-[22px]'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Engine Settings */}
          <div className="glass-card p-5 animate-fade-in-up stagger-3">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Zap size={16} className="text-emerald-400" />
              </div>
              إعدادات محرك القرارات
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">حد التحصيل للتنبيه (%)</label>
                <input type="number" value={settings.collectionThreshold} onChange={e => updateSetting('collectionThreshold', Number(e.target.value))} className={inputClass} />
                <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-l from-cyan-400 to-emerald-400 rounded-full transition-all" style={{ width: `${settings.collectionThreshold}%` }} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">أيام التأخير للتصعيد</label>
                <input type="number" value={settings.delayDays} onChange={e => updateSetting('delayDays', Number(e.target.value))} className={inputClass} />
                <p className="text-[10px] text-gray-600 mt-1.5">تصعيد بعد {settings.delayDays} يوم تأخير</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">نسبة المصروفات/الإيرادات (%)</label>
                <input type="number" value={settings.expenseRatio} onChange={e => updateSetting('expenseRatio', Number(e.target.value))} className={inputClass} />
                <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${settings.expenseRatio > 80 ? 'bg-gradient-to-l from-red-400 to-amber-400' : 'bg-gradient-to-l from-emerald-400 to-cyan-400'}`} style={{ width: `${settings.expenseRatio}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="glass-card p-5 animate-fade-in-up stagger-4">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Shield size={16} className="text-purple-400" />
              </div>
              الأمان والخصوصية
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <div>
                  <p className="text-sm text-gray-300">المصادقة الثنائية</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">طبقة أمان إضافية</p>
                </div>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">قريباً</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <div>
                  <p className="text-sm text-gray-300">سجل الدخول</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">تتبع جلسات الدخول</p>
                </div>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">قريباً</span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="glass-card p-5 animate-fade-in-up stagger-5">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Keyboard size={16} className="text-blue-400" />
              </div>
              اختصارات لوحة المفاتيح
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { keys: 'Ctrl + K', desc: 'البحث السريع' },
                { keys: 'Alt + 1', desc: 'لوحة التحكم' },
                { keys: 'Alt + 2', desc: 'العملاء' },
                { keys: 'Alt + 3', desc: 'المالية' },
                { keys: 'Alt + 4', desc: 'محرك القرارات' },
                { keys: 'Alt + 5', desc: 'التقارير' },
                { keys: '?', desc: 'عرض الاختصارات' },
                { keys: 'Esc', desc: 'إغلاق النوافذ' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02]">
                  <span className="text-xs text-gray-400">{s.desc}</span>
                  <kbd className="kbd">{s.keys}</kbd>
                </div>
              ))}
            </div>
          </div>

          {/* App Info */}
          <div className="glass-card-flat p-4 animate-fade-in-up stagger-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <Palette size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">ProMedia CRM</p>
                  <p className="text-[10px] text-gray-600">الإصدار 1.0.0 | بغداد، العراق</p>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">أحدث إصدار</span>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-200 btn-ripple ${
              hasChanges
                ? 'hover:translate-y-[-1px] hover:shadow-lg'
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{
              background: hasChanges
                ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.15))'
                : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${hasChanges ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
              color: hasChanges ? '#06b6d4' : '#64748b',
            }}
          >
            <Save size={16} />
            {hasChanges ? 'حفظ الإعدادات' : 'لا توجد تغييرات'}
          </button>
        </div>
      </main>
    </div>
  )
}
