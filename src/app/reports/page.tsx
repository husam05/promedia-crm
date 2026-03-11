'use client'

import { useState, useCallback } from 'react'
import Sidebar from '@/components/ui/sidebar'
import ProgressRing from '@/components/ui/progress-ring'
import StatusLine from '@/components/ui/status-line'
import type { StatusType } from '@/components/ui/status-line'
import { Printer } from 'lucide-react'

const weeklyReports = [
  {
    id: '1',
    period: '2 - 8 مارس 2026',
    generatedAt: '2026-03-08T08:00:00',
    revenue: 69500,
    expenses: 52000,
    profit: 17500,
    collectionRate: 65,
    newClients: 0,
    lostClients: 0,
    riskClients: 3,
    healthScore: 68,
    highlights: [
      'تحصيل 65% من المستحقات',
      'عقد شركة المستقبل الرقمي ينتهي خلال 35 يوم',
      'مصنع الحلول - موقوف بسبب عدم السداد',
    ],
    recommendations: [
      'تكثيف جهود التحصيل خلال الأسبوع القادم',
      'التواصل مع شركة المستقبل الرقمي لتجديد العقد',
      'مراجعة سياسة الائتمان للعملاء الجدد',
    ],
  },
  {
    id: '2',
    period: '23 فبراير - 1 مارس 2026',
    generatedAt: '2026-03-01T08:00:00',
    revenue: 65000,
    expenses: 52000,
    profit: 13000,
    collectionRate: 72,
    newClients: 1,
    lostClients: 0,
    riskClients: 3,
    healthScore: 70,
    highlights: [
      'إضافة عميل جديد - شركة الأمان للحراسات',
      'تحسن طفيف في معدل التحصيل',
      'استقرار المصروفات التشغيلية',
    ],
    recommendations: [
      'استهداف عميلين جديدين من الفئة A',
      'تقليل المصروفات الإدارية 10%',
      'تفعيل نظام التذكير التلقائي',
    ],
  },
]

