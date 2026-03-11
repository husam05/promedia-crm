'use client'

import { useState } from 'react'
import { Client, Receipt } from '@/types'

interface ReceiptViewProps {
  isOpen: boolean
  client: Client | null
  onClose: () => void
  onStatusChange: (status: 'loading' | 'success' | 'error', message: string) => void
}

const paymentMethods: Record<string, string> = {
  cash: 'نقدي',
  bank_transfer: 'تحويل بنكي',
  credit_card: 'بطاقة ائتمان',
  check: 'شيك',
}

export default function ReceiptView({ isOpen, client, onClose, onStatusChange }: ReceiptViewProps) {
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [step, setStep] = useState<'form' | 'preview'>('form')
  const [form, setForm] = useState({
    amount: '',
    paymentMethod: 'bank_transfer' as 'cash' | 'bank_transfer' | 'credit_card' | 'check',
    paymentDate: new Date().toISOString().split('T')[0],
    description: '',
    notes: '',
  })

  if (!isOpen || !client) return null

  const handleGenerate = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      onStatusChange('error', 'يرجى إدخال المبلغ')
      return
    }

    onStatusChange('loading', 'جاري إنشاء الإيصال...')

    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          amount: Number(form.amount),
          paymentMethod: form.paymentMethod,
          paymentDate: form.paymentDate,
          description: form.description || `سداد رسوم خدمة - ${client.company}`,
          notes: form.notes,
        }),
      })

      if (!res.ok) throw new Error('فشل في إنشاء الإيصال')

      const data = await res.json()
      setReceipt(data)
      setStep('preview')
      onStatusChange('success', `تم إنشاء الإيصال ${data.receiptNumber}`)
    } catch {
      onStatusChange('error', 'فشل في إنشاء الإيصال')
    }
  }

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-print-area')
    if (!printContent) return

    const printWindow = window.open('', '_blank', 'width=800,height=600')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>إيصال ${receipt?.receiptNumber}</title>
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
          .qr-placeholder { width: 80px; height: 80px; background: #f0f0f0; border: 1px dashed #ccc; margin: 12px auto; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #999; border-radius: 8px; }
          @media print { body { padding: 0; } .receipt { border: none; } }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => { printWindow.print(); printWindow.close() }, 500)
  }

  const handleClose = () => {
    setStep('form')
    setReceipt(null)
    setForm({ amount: '', paymentMethod: 'bank_transfer', paymentDate: new Date().toISOString().split('T')[0], description: '', notes: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={handleClose}>
      <div className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto animate-scale-in rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(12, 18, 34, 0.98))', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
          <div>
            <h2 className="text-lg font-bold text-white">
              {step === 'form' ? 'إنشاء إيصال' : 'معاينة الإيصال'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{client.name} - {client.company}</p>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        {step === 'form' ? (
          <>
            {/* Receipt Form */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">المبلغ (ر.س) *</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={e => setForm({...form, amount: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/30 transition-colors"
                    placeholder={String(client.monthlyFee)}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">طريقة الدفع</label>
                  <select
                    value={form.paymentMethod}
                    onChange={e => setForm({...form, paymentMethod: e.target.value as typeof form.paymentMethod})}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/30 transition-colors"
                  >
                    <option value="bank_transfer">تحويل بنكي</option>
                    <option value="cash">نقدي</option>
                    <option value="credit_card">بطاقة ائتمان</option>
                    <option value="check">شيك</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">تاريخ الدفع</label>
                <input
                  type="date"
                  value={form.paymentDate}
                  onChange={e => setForm({...form, paymentDate: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">الوصف</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 transition-colors"
                  placeholder={`سداد رسوم خدمة - ${client.company}`}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">ملاحظات</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  rows={2}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 transition-colors resize-none"
                  placeholder="ملاحظات إضافية..."
                />
              </div>

              {/* Preview summary */}
              {form.amount && (
                <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium">ملخص الإيصال</p>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">المبلغ</span>
                      <span className="text-white">{Number(form.amount).toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">ضريبة القيمة المضافة (15%)</span>
                      <span className="text-white">{Math.round(Number(form.amount) * 0.15).toLocaleString()} ر.س</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-gray-600 pt-1.5">
                      <span className="text-emerald-400">الإجمالي</span>
                      <span className="text-emerald-400">{Math.round(Number(form.amount) * 1.15).toLocaleString()} ر.س</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-5 border-t border-white/[0.04]">
              <button onClick={handleClose} className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] text-gray-400 rounded-xl hover:bg-white/[0.05] hover:text-gray-200 transition-all text-sm font-medium">
                إلغاء
              </button>
              <button onClick={handleGenerate} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:translate-y-[-1px]" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15))', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                إنشاء الإيصال
              </button>
            </div>
          </>
        ) : receipt ? (
          <>
            {/* Receipt Preview */}
            <div className="p-5">
              <div id="receipt-print-area">
                <div className="receipt" style={{ maxWidth: 600, margin: '0 auto' }}>
                  {/* Header */}
                  <div style={{ textAlign: 'center', borderBottom: '2px dashed #374151', paddingBottom: 20, marginBottom: 20 }}>
                    <h1 style={{ fontSize: 24, color: '#10b981', marginBottom: 4 }}>ProMedia</h1>
                    <p style={{ fontSize: 12, color: '#9ca3af' }}>نظام إدارة العملاء الذكي</p>
                    <p style={{ fontSize: 11, color: '#9ca3af' }}>المملكة العربية السعودية</p>
                    <div style={{ background: '#064e3b', border: '1px solid #059669', borderRadius: 8, padding: '8px 16px', display: 'inline-block', marginTop: 12, fontWeight: 600, color: '#10b981', fontSize: 14 }}>
                      إيصال رقم: {receipt.receiptNumber}
                    </div>
                  </div>

                  {/* Client Info */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: 11, color: '#9ca3af' }}>العميل</p>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{receipt.clientName}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: '#9ca3af' }}>الشركة</p>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{receipt.company}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: '#9ca3af' }}>تاريخ الدفع</p>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{new Date(receipt.paymentDate).toLocaleDateString('ar-SA')}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: '#9ca3af' }}>طريقة الدفع</p>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{paymentMethods[receipt.paymentMethod]}</p>
                    </div>
                  </div>

                  {/* Items Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
                    <thead>
                      <tr style={{ background: '#1f2937' }}>
                        <th style={{ padding: 10, textAlign: 'right', fontSize: 12, color: '#9ca3af', borderBottom: '2px solid #374151' }}>الوصف</th>
                        <th style={{ padding: 10, textAlign: 'center', fontSize: 12, color: '#9ca3af', borderBottom: '2px solid #374151' }}>الكمية</th>
                        <th style={{ padding: 10, textAlign: 'center', fontSize: 12, color: '#9ca3af', borderBottom: '2px solid #374151' }}>السعر</th>
                        <th style={{ padding: 10, textAlign: 'left', fontSize: 12, color: '#9ca3af', borderBottom: '2px solid #374151' }}>الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipt.items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ padding: 10, fontSize: 13, color: '#e5e7eb', borderBottom: '1px solid #1f2937' }}>{item.description}</td>
                          <td style={{ padding: 10, fontSize: 13, color: '#e5e7eb', textAlign: 'center', borderBottom: '1px solid #1f2937' }}>{item.quantity}</td>
                          <td style={{ padding: 10, fontSize: 13, color: '#e5e7eb', textAlign: 'center', borderBottom: '1px solid #1f2937' }}>{item.unitPrice.toLocaleString()} ر.س</td>
                          <td style={{ padding: 10, fontSize: 13, color: '#e5e7eb', textAlign: 'left', borderBottom: '1px solid #1f2937' }}>{item.total.toLocaleString()} ر.س</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div style={{ marginTop: 16, borderTop: '2px dashed #374151', paddingTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, color: '#9ca3af' }}>
                      <span>المبلغ قبل الضريبة</span>
                      <span style={{ color: '#fff' }}>{receipt.amount.toLocaleString()} ر.س</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, color: '#9ca3af' }}>
                      <span>ضريبة القيمة المضافة (15%)</span>
                      <span style={{ color: '#fff' }}>{receipt.tax.toLocaleString()} ر.س</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 6px', fontSize: 18, fontWeight: 700, color: '#10b981', borderTop: '2px solid #059669', marginTop: 8 }}>
                      <span>الإجمالي شامل الضريبة</span>
                      <span>{receipt.totalWithTax.toLocaleString()} ر.س</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 16, borderTop: '2px dashed #374151', fontSize: 11, color: '#6b7280' }}>
                    <div style={{ width: 80, height: 80, background: '#1f2937', border: '1px dashed #374151', margin: '12px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#6b7280', borderRadius: 8 }}>
                      QR Code
                    </div>
                    <p>شكراً لتعاملكم معنا</p>
                    <p style={{ marginTop: 4 }}>ProMedia - نظام إدارة العملاء الذكي</p>
                    {receipt.notes && <p style={{ marginTop: 8, fontStyle: 'italic' }}>{receipt.notes}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-5 border-t border-white/[0.04]">
              <button onClick={handleClose} className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] text-gray-400 rounded-xl hover:bg-white/[0.05] hover:text-gray-200 transition-all text-sm font-medium">
                إغلاق
              </button>
              <button onClick={() => { setStep('form'); setReceipt(null) }} className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                إيصال جديد
              </button>
              <button onClick={handlePrint} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:translate-y-[-1px] flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15))', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                طباعة الإيصال
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
