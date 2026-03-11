'use client'

import { useEffect, useState, useCallback } from 'react'
import Sidebar from '@/components/ui/sidebar'
import StatCard from '@/components/ui/stat-card'
import StatusLine from '@/components/ui/status-line'
import type { StatusType } from '@/components/ui/status-line'
import { Printer, RefreshCw } from 'lucide-react'

interface FinancialData {
  totalRevenue: number
  expectedRevenue: number
  collectedRevenue: number
  collectionRate: number
  totalExpenses: number
  profitMargin: number
  outstandingPayments: number
  breakEvenClients: number
  revenueForcast: number[]
  serviceProfits: { name: string; profit: number; margin: number }[]
  forecast: number[]
  pricingSignal: boolean
  historicalRevenue: { month: string; revenue: number }[]
  monthlyExpenses: number
}

export default function FinancialPage() {
  const [data, setData] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusType, setStatusType] = useState<StatusType>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleStatus = useCallback((type: 'loading' | 'success' | 'error', message: string) => {
    setStatusType(type)
    setStatusMessage(message)
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/financial')
      const json = await res.json()
      setData(json)
      return true
    } catch {
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = async () => {
    handleStatus('loading', 'جاري تحديث البيانات المالية...')
    const success = await fetchData()
    if (success) {
      handleStatus('success', 'تم تحديث البيانات المالية بنجاح')
    } else {
      handleStatus('error', 'فشل في تحديث البيانات المالية')
    }
  }

  const handlePrintFinancialReport = () => {
    if (!data) return
    handleStatus('loading', 'جاري تجهيز التقرير المالي للطباعة...')

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      handleStatus('error', 'فشل في فتح نافذة الطباعة - تأكد من السماح بالنوافذ المنبثقة')
      return
    }

    const fc = (n: number) => n.toLocaleString() + ' د.ع'

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>التقرير المالي - ProMedia</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; padding: 30px; color: #1a1a1a; background: white; }
          .report { max-width: 750px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 24px; }
          .header h1 { font-size: 28px; color: #059669; }
          .header p { font-size: 12px; color: #666; }
          .date { font-size: 13px; color: #333; margin-top: 8px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
          .kpi { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; text-align: center; }
          .kpi .label { font-size: 11px; color: #888; }
          .kpi .value { font-size: 18px; font-weight: 700; margin-top: 4px; }
          .kpi .value.green { color: #059669; }
          .kpi .value.red { color: #dc2626; }
          .kpi .value.blue { color: #2563eb; }
          .kpi .value.amber { color: #d97706; }
          .section { margin: 24px 0; }
          .section h2 { font-size: 16px; font-weight: 600; color: #333; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px; }
          .collection-box { display: flex; align-items: center; gap: 24px; background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 16px 0; }
          .collection-meter { width: 100px; height: 100px; position: relative; }
          .collection-meter svg { transform: rotate(-90deg); }
          .collection-meter .value { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; }
          .collection-details { flex: 1; }
          .collection-details .item { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #eee; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0; }
          th { background: #f8f9fa; padding: 8px 10px; text-align: right; font-size: 11px; color: #666; border-bottom: 2px solid #e5e7eb; }
          td { padding: 8px 10px; font-size: 12px; border-bottom: 1px solid #eee; }
          .margin-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
          .margin-high { background: #f0fdf4; color: #059669; }
          .margin-mid { background: #eff6ff; color: #2563eb; }
          .margin-low { background: #fffbeb; color: #d97706; }
          .forecast-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin: 12px 0; }
          .forecast-item { background: #f8f9fa; border-radius: 8px; padding: 10px; text-align: center; }
          .forecast-item .month { font-size: 10px; color: #888; }
          .forecast-item .val { font-size: 14px; font-weight: 600; color: #2563eb; margin-top: 4px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 16px; border-top: 2px dashed #e0e0e0; font-size: 11px; color: #888; }
          .alert-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px 14px; margin: 12px 0; font-size: 12px; color: #dc2626; }
          @media print { body { padding: 15px; } }
        </style>
      </head>
      <body>
        <div class="report">
          <div class="header">
            <h1>ProMedia</h1>
            <p>نظام إدارة العملاء الذكي - التقرير المالي</p>
            <p class="date">${new Date().toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          ${data.pricingSignal ? '<div class="alert-box">إشارة تسعير: معدل التحصيل أقل من 70% لمدة 3 أشهر متتالية - يُنصح بمراجعة الأسعار</div>' : ''}

          <div class="kpi-grid">
            <div class="kpi"><div class="label">إجمالي الإيرادات</div><div class="value green">${fc(data.totalRevenue)}</div></div>
            <div class="kpi"><div class="label">الإيرادات المتوقعة</div><div class="value blue">${fc(data.expectedRevenue)}</div></div>
            <div class="kpi"><div class="label">المصروفات الشهرية</div><div class="value red">${fc(data.monthlyExpenses)}</div></div>
            <div class="kpi"><div class="label">هامش الربح</div><div class="value ${data.profitMargin >= 20 ? 'green' : 'amber'}">${data.profitMargin}%</div></div>
          </div>

          <div class="section">
            <h2>مقياس التحصيل</h2>
            <div class="collection-box">
              <div style="text-align:center">
                <div style="font-size:36px;font-weight:700;color:${data.collectionRate >= 70 ? '#059669' : data.collectionRate >= 50 ? '#d97706' : '#dc2626'}">${data.collectionRate}%</div>
                <div style="font-size:11px;color:#888">معدل التحصيل</div>
              </div>
              <div class="collection-details">
                <div class="item"><span>المحصّل</span><span style="color:#059669;font-weight:600">${fc(data.collectedRevenue)}</span></div>
                <div class="item"><span>المعلّق</span><span style="color:#d97706;font-weight:600">${fc(data.outstandingPayments)}</span></div>
                <div class="item"><span>نقطة التعادل</span><span style="color:#2563eb;font-weight:600">${data.breakEvenClients} عميل</span></div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>توقعات الإيرادات (6 أشهر)</h2>
            <div class="forecast-grid">
              ${data.forecast.map((val, i) => '<div class="forecast-item"><div class="month">شهر ' + (i + 1) + '</div><div class="val">' + (val / 1000).toFixed(0) + 'K</div></div>').join('')}
            </div>
          </div>

          <div class="section">
            <h2>ربحية الخدمات</h2>
            <table>
              <thead><tr><th>#</th><th>الخدمة</th><th>الربح</th><th>الهامش</th></tr></thead>
              <tbody>
                ${data.serviceProfits.map((s, i) => '<tr><td>' + (i + 1) + '</td><td>' + s.name + '</td><td style="color:#059669;font-weight:600">' + fc(s.profit) + '</td><td><span class="margin-badge ' + (s.margin >= 40 ? 'margin-high' : s.margin >= 20 ? 'margin-mid' : 'margin-low') + '">' + s.margin + '%</span></td></tr>').join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>الإيرادات التاريخية</h2>
            <table>
              <thead><tr><th>الشهر</th><th>الإيراد</th></tr></thead>
              <tbody>
                ${data.historicalRevenue.slice(-6).map(h => '<tr><td>' + h.month + '</td><td style="color:#059669;font-weight:600">' + fc(h.revenue) + '</td></tr>').join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>ProMedia - نظام إدارة العملاء الذكي</p>
            <p>تقرير مالي تلقائي - ${new Date().toLocaleDateString('ar-IQ')}</p>
          </div>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
      handleStatus('success', 'تم تجهيز التقرير المالي للطباعة بنجاح')
    }, 500)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/5 rounded-xl w-48" />
            <div className="grid grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!data) return null
  const formatCurrency = (n: number) => `${n.toLocaleString()} د.ع`

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 animate-fade-in-down">
          <div>
            <h1 className="text-2xl font-bold text-white">الذكاء المالي</h1>
            <p className="text-xs text-gray-500 mt-0.5">تحليل مالي متقدم وتوقعات ذكية</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintFinancialReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-y-[-1px]"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: '#10b981',
              }}
            >
              <Printer size={15} />
              طباعة التقرير المالي
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-gray-200 transition-all bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]"
            >
              <RefreshCw size={14} />
              تحديث
            </button>
          </div>
        </div>

        {/* Status Line */}
        <div className="mb-4">
          <StatusLine
            status={statusType}
            message={statusMessage}
            onDismiss={() => setStatusType('idle')}
          />
        </div>

        {/* Pricing Signal Alert */}
        {data.pricingSignal && (
          <div className="glass-card p-4 mb-6">
            <p className="text-red-400 font-medium">⚠️ إشارة تسعير: معدل التحصيل أقل من 70% لمدة 3 أشهر متتالية - يُنصح بمراجعة الأسعار</p>
          </div>
        )}

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="إجمالي الإيرادات" value={formatCurrency(data.totalRevenue)} icon="💰" color="emerald" />
          <StatCard title="الإيرادات المتوقعة" value={formatCurrency(data.expectedRevenue)} icon="📈" color="blue" />
          <StatCard title="المصروفات الشهرية" value={formatCurrency(data.monthlyExpenses)} icon="💸" color="red" />
          <StatCard title="هامش الربح" value={`${data.profitMargin}%`} icon="📊" color={data.profitMargin >= 20 ? 'emerald' : 'amber'} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Collection Meter */}
          <div className="glass-card p-5">
            <h2 className="text-lg font-bold text-white mb-4">مقياس التحصيل</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={data.collectionRate >= 70 ? '#10b981' : data.collectionRate >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${data.collectionRate * 2.51} 251`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{data.collectionRate}%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400">المحصّل</p>
                  <p className="text-lg font-bold text-emerald-400">{formatCurrency(data.collectedRevenue)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">المعلّق</p>
                  <p className="text-lg font-bold text-amber-400">{formatCurrency(data.outstandingPayments)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">نقطة التعادل</p>
                  <p className="text-lg font-bold text-blue-400">{data.breakEvenClients} عميل</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Forecast */}
          <div className="glass-card p-5">
            <h2 className="text-lg font-bold text-white mb-4">توقعات الإيرادات (6 أشهر)</h2>
            <div className="flex items-end gap-2 h-40">
              {data.forecast.map((val, i) => {
                const max = Math.max(...data.forecast)
                const h = max > 0 ? (val / max) * 100 : 0
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-400">{(val / 1000).toFixed(0)}K</span>
                    <div className="w-full rounded-t-lg overflow-hidden" style={{ height: '100px' }}>
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg"
                        style={{ height: `${h}%`, marginTop: `${100 - h}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">شهر {i + 1}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Service Profitability */}
          <div className="glass-card p-5">
            <h2 className="text-lg font-bold text-white mb-4">ربحية الخدمات</h2>
            <div className="space-y-3">
              {data.serviceProfits.map((service, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-white">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-emerald-400">{formatCurrency(service.profit)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      service.margin >= 40 ? 'bg-emerald-500/20 text-emerald-400' :
                      service.margin >= 20 ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {service.margin}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Revenue */}
          <div className="glass-card p-5">
            <h2 className="text-lg font-bold text-white mb-4">الإيرادات التاريخية</h2>
            <div className="space-y-2">
              {data.historicalRevenue.slice(-6).map((item, i) => {
                const max = Math.max(...data.historicalRevenue.map(h => h.revenue))
                const w = max > 0 ? (item.revenue / max) * 100 : 0
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-24 text-left">{item.month}</span>
                    <div className="flex-1 h-6 bg-gray-800 rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-l from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-end px-2"
                        style={{ width: `${w}%` }}
                      >
                        <span className="text-[10px] text-white font-medium">{formatCurrency(item.revenue)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
