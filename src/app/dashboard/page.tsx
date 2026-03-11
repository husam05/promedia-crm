'use client'

import { useEffect, useState, useCallback } from 'react'
import { DashboardData, Payment } from '@/types'
import Sidebar from '@/components/ui/sidebar'
import FinancialOverview from '@/components/dashboard/financial-overview'
import AlertsPanel from '@/components/dashboard/alerts-panel'
import ClientHealthMap from '@/components/dashboard/client-health-map'
import RevenueChart from '@/components/dashboard/revenue-chart'
import ContractsTracker from '@/components/dashboard/contracts-tracker'
import StatCard from '@/components/ui/stat-card'
import StatusLine from '@/components/ui/status-line'
import type { StatusType } from '@/components/ui/status-line'
import { Printer, RefreshCw, Bell } from 'lucide-react'

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  paid: { label: 'مدفوع', color: 'bg-emerald-500/20 text-emerald-400' },
  pending: { label: 'معلق', color: 'bg-amber-500/20 text-amber-400' },
  overdue: { label: 'متأخر', color: 'bg-red-500/20 text-red-400' },
  partial: { label: 'جزئي', color: 'bg-blue-500/20 text-blue-400' },
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusType, setStatusType] = useState<StatusType>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleStatus = useCallback((type: 'loading' | 'success' | 'error', message: string) => {
    setStatusType(type)
    setStatusMessage(message)
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard')
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
    handleStatus('loading', 'جاري تحديث البيانات...')
    const success = await fetchData()
    if (success) {
      handleStatus('success', 'تم تحديث البيانات بنجاح')
    } else {
      handleStatus('error', 'فشل في تحديث البيانات')
    }
  }

  const handlePrintPaymentReceipt = (payment: Payment) => {
    handleStatus('loading', 'جاري تجهيز إيصال الدفعة...')
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) {
      handleStatus('error', 'فشل في فتح نافذة الطباعة')
      return
    }

    const tax = Math.round(payment.amount * 0.15)
    const total = payment.amount + tax

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>إيصال دفعة - ${payment.id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; padding: 20px; color: #1a1a1a; background: white; }
          .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #e0e0e0; border-radius: 12px; padding: 30px; }
          .header { text-align: center; border-bottom: 2px dashed #e0e0e0; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { font-size: 24px; color: #059669; margin-bottom: 4px; }
          .header p { font-size: 12px; color: #666; }
          .receipt-num { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 8px 16px; display: inline-block; margin: 10px 0; font-weight: 600; color: #059669; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
          .info-item label { font-size: 11px; color: #888; display: block; }
          .info-item span { font-size: 14px; font-weight: 500; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .status-paid { background: #f0fdf4; color: #059669; }
          .status-pending { background: #fffbeb; color: #d97706; }
          .status-overdue { background: #fef2f2; color: #dc2626; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th { background: #f8f9fa; padding: 10px; text-align: right; font-size: 12px; color: #666; border-bottom: 2px solid #e0e0e0; }
          td { padding: 10px; font-size: 13px; border-bottom: 1px solid #eee; }
          .totals { margin-top: 16px; border-top: 2px dashed #e0e0e0; padding-top: 16px; }
          .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
          .total-row.final { font-size: 18px; font-weight: 700; color: #059669; border-top: 2px solid #059669; padding-top: 12px; margin-top: 8px; }
          .footer { text-align: center; margin-top: 24px; padding-top: 16px; border-top: 2px dashed #e0e0e0; font-size: 11px; color: #888; }
          @media print { body { padding: 0; } .receipt { border: none; } }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>ProMedia</h1>
            <p>نظام إدارة العملاء الذكي</p>
            <p>المملكة العربية السعودية</p>
            <div class="receipt-num">إيصال دفعة: ${payment.id.toUpperCase()}</div>
          </div>
          <div class="info-grid">
            <div class="info-item"><label>معرف العميل</label><span>${payment.clientId}</span></div>
            <div class="info-item"><label>الحالة</label><span class="status-badge status-${payment.status}">${paymentStatusConfig[payment.status]?.label || payment.status}</span></div>
            <div class="info-item"><label>تاريخ الاستحقاق</label><span>${new Date(payment.dueDate).toLocaleDateString('ar-SA')}</span></div>
            <div class="info-item"><label>تاريخ الدفع</label><span>${payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('ar-SA') : 'لم يتم الدفع'}</span></div>
          </div>
          ${payment.delayDays > 0 ? '<p style="background:#fef2f2;color:#dc2626;padding:8px 12px;border-radius:8px;font-size:12px;margin:8px 0;">تأخير: ' + payment.delayDays + ' يوم</p>' : ''}
          <table>
            <thead><tr><th>الوصف</th><th>المبلغ</th></tr></thead>
            <tbody><tr><td>دفعة شهرية</td><td>${payment.amount.toLocaleString()} ر.س</td></tr></tbody>
          </table>
          <div class="totals">
            <div class="total-row"><span>المبلغ</span><span>${payment.amount.toLocaleString()} ر.س</span></div>
            <div class="total-row"><span>ضريبة القيمة المضافة (15%)</span><span>${tax.toLocaleString()} ر.س</span></div>
            <div class="total-row final"><span>الإجمالي شامل الضريبة</span><span>${total.toLocaleString()} ر.س</span></div>
          </div>
          <div class="footer">
            <p>شكراً لتعاملكم معنا</p>
            <p>ProMedia - نظام إدارة العملاء الذكي</p>
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
      handleStatus('success', 'تم تجهيز الإيصال للطباعة')
    }, 500)
  }

  const handlePrintDashboard = () => {
    if (!data) return
    handleStatus('loading', 'جاري تجهيز تقرير لوحة التحكم...')
    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      handleStatus('error', 'فشل في فتح نافذة الطباعة')
      return
    }

    const paidPayments = data.recentPayments.filter(p => p.status === 'paid')
    const totalCollected = paidPayments.reduce((s, p) => s + p.amount, 0)

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>تقرير لوحة التحكم - ProMedia</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Noto Sans Arabic', sans-serif; direction: rtl; padding: 30px; color: #1a1a1a; background: white; }
          .report { max-width: 750px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 24px; }
          .header h1 { font-size: 28px; color: #059669; }
          .header p { font-size: 12px; color: #666; }
          .date { font-size: 13px; color: #333; margin-top: 8px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
          .kpi { background: #f8f9fa; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; text-align: center; }
          .kpi .label { font-size: 11px; color: #888; }
          .kpi .value { font-size: 22px; font-weight: 700; margin-top: 4px; }
          .kpi .value.green { color: #059669; }
          .kpi .value.red { color: #dc2626; }
          .kpi .value.blue { color: #2563eb; }
          .kpi .value.amber { color: #d97706; }
          .section { margin: 24px 0; }
          .section h2 { font-size: 16px; font-weight: 600; color: #333; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px; }
          .fin-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
          .fin-item { background: #f8f9fa; border-radius: 8px; padding: 12px; }
          .fin-item .label { font-size: 11px; color: #888; }
          .fin-item .value { font-size: 16px; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin: 12px 0; }
          th { background: #f8f9fa; padding: 8px; text-align: right; font-size: 11px; color: #666; border-bottom: 2px solid #e5e7eb; }
          td { padding: 8px; font-size: 12px; border-bottom: 1px solid #eee; }
          .badge { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
          .badge-green { background: #f0fdf4; color: #059669; }
          .badge-amber { background: #fffbeb; color: #d97706; }
          .badge-red { background: #fef2f2; color: #dc2626; }
          .footer { text-align: center; margin-top: 30px; padding-top: 16px; border-top: 2px dashed #e0e0e0; font-size: 11px; color: #888; }
          @media print { body { padding: 15px; } }
        </style>
      </head>
      <body>
        <div class="report">
          <div class="header">
            <h1>ProMedia</h1>
            <p>نظام إدارة العملاء الذكي - تقرير لوحة التحكم</p>
            <p class="date">${new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
          </div>

          <div class="kpi-grid">
            <div class="kpi">
              <div class="label">معدل التحصيل</div>
              <div class="value ${data.health.collectionRate >= 70 ? 'green' : 'red'}">${data.health.collectionRate}%</div>
            </div>
            <div class="kpi">
              <div class="label">هامش الربح</div>
              <div class="value ${data.health.profitMargin >= 20 ? 'blue' : 'amber'}">${data.health.profitMargin}%</div>
            </div>
            <div class="kpi">
              <div class="label">عملاء مخاطر</div>
              <div class="value ${data.health.riskClients <= 2 ? 'green' : 'red'}">${data.health.riskClients} من ${data.health.activeClients}</div>
            </div>
          </div>

          <div class="section">
            <h2>الملخص المالي</h2>
            <div class="fin-grid">
              <div class="fin-item"><div class="label">إجمالي الإيرادات</div><div class="value" style="color:#059669">${data.financial.totalRevenue.toLocaleString()} ر.س</div></div>
              <div class="fin-item"><div class="label">المتوقع</div><div class="value" style="color:#2563eb">${data.financial.expectedRevenue.toLocaleString()} ر.س</div></div>
              <div class="fin-item"><div class="label">المحصّل</div><div class="value" style="color:#059669">${totalCollected.toLocaleString()} ر.س</div></div>
              <div class="fin-item"><div class="label">المصروفات</div><div class="value" style="color:#dc2626">${data.health.totalExpenses.toLocaleString()} ر.س</div></div>
              <div class="fin-item"><div class="label">المعلّق</div><div class="value" style="color:#d97706">${data.financial.outstandingPayments.toLocaleString()} ر.س</div></div>
              <div class="fin-item"><div class="label">صحة الشركة</div><div class="value" style="color:${data.health.score >= 70 ? '#059669' : '#d97706'}">${data.health.score}%</div></div>
            </div>
          </div>

          <div class="section">
            <h2>آخر المدفوعات</h2>
            <table>
              <thead><tr><th>العميل</th><th>المبلغ</th><th>الاستحقاق</th><th>الحالة</th><th>التأخير</th></tr></thead>
              <tbody>
                ${data.recentPayments.map(p => '<tr><td>' + p.clientId + '</td><td>' + p.amount.toLocaleString() + ' ر.س</td><td>' + new Date(p.dueDate).toLocaleDateString('ar-SA') + '</td><td><span class="badge badge-' + (p.status === 'paid' ? 'green' : p.status === 'pending' ? 'amber' : 'red') + '">' + (paymentStatusConfig[p.status]?.label || p.status) + '</span></td><td>' + (p.delayDays > 0 ? p.delayDays + ' يوم' : '-') + '</td></tr>').join('')}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <p>ProMedia - نظام إدارة العملاء الذكي</p>
            <p>تقرير تلقائي - ${new Date().toLocaleDateString('ar-SA')}</p>
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
      handleStatus('success', 'تم تجهيز تقرير لوحة التحكم للطباعة')
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
            <div className="h-72 bg-white/5 rounded-2xl" />
          </div>
        </main>
      </div>
    )
  }

  if (!data) return null

  const today = new Date()
  const isFirstOfMonth = today.getDate() === 1
  const dayName = today.toLocaleDateString('ar-SA', { weekday: 'long' })
  const dateStr = today.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 animate-fade-in-down">
          <div>
            <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
            <p className="text-xs text-gray-500 mt-0.5">{dayName}، {dateStr}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintDashboard}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-y-[-1px]"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.1))',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                color: '#06b6d4',
              }}
            >
              <Printer size={15} />
              طباعة التقرير
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-gray-200 transition-all duration-200 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]"
            >
              <RefreshCw size={14} />
              تحديث
            </button>
            <div className="relative">
              <button className="p-2.5 rounded-xl text-gray-400 hover:text-gray-200 transition-all bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05]">
                <Bell size={16} />
              </button>
              {data.alerts.filter(a => !a.isRead).length > 0 && (
                <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-medium">
                  {data.alerts.filter(a => !a.isRead).length}
                </span>
              )}
            </div>
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

        {/* Day of Truth Banner */}
        {isFirstOfMonth && (
          <div className="glass-card p-5 mb-6 animate-scale-in" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(59, 130, 246, 0.06))', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
            <h2 className="text-lg font-bold text-emerald-400 mb-2">يوم الحقيقة - بداية الشهر</h2>
            <div className="grid grid-cols-4 gap-4 mt-3">
              <div>
                <p className="text-xs text-gray-400">الإيرادات المتوقعة</p>
                <p className="text-lg font-bold text-white">{data.financial.expectedRevenue.toLocaleString()} ر.س</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">المبالغ المعلقة</p>
                <p className="text-lg font-bold text-amber-400">{data.financial.outstandingPayments.toLocaleString()} ر.س</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">المصروفات</p>
                <p className="text-lg font-bold text-red-400">{data.health.totalExpenses.toLocaleString()} ر.س</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">عملاء مخاطر</p>
                <p className="text-lg font-bold text-red-400">{data.health.riskClients}</p>
              </div>
            </div>
          </div>
        )}

        {/* KPI Strip */}
        <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-in-up">
          <StatCard
            title="معدل التحصيل"
            value={`${data.health.collectionRate}%`}
            trend={data.health.collectionRate >= 70 ? 'up' : 'down'}
            trendValue={data.health.collectionRate >= 70 ? 'جيد' : 'يحتاج تحسين'}
            color={data.health.collectionRate >= 70 ? 'emerald' : 'red'}
            icon="📊"
          />
          <StatCard
            title="هامش الربح الشهري"
            value={`${data.health.profitMargin}%`}
            trend={data.health.profitMargin >= 20 ? 'up' : 'down'}
            trendValue={`${data.health.totalRevenue - data.health.totalExpenses > 0 ? '+' : ''}${(data.health.totalRevenue - data.health.totalExpenses).toLocaleString()} ر.س`}
            color={data.health.profitMargin >= 20 ? 'blue' : 'amber'}
            icon="💹"
          />
          <StatCard
            title="عدد العملاء المعرضين للخطر"
            value={data.health.riskClients}
            subtitle={`من أصل ${data.health.activeClients} عميل نشط`}
            trend={data.health.riskClients <= 2 ? 'up' : 'down'}
            trendValue={data.health.riskClients <= 2 ? 'وضع مستقر' : 'يحتاج انتباه'}
            color={data.health.riskClients <= 2 ? 'emerald' : 'red'}
            icon="⚠️"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Financial + Chart */}
          <div className="lg:col-span-2 space-y-6">
            <FinancialOverview financial={data.financial} />
            <RevenueChart data={data.financial.monthlyTrend} />
          </div>

          {/* Right Column - Health + Alerts */}
          <div className="space-y-6">
            <ClientHealthMap
              distribution={data.clientDistribution}
              topClients={data.topClients}
              riskClients={data.riskClients}
              healthScore={data.health.score}
            />
            <AlertsPanel alerts={data.alerts} />
            <ContractsTracker contracts={data.expiringContracts} />
          </div>
        </div>

        {/* Recent Payments Section */}
        <div className="mt-6 glass-card p-5 animate-fade-in-up stagger-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-cyan-400" />
              آخر المدفوعات
            </h2>
            <span className="text-xs text-gray-400">{data.recentPayments.length} دفعة</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-right text-[11px] text-gray-500 font-medium py-3 px-3">العميل</th>
                  <th className="text-right text-[11px] text-gray-500 font-medium py-3 px-3">المبلغ</th>
                  <th className="text-right text-[11px] text-gray-500 font-medium py-3 px-3">الاستحقاق</th>
                  <th className="text-right text-[11px] text-gray-500 font-medium py-3 px-3">الحالة</th>
                  <th className="text-right text-[11px] text-gray-500 font-medium py-3 px-3">التأخير</th>
                  <th className="text-right text-[11px] text-gray-500 font-medium py-3 px-3">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {data.recentPayments.map((payment) => {
                  const statusCfg = paymentStatusConfig[payment.status] || { label: payment.status, color: 'bg-gray-500/20 text-gray-400' }
                  return (
                    <tr key={payment.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3 text-sm text-white">{payment.clientId}</td>
                      <td className="py-3 px-3 text-sm text-white font-medium">{payment.amount.toLocaleString()} ر.س</td>
                      <td className="py-3 px-3 text-sm text-gray-400">{new Date(payment.dueDate).toLocaleDateString('ar-SA')}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm">
                        {payment.delayDays > 0 ? (
                          <span className="text-red-400">{payment.delayDays} يوم</span>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {payment.status === 'paid' ? (
                          <button
                            onClick={() => handlePrintPaymentReceipt(payment)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/10 text-emerald-400 rounded-lg hover:bg-emerald-600/20 transition-colors text-xs font-medium"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            طباعة إيصال
                          </button>
                        ) : (
                          <span className="text-xs text-gray-600">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
