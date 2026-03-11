'use client'

import Sidebar from '@/components/ui/sidebar'

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">الإعدادات</h1>
          <p className="text-sm text-gray-400">إعدادات النظام والتكوين</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Company Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-white mb-4">بيانات الشركة</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">اسم الشركة</label>
                <input
                  type="text"
                  defaultValue="ProMedia"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  defaultValue="admin@promedia.sa"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">العملة</label>
                <input
                  type="text"
                  defaultValue="ر.س"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-white mb-4">إعدادات التنبيهات</h2>
            <div className="space-y-3">
              {[
                { label: 'تنبيهات البريد الإلكتروني', enabled: true },
                { label: 'إشعارات المتصفح', enabled: true },
                { label: 'تنبيهات الهاتف (PWA)', enabled: false },
                { label: 'تقرير CEO الأسبوعي', enabled: true },
                { label: 'تنبيهات الطوارئ المالية', enabled: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800 transition-colors">
                  <span className="text-sm text-white">{item.label}</span>
                  <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${item.enabled ? 'bg-emerald-500' : 'bg-gray-700'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform mt-0.5 ${item.enabled ? 'mr-0.5' : 'mr-[26px]'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Engine Settings */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-white mb-4">إعدادات محرك القرارات</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">حد التحصيل للتنبيه (%)</label>
                <input
                  type="number"
                  defaultValue={60}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">أيام التأخير للتصعيد</label>
                <input
                  type="number"
                  defaultValue={15}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">نسبة المصروفات/الإيرادات للطوارئ (%)</label>
                <input
                  type="number"
                  defaultValue={80}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-colors">
            حفظ الإعدادات
          </button>
        </div>
      </main>
    </div>
  )
}
