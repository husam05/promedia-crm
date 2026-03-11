'use client'

import Sidebar from '@/components/ui/sidebar'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6 animate-fade-in-down">
          <h1 className="text-2xl font-bold text-white">الإعدادات</h1>
          <p className="text-xs text-gray-500 mt-0.5">إعدادات النظام والتكوين</p>
        </div>

        <div className="max-w-2xl space-y-5">
          {/* Company Settings */}
          <div className="glass-card p-5 animate-fade-in-up stagger-1">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-purple-400" />
              بيانات الشركة
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">اسم الشركة</label>
                <input
                  type="text"
                  defaultValue="ProMedia"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  defaultValue="admin@promedia.iq"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">العملة</label>
                <input
                  type="text"
                  defaultValue="د.ع"
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/30 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="glass-card p-5 animate-fade-in-up stagger-2">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-400 to-red-400" />
              إعدادات التنبيهات
            </h2>
            <div className="space-y-1">
              {[
                { label: 'تنبيهات البريد الإلكتروني', enabled: true },
                { label: 'إشعارات المتصفح', enabled: true },
                { label: 'تنبيهات الهاتف (PWA)', enabled: false },
                { label: 'تقرير CEO الأسبوعي', enabled: true },
                { label: 'تنبيهات الطوارئ المالية', enabled: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                  <span className="text-sm text-gray-300">{item.label}</span>
                  <div className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${item.enabled ? 'bg-cyan-500/30' : 'bg-white/5'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow-lg transition-all absolute top-0.5 ${item.enabled ? 'right-0.5' : 'right-[22px]'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Engine Settings */}
          <div className="glass-card p-5 animate-fade-in-up stagger-3">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-400" />
              إعدادات محرك القرارات
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">حد التحصيل للتنبيه (%)</label>
                <input
                  type="number"
                  defaultValue={60}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">أيام التأخير للتصعيد</label>
                <input
                  type="number"
                  defaultValue={15}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/30 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1.5">نسبة المصروفات/الإيرادات للطوارئ (%)</label>
                <input
                  type="number"
                  defaultValue={80}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/30 transition-colors"
                />
              </div>
            </div>
          </div>

          <button
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:translate-y-[-1px] hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.15))',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              color: '#06b6d4',
            }}
          >
            <Save size={16} />
            حفظ الإعدادات
          </button>
        </div>
      </main>
    </div>
  )
}
