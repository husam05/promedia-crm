'use client'

import { useState, useEffect } from 'react'
import { Client, ClientCategory, ClientStatus } from '@/types'

interface EditClientModalProps {
  isOpen: boolean
  client: Client | null
  onClose: () => void
  onSuccess: () => void
  onStatusChange: (status: 'loading' | 'success' | 'error', message: string) => void
}

export default function EditClientModal({ isOpen, client, onClose, onSuccess, onStatusChange }: EditClientModalProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    category: 'B' as ClientCategory,
    status: 'active' as ClientStatus,
    monthlyFee: '',
    contractValue: '',
    contractStart: '',
    contractEnd: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        category: client.category,
        status: client.status,
        monthlyFee: String(client.monthlyFee),
        contractValue: String(client.contractValue),
        contractStart: client.contractStart,
        contractEnd: client.contractEnd,
        notes: client.notes,
      })
      setErrors({})
    }
  }, [client])

  if (!isOpen || !client) return null

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'اسم العميل مطلوب'
    if (!form.email.trim()) e.email = 'البريد الإلكتروني مطلوب'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'بريد إلكتروني غير صالح'
    if (!form.phone.trim()) e.phone = 'رقم الهاتف مطلوب'
    if (!form.company.trim()) e.company = 'اسم الشركة مطلوب'
    if (!form.monthlyFee || Number(form.monthlyFee) <= 0) e.monthlyFee = 'الرسوم الشهرية مطلوبة'
    if (!form.contractValue || Number(form.contractValue) <= 0) e.contractValue = 'قيمة العقد مطلوبة'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    onStatusChange('loading', 'جاري تحديث بيانات العميل...')

    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          monthlyFee: Number(form.monthlyFee),
          contractValue: Number(form.contractValue),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'فشل في تحديث العميل')
      }

      onStatusChange('success', `تم تحديث بيانات "${form.name}" بنجاح`)
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل في تحديث العميل'
      onStatusChange('error', message)
    }
  }

  const inputClass = (field: string) => `w-full bg-white/[0.03] border ${errors[field] ? 'border-red-500/50' : 'border-white/[0.06]'} rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 transition-colors`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={onClose}>
      <div className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto animate-scale-in rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(12, 18, 34, 0.98))', border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
          <div>
            <h2 className="text-lg font-bold text-white">تعديل بيانات العميل</h2>
            <p className="text-xs text-gray-400 mt-0.5">#{client.id} - {client.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">اسم العميل *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass('name')} />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">اسم الشركة *</label>
              <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className={inputClass('company')} />
              {errors.company && <p className="text-xs text-red-400 mt-1">{errors.company}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">البريد الإلكتروني *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputClass('email')} dir="ltr" />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">رقم الهاتف *</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClass('phone')} dir="ltr" />
              {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">تصنيف العميل</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value as ClientCategory})} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/30 transition-colors">
                <option value="A">فئة A - مميز</option>
                <option value="B">فئة B - عادي</option>
                <option value="C">فئة C - يحتاج متابعة</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">الحالة</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value as ClientStatus})} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/30 transition-colors">
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="suspended">موقوف</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">الرسوم الشهرية (ر.س) *</label>
              <input type="number" value={form.monthlyFee} onChange={e => setForm({...form, monthlyFee: e.target.value})} className={inputClass('monthlyFee')} min="0" />
              {errors.monthlyFee && <p className="text-xs text-red-400 mt-1">{errors.monthlyFee}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">قيمة العقد الإجمالية (ر.س) *</label>
              <input type="number" value={form.contractValue} onChange={e => setForm({...form, contractValue: e.target.value})} className={inputClass('contractValue')} min="0" />
              {errors.contractValue && <p className="text-xs text-red-400 mt-1">{errors.contractValue}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">بداية العقد</label>
              <input type="date" value={form.contractStart} onChange={e => setForm({...form, contractStart: e.target.value})} className={inputClass('contractStart')} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">نهاية العقد</label>
              <input type="date" value={form.contractEnd} onChange={e => setForm({...form, contractEnd: e.target.value})} className={inputClass('contractEnd')} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">ملاحظات</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 resize-none transition-colors" />
          </div>

          {/* Client metrics (read-only) */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-2 font-medium">مؤشرات العميل (حساب تلقائي)</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400">{client.clientScore}</p>
                <p className="text-[10px] text-gray-500">التقييم</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-400">{client.riskScore}</p>
                <p className="text-[10px] text-gray-500">المخاطر</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-400">{client.loyaltyScore}</p>
                <p className="text-[10px] text-gray-500">الولاء</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-400">{client.lifetimeValue.toLocaleString()}</p>
                <p className="text-[10px] text-gray-500">القيمة الكلية</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-white/[0.04]">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] text-gray-400 rounded-xl hover:bg-white/[0.05] hover:text-gray-200 transition-all text-sm font-medium">
            إلغاء
          </button>
          <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:translate-y-[-1px]" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.15))', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
            حفظ التعديلات
          </button>
        </div>
      </div>
    </div>
  )
}
