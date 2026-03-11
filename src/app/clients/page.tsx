'use client'

import { useEffect, useState, useCallback } from 'react'
import { Client, ClientCategory, ClientStatus, Receipt } from '@/types'
import Sidebar from '@/components/ui/sidebar'
import StatusLine from '@/components/ui/status-line'
import type { StatusType } from '@/components/ui/status-line'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import AddClientModal from '@/components/clients/add-client-modal'
import EditClientModal from '@/components/clients/edit-client-modal'
import ReceiptView from '@/components/clients/receipt-view'
import { UserPlus, Search, Printer, Edit3, Pause, Play, Trash2, FileText } from 'lucide-react'

const categoryConfig: Record<ClientCategory, { label: string; color: string; bg: string }> = {
  A: { label: 'مميز', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' },
  B: { label: 'عادي', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' },
  C: { label: 'عالي الصيانة', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' },
}

const statusConfig: Record<ClientStatus, { label: string; color: string }> = {
  active: { label: 'نشط', color: 'bg-emerald-500/20 text-emerald-400' },
  inactive: { label: 'غير نشط', color: 'bg-gray-500/20 text-gray-400' },
  suspended: { label: 'موقوف', color: 'bg-red-500/20 text-red-400' },
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<ClientCategory | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<ClientStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [receiptClient, setReceiptClient] = useState<Client | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)

  // Status line
  const [statusType, setStatusType] = useState<StatusType>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleStatus = useCallback((type: 'loading' | 'success' | 'error', message: string) => {
    setStatusType(type)
    setStatusMessage(message)
  }, [])

  const paymentMethodLabels: Record<string, string> = {
    cash: 'نقدي',
    bank_transfer: 'تحويل بنكي',
    credit_card: 'بطاقة ائتمان',
    check: 'شيك',
  }

  const [clientReceipts, setClientReceipts] = useState<Receipt[]>([])

  useEffect(() => {
    if (expandedId) {
      fetch(`/api/receipts?clientId=${expandedId}`)
        .then(res => res.json())
        .then(setClientReceipts)
        .catch(() => setClientReceipts([]))
    } else {
      setClientReceipts([])
    }
  }, [expandedId])

  const handlePrintReceipt = (receipt: Receipt) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>إيصال ${receipt.receiptNumber}</title>
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
            <p>جمهورية العراق - بغداد</p>
            <div class="receipt-num">إيصال رقم: ${receipt.receiptNumber}</div>
          </div>
          <div class="info-grid">
            <div class="info-item"><label>العميل</label><span>${receipt.clientName}</span></div>
            <div class="info-item"><label>الشركة</label><span>${receipt.company}</span></div>
            <div class="info-item"><label>تاريخ الدفع</label><span>${new Date(receipt.paymentDate).toLocaleDateString('ar-IQ')}</span></div>
            <div class="info-item"><label>طريقة الدفع</label><span>${paymentMethodLabels[receipt.paymentMethod] || receipt.paymentMethod}</span></div>
          </div>
          <table>
            <thead><tr><th>الوصف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
            <tbody>${receipt.items.map(item => '<tr><td>' + item.description + '</td><td style="text-align:center">' + item.quantity + '</td><td style="text-align:center">' + item.unitPrice.toLocaleString() + ' د.ع</td><td style="text-align:left">' + item.total.toLocaleString() + ' د.ع</td></tr>').join('')}</tbody>
          </table>
          <div class="totals">
            <div class="total-row"><span>المبلغ قبل الضريبة</span><span>${receipt.amount.toLocaleString()} د.ع</span></div>
            <div class="total-row"><span>ضريبة القيمة المضافة (15%)</span><span>${receipt.tax.toLocaleString()} د.ع</span></div>
            <div class="total-row final"><span>الإجمالي شامل الضريبة</span><span>${receipt.totalWithTax.toLocaleString()} د.ع</span></div>
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
    setTimeout(() => { printWindow.print(); printWindow.close() }, 500)
  }

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients')
      const data = await res.json()
      setClients(data)
    } catch {
      handleStatus('error', 'فشل في تحميل بيانات العملاء')
    } finally {
      setLoading(false)
    }
  }, [handleStatus])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  const handleDelete = async () => {
    if (!deleteTarget) return
    handleStatus('loading', `جاري حذف "${deleteTarget.name}"...`)
    try {
      const res = await fetch(`/api/clients/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      handleStatus('success', `تم حذف "${deleteTarget.name}" بنجاح`)
      setDeleteTarget(null)
      fetchClients()
    } catch {
      handleStatus('error', 'فشل في حذف العميل')
    }
  }

  const handleStatusToggle = async (client: Client) => {
    const newStatus = client.status === 'active' ? 'suspended' : 'active'
    const label = newStatus === 'active' ? 'تفعيل' : 'إيقاف'
    handleStatus('loading', `جاري ${label} "${client.name}"...`)
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      handleStatus('success', `تم ${label} "${client.name}" بنجاح`)
      fetchClients()
    } catch {
      handleStatus('error', `فشل في ${label} العميل`)
    }
  }

  // Filter
  const filtered = clients.filter(c => {
    const matchesSearch = !search || c.name.includes(search) || c.company.includes(search) || c.email.includes(search) || c.phone.includes(search)
    const matchesCategory = filterCategory === 'all' || c.category === filterCategory
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    risk: clients.filter(c => c.riskScore > 60).length,
    avgScore: clients.length > 0 ? Math.round(clients.reduce((s, c) => s + c.clientScore, 0) / clients.length) : 0,
    totalRevenue: clients.filter(c => c.status === 'active').reduce((s, c) => s + c.monthlyFee, 0),
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        {/* Header with Add Button */}
        <div className="flex items-start justify-between mb-6 animate-fade-in-down">
          <div>
            <h1 className="text-2xl font-bold text-white">إدارة العملاء</h1>
            <p className="text-xs text-gray-500 mt-0.5">تصنيف ذكي وتحليل شامل للعملاء</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:translate-y-[-1px] hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#10b981',
            }}
          >
            <UserPlus size={16} />
            إضافة عميل
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 animate-fade-in-up">
          <div className="glass-card p-4">
            <p className="text-[11px] text-gray-500">إجمالي العملاء</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-[11px] text-gray-500">عملاء نشطون</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.active}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-[11px] text-gray-500">عملاء مخاطر</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{stats.risk}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-[11px] text-gray-500">متوسط التقييم</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{stats.avgScore}</p>
          </div>
          <div className="glass-card p-4">
            <p className="text-[11px] text-gray-500">الإيراد الشهري</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-gray-600">د.ع</p>
          </div>
        </div>

        {/* Search, Filter & Status */}
        <div className="flex flex-wrap gap-3 mb-6 animate-fade-in-up stagger-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="البحث بالاسم، الشركة، البريد أو الهاتف..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pr-10 pl-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 text-sm transition-colors"
            />
          </div>
          {/* Category Filter */}
          <div className="flex gap-1.5">
            {(['all', 'A', 'B', 'C'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  filterCategory === cat
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'bg-white/[0.02] text-gray-500 border border-white/[0.04] hover:bg-white/[0.04] hover:text-gray-300'
                }`}
              >
                {cat === 'all' ? 'الكل' : `فئة ${cat}`}
              </button>
            ))}
          </div>
          {/* Status Filter */}
          <div className="flex gap-1.5">
            {(['all', 'active', 'inactive', 'suspended'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  filterStatus === st
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : 'bg-white/[0.02] text-gray-500 border border-white/[0.04] hover:bg-white/[0.04] hover:text-gray-300'
                }`}
              >
                {st === 'all' ? 'كل الحالات' : statusConfig[st].label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-500">
            عرض {filtered.length} من {clients.length} عميل
          </p>
        </div>

        {/* Client List */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-20 bg-gray-800/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-2">لا يوجد عملاء</p>
            <p className="text-gray-600 text-sm">
              {search || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'جرب تغيير معايير البحث'
                : 'ابدأ بإضافة عميل جديد'}
            </p>
            {!search && filterCategory === 'all' && filterStatus === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm"
              >
                إضافة أول عميل
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(client => (
              <div key={client.id} className="glass-card overflow-hidden group">
                {/* Client Row */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-4 flex-1 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
                    >
                      <span className={`w-10 h-10 rounded-xl ${categoryConfig[client.category].bg} border flex items-center justify-center text-sm font-bold ${categoryConfig[client.category].color} shrink-0`}>
                        {client.category}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-white font-medium truncate">{client.name}</h3>
                        <p className="text-xs text-gray-400 truncate">{client.company} • {client.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mr-4">
                      <div className="text-center hidden md:block">
                        <p className="text-xs text-gray-500">الرسوم</p>
                        <p className="text-sm font-bold text-white">{client.monthlyFee.toLocaleString()}</p>
                      </div>
                      <div className="text-center hidden md:block">
                        <p className="text-xs text-gray-500">التقييم</p>
                        <p className={`text-sm font-bold ${client.clientScore >= 80 ? 'text-emerald-400' : client.clientScore >= 60 ? 'text-blue-400' : 'text-red-400'}`}>
                          {client.clientScore}
                        </p>
                      </div>
                      <div className="text-center hidden md:block">
                        <p className="text-xs text-gray-500">المخاطر</p>
                        <p className={`text-sm font-bold ${client.riskScore <= 30 ? 'text-emerald-400' : client.riskScore <= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                          {client.riskScore}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs shrink-0 ${statusConfig[client.status].color}`}>
                        {statusConfig[client.status].label}
                      </span>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Receipt */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setReceiptClient(client) }}
                          className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          title="إنشاء إيصال"
                        >
                          <Printer size={16} />
                        </button>
                        {/* Edit */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditClient(client) }}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          title="تعديل"
                        >
                          <Edit3 size={16} />
                        </button>
                        {/* Toggle Status */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStatusToggle(client) }}
                          className={`p-2 rounded-lg transition-colors ${client.status === 'active' ? 'text-gray-400 hover:text-amber-400 hover:bg-amber-500/10' : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10'}`}
                          title={client.status === 'active' ? 'إيقاف' : 'تفعيل'}
                        >
                          {client.status === 'active' ? (
                            <Pause size={16} />
                          ) : (
                            <Play size={16} />
                          )}
                        </button>
                        {/* Delete */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(client) }}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === client.id && (
                  <div className="border-t border-white/[0.04] p-4 bg-white/[0.01] animate-fade-in-up">
                    {/* Metrics Bars */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">موثوقية الدفع</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-700 rounded-full">
                            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${client.paymentReliability}%` }} />
                          </div>
                          <span className="text-xs text-white w-8 text-left">{client.paymentReliability}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">استقرار التواصل</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-700 rounded-full">
                            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${client.communicationStability}%` }} />
                          </div>
                          <span className="text-xs text-white w-8 text-left">{client.communicationStability}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">ربحية المشروع</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-700 rounded-full">
                            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${client.projectProfitability}%` }} />
                          </div>
                          <span className="text-xs text-white w-8 text-left">{client.projectProfitability}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">الولاء</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-700 rounded-full">
                            <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${client.loyaltyScore}%` }} />
                          </div>
                          <span className="text-xs text-white w-8 text-left">{client.loyaltyScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-400">قيمة العقد</p>
                        <p className="text-sm text-white font-medium">{client.contractValue.toLocaleString()} د.ع</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">القيمة مدى الحياة</p>
                        <p className="text-sm text-white font-medium">{client.lifetimeValue.toLocaleString()} د.ع</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">عدد التأخيرات</p>
                        <p className="text-sm text-white font-medium">{client.delayCount} مرة (متوسط {client.avgDelayDays} يوم)</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">الهاتف</p>
                        <p className="text-sm text-white font-medium" dir="ltr">{client.phone}</p>
                      </div>
                    </div>

                    {/* Notes & Contract */}
                    <div className="mt-4 p-3 bg-gray-800/50 rounded-xl">
                      <p className="text-xs text-gray-400 mb-1">ملاحظات</p>
                      <p className="text-sm text-white">{client.notes || 'لا توجد ملاحظات'}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1.5 rounded-lg">
                        العقد: {new Date(client.contractStart).toLocaleDateString('ar-IQ')} - {new Date(client.contractEnd).toLocaleDateString('ar-IQ')}
                      </span>
                      {client.lastPaymentDate && (
                        <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1.5 rounded-lg">
                          آخر دفعة: {new Date(client.lastPaymentDate).toLocaleDateString('ar-IQ')}
                        </span>
                      )}
                      <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1.5 rounded-lg">
                        تاريخ التسجيل: {new Date(client.createdAt).toLocaleDateString('ar-IQ')}
                      </span>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4 flex gap-2 pt-3 border-t border-gray-700/50">
                      <button
                        onClick={() => setReceiptClient(client)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600/10 text-emerald-400 rounded-lg hover:bg-emerald-600/20 transition-colors text-xs font-medium"
                      >
                        <Printer size={14} />
                        إنشاء إيصال
                      </button>
                      <button
                        onClick={() => setEditClient(client)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600/20 transition-colors text-xs font-medium"
                      >
                        <Edit3 size={14} />
                        تعديل البيانات
                      </button>
                      <button
                        onClick={() => handleStatusToggle(client)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-xs font-medium ${
                          client.status === 'active'
                            ? 'bg-amber-600/10 text-amber-400 hover:bg-amber-600/20'
                            : 'bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20'
                        }`}
                      >
                        {client.status === 'active' ? 'إيقاف العميل' : 'تفعيل العميل'}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(client)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-600/10 text-red-400 rounded-lg hover:bg-red-600/20 transition-colors text-xs font-medium"
                      >
                        <Trash2 size={14} />
                        حذف
                      </button>
                    </div>

                    {/* Receipt History */}
                    <div className="mt-4 pt-3 border-t border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-white flex items-center gap-2">
                          <FileText size={16} className="text-emerald-400" />
                          سجل الإيصالات
                        </h4>
                        <button
                          onClick={() => setReceiptClient(client)}
                          className="text-xs text-emerald-400 hover:text-emerald-300"
                        >
                          + إيصال جديد
                        </button>
                      </div>
                      {clientReceipts.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center py-3">لا توجد إيصالات سابقة</p>
                      ) : (
                        <div className="space-y-2">
                          {clientReceipts.map(r => (
                            <div key={r.id} className="flex items-center justify-between p-2.5 bg-gray-800/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-emerald-400">{r.receiptNumber}</span>
                                <span className="text-xs text-gray-400">{new Date(r.paymentDate).toLocaleDateString('ar-IQ')}</span>
                                <span className="text-xs text-gray-500">{paymentMethodLabels[r.paymentMethod]}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-white">{r.totalWithTax.toLocaleString()} د.ع</span>
                                <button
                                  onClick={() => handlePrintReceipt(r)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                                  title="طباعة الإيصال"
                                >
                                  <Printer size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        <AddClientModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchClients}
          onStatusChange={handleStatus}
        />

        <EditClientModal
          isOpen={!!editClient}
          client={editClient}
          onClose={() => setEditClient(null)}
          onSuccess={fetchClients}
          onStatusChange={handleStatus}
        />

        <ReceiptView
          isOpen={!!receiptClient}
          client={receiptClient}
          onClose={() => setReceiptClient(null)}
          onStatusChange={handleStatus}
        />

        <ConfirmDialog
          isOpen={!!deleteTarget}
          title="حذف العميل"
          message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
          confirmText="حذف"
          cancelText="إلغاء"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </main>
    </div>
  )
}