const getHealthColor = (score: number) => {
  if (score >= 70) return 'bg-emerald-500'
  if (score >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

const getHealthTextColor = (score: number) => {
  if (score >= 70) return 'text-emerald-400'
  if (score >= 50) return 'text-amber-400'
  return 'text-red-400'
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(weeklyReports[0])
  const [statusType, setStatusType] = useState<StatusType>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleStatus = useCallback((type: 'loading' | 'success' | 'error', message: string) => {
    setStatusType(type)
    setStatusMessage(message)
  }, [])

  const handlePrintReport = () => {
    handleStatus('loading', 'جاري تجهيز التقرير للطباعة...')
    const r = selectedReport

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      handleStatus('error', 'فشل في فتح نافذة الطباعة - تأكد من السماح بالنوافذ المنبثقة')
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>تقرير أسبوعي - ${r.period}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; padding: 30px; color: #1a1a1a; background: white; }
          .report { max-width: 750px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 24px; }
          .header h1 { font-size: 28px; color: #059669; margin-bottom: 4px; }
          .header .subtitle { font-size: 12px; color: #666; }
          .header .period { font-size: 16px; font-weight: 600; color: #333; margin-top: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 8px 20px; display: inline-block; }
          .health-badge { display: inline-flex; align-items: center; gap: 8px; margin-top: 12px; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
          .health-good { background: #f0fdf4; color: #059669; border: 1px solid #bbf7d0; }
          .health-mid { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
          .health-bad { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
          .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
          .kpi-card { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; text-align: center; }
          .kpi-card .label { font-size: 11px; color: #888; margin-bottom: 4px; }
          .kpi-card .value { font-size: 20px; font-weight: 700; }
          .kpi-card .value.green { color: #059669; }
          .kpi-card .value.red { color: #dc2626; }
          .kpi-card .value.blue { color: #2563eb; }
          .kpi-card .value.amber { color: #d97706; }
          .details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0; }
          .detail-card { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; text-align: center; }
          .detail-card .label { font-size: 11px; color: #888; }
          .detail-card .value { font-size: 22px; font-weight: 700; }
          .section { margin: 20px 0; }
          .section-title { font-size: 14px; font-weight: 600; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
          .section-title.amber { color: #d97706; }
          .section-title.green { color: #059669; }
          .list-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; font-size: 13px; color: #333; }
          .list-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
          .list-dot.amber { background: #d97706; }
          .list-num { width: 20px; height: 20px; border-radius: 50%; background: #f0fdf4; color: #059669; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; flex-shrink: 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 16px; border-top: 2px dashed #e0e0e0; font-size: 11px; color: #888; }
          .date-generated { font-size: 11px; color: #999; margin-top: 4px; }
          @media print { body { padding: 15px; } }
        </style>
      </head>
      <body>
        <div class="report">
          <div class="header">
            <h1>ProMedia</h1>
            <p class="subtitle">نظام إدارة العملاء الذكي - التقرير الأسبوعي</p>
            <div class="period">تقرير الأسبوع: ${r.period}</div>
            <br/>
            <span class="health-badge ${r.healthScore >= 70 ? 'health-good' : r.healthScore >= 50 ? 'health-mid' : 'health-bad'}">
              صحة الشركة: ${r.healthScore}%
            </span>
            <p class="date-generated">تم الإنشاء: ${new Date(r.generatedAt).toLocaleDateString('ar-IQ')}</p>
          </div>

          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="label">الإيرادات</div>
              <div class="value green">${r.revenue.toLocaleString()} د.ع</div>
            </div>
            <div class="kpi-card">
              <div class="label">المصروفات</div>
              <div class="value red">${r.expenses.toLocaleString()} د.ع</div>
            </div>
            <div class="kpi-card">
              <div class="label">الربح</div>
              <div class="value blue">${r.profit.toLocaleString()} د.ع</div>
            </div>
            <div class="kpi-card">
              <div class="label">التحصيل</div>
              <div class="value ${r.collectionRate >= 70 ? 'green' : 'amber'}">${r.collectionRate}%</div>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-card">
              <div class="label">عملاء جدد</div>
              <div class="value green">${r.newClients}</div>
            </div>
            <div class="detail-card">
              <div class="label">عملاء مفقودون</div>
              <div class="value red">${r.lostClients}</div>
            </div>
            <div class="detail-card">
              <div class="label">عملاء مخاطر</div>
              <div class="value amber">${r.riskClients}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title amber">أبرز الأحداث</div>
            ${r.highlights.map(h => `<div class="list-item"><div class="list-dot amber"></div><span>${h}</span></div>`).join('')}
          </div>

          <div class="section">
            <div class="section-title green">التوصيات</div>
            ${r.recommendations.map((rec, i) => `<div class="list-item"><div class="list-num">${i + 1}</div><span>${rec}</span></div>`).join('')}
          </div>

          <div class="footer">
            <p>ProMedia - نظام إدارة العملاء الذكي</p>
            <p>تقرير تلقائي - ${new Date().toLocaleDateString('ar-IQ')}</p>
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
      handleStatus('success', 'تم تجهيز التقرير للطباعة بنجاح')
    }, 500)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 animate-fade-in-down">
          <div>
            <h1 className="text-2xl font-bold text-white">التقارير الأسبوعية</h1>
            <p className="text-xs text-gray-500 mt-0.5">تقرير CEO التلقائي - يُرسل كل أحد الساعة 8 صباحاً</p>
          </div>
          <button
            onClick={handlePrintReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-y-[-1px]"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#10b981',
            }}
          >
            <Printer size={15} />
            طباعة التقرير
          </button>
        </div>

        {/* Status Line */}
        <div className="mb-4">
          <StatusLine
            status={statusType}
            message={statusMessage}
            onDismiss={() => setStatusType('idle')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Report List with Status Indicators */}
          <div className="space-y-3">
            {weeklyReports.map((report, idx) => {
              const prevReport = weeklyReports[idx + 1]
              const revenueTrend = prevReport ? (report.revenue >= prevReport.revenue ? 'up' : 'down') : 'neutral'

              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full text-right p-4 rounded-2xl border transition-all duration-200 ${
                    selectedReport.id === report.id
                      ? 'bg-cyan-500/[0.06] border-cyan-500/15'
                      : 'bg-white/[0.02] border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white">{report.period}</p>
                    {revenueTrend !== 'neutral' && (
                      <span className={`text-xs ${revenueTrend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {revenueTrend === 'up' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className={`w-2 h-2 rounded-full ${getHealthColor(report.healthScore)}`} />
                    <p className={`text-xs ${getHealthTextColor(report.healthScore)}`}>
                      صحة: {report.healthScore}%
                    </p>
                    <span className="text-xs text-gray-600 mx-1">|</span>
                    <p className="text-xs text-gray-400">{report.revenue.toLocaleString()} د.ع</p>
                  </div>
                  {/* Processing Status Badge */}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${report.collectionRate >= 70 ? 'bg-emerald-500' : report.collectionRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <span className="text-[10px] text-gray-500">
                      تحصيل: {report.collectionRate}%
                    </span>
                    <div className={`w-1.5 h-1.5 rounded-full ${report.riskClients <= 1 ? 'bg-emerald-500' : report.riskClients <= 3 ? 'bg-amber-500' : 'bg-red-500'} mr-2`} />
                    <span className="text-[10px] text-gray-500">
                      مخاطر: {report.riskClients}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Report Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">تقرير الأسبوع: {selectedReport.period}</h2>
                  <p className="text-xs text-gray-400">تم الإنشاء: {new Date(selectedReport.generatedAt).toLocaleDateString('ar-IQ')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrintReport}
                    className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    title="طباعة التقرير"
                  >
                    <Printer size={20} />
                  </button>
                  <ProgressRing value={selectedReport.healthScore} size={80} strokeWidth={6} label="الصحة" />
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4">
                <p className="text-xs text-gray-400">الإيرادات</p>
                <p className="text-xl font-bold text-emerald-400">{selectedReport.revenue.toLocaleString()} د.ع</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-gray-400">المصروفات</p>
                <p className="text-xl font-bold text-red-400">{selectedReport.expenses.toLocaleString()} د.ع</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-gray-400">الربح</p>
                <p className="text-xl font-bold text-blue-400">{selectedReport.profit.toLocaleString()} د.ع</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-gray-400">التحصيل</p>
                <p className={`text-xl font-bold ${selectedReport.collectionRate >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedReport.collectionRate}%
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4">
                <p className="text-xs text-gray-400">عملاء جدد</p>
                <p className="text-2xl font-bold text-emerald-400">{selectedReport.newClients}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-gray-400">عملاء مفقودون</p>
                <p className="text-2xl font-bold text-red-400">{selectedReport.lostClients}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-xs text-gray-400">عملاء مخاطر</p>
                <p className="text-2xl font-bold text-amber-400">{selectedReport.riskClients}</p>
              </div>
            </div>

            {/* Highlights & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-5">
                <h3 className="text-sm font-medium text-amber-400 mb-3">أبرز الأحداث</h3>
                <div className="space-y-2">
                  {selectedReport.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-amber-400 mt-0.5">●</span>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-sm font-medium text-emerald-400 mb-3">التوصيات</h3>
                <div className="space-y-2">
                  {selectedReport.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs flex-shrink-0">{i + 1}</span>
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
