'use client'

import { useState, useEffect } from 'react'
import { ClientCategory, ClientStatus } from '@/types'

interface AddClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onStatusChange: (status: 'loading' | 'success' | 'error', message: string) => void
}

const steps = [
  { id: 1, label: 'بيانات العميل', icon: '👤' },
  { id: 2, label: 'تفاصيل العقد', icon: '📋' },
  { id: 3, label: 'مراجعة وتأكيد', icon: '✓' },
]

const categoryLabels: Record<string, { label: string; color: string; bg: string }> = {
  A: { label: 'فئة A - مميز', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' },
  B: { label: 'فئة B - عادي', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' },
  C: { label: 'فئة C - يحتاج متابعة', color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30' },
}

const statusLabels: Record<string, string> = {
  active: 'نشط',
  inactive: 'غير نشط',
  suspended: 'موقوف',
}

export default function AddClientModal({ isOpen, onClose, onSuccess, onStatusChange }: AddClientModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
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

  // Auto-calculate contract value
  const contractMonths = form.contractStart && form.contractEnd
    ? Math.max(0, Math.round((new Date(form.contractEnd).getTime() - new Date(form.contractStart).getTime()) / (1000 * 60 * 60 * 24 * 30)))
    : 0

  const autoContractValue = form.monthlyFee && contractMonths > 0
    ? Number(form.monthlyFee) * contractMonths
    : 0

  // Auto-fill contract value when monthlyFee and dates change
  useEffect(() => {
    if (autoContractValue > 0 && !form.contractValue) {
      setForm(f => ({ ...f, contractValue: String(autoContractValue) }))
    }
  }, [autoContractValue, form.contractValue])

  if (!isOpen) return null

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'اسم العميل مطلوب'
    if (!form.email.trim()) e.email = 'البريد الإلكتروني مطلوب'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'بريد إلكتروني غير صالح'
    if (!form.phone.trim()) e.phone = 'رقم الهاتف مطلوب'
    if (!form.company.trim()) e.company = 'اسم الشركة مطلوب'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (!form.monthlyFee || Number(form.monthlyFee) <= 0) e.monthlyFee = 'الرسوم الشهرية مطلوبة'
    if (!form.contractValue || Number(form.contractValue) <= 0) e.contractValue = 'قيمة العقد مطلوبة'
    if (!form.contractStart) e.contractStart = 'تاريخ بداية العقد مطلوب'
    if (!form.contractEnd) e.contractEnd = 'تاريخ نهاية العقد مطلوب'
    if (form.contractStart && form.contractEnd && form.contractStart >= form.contractEnd) e.contractEnd = 'تاريخ النهاية يجب أن يكون بعد البداية'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const handleSubmit = async () => {
    onStatusChange('loading', 'جاري إضافة العميل...')

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          monthlyFee: Number(form.monthlyFee),
          contractValue: Number(form.contractValue),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'فشل في إضافة العميل')
      }

      onStatusChange('success', 'تم إضافة العميل بنجاح')
      onSuccess()
      handleClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'فشل في إضافة العميل'
      onStatusChange('error', message)
    }
  }

  const handleClose = () => {
    setCurrentStep(1)
    setForm({ name: '', email: '', phone: '', company: '', category: 'B', status: 'active', monthlyFee: '', contractValue: '', contractStart: '', contractEnd: '', notes: '' })
    setErrors({})
    onClose()
  }

  const inputClass = (field: string) => `w-full bg-gray-800 border ${errors[field] ? 'border-red-500' : 'border-gray-700'} rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors`

  const monthlyVAT = form.monthlyFee ? Math.round(Number(form.monthlyFee) * 0.15) : 0
  const totalVAT = form.contractValue ? Math.round(Number(form.contractValue) * 0.15) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={handleClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">إضافة عميل جديد</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        {/* Step Progress Indicator */}
        <div className="px-5 pt-5">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    currentStep > step.id
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : currentStep === step.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-gray-800 border-gray-700 text-gray-500'
                  }`}>
                    {currentStep > step.id ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={`text-[10px] mt-1.5 font-medium ${
                    currentStep >= step.id ? 'text-emerald-400' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 mt-[-16px] rounded-full transition-colors ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Client Info */}
        {currentStep === 1 && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">اسم العميل *</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass('name')} placeholder="مثال: شركة النجاح" />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">اسم الشركة *</label>
                <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className={inputClass('company')} placeholder="النجاح" />
                {errors.company && <p className="text-xs text-red-400 mt-1">{errors.company}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">البريد الإلكتروني *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className={inputClass('email')} placeholder="info@example.sa" dir="ltr" />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">رقم الهاتف *</label>
                <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className={inputClass('phone')} placeholder="+966500000000" dir="ltr" />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contract Details */}
        {currentStep === 2 && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">تصنيف العميل</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value as ClientCategory})} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500">
                  <option value="A">فئة A - مميز</option>
                  <option value="B">فئة B - عادي</option>
                  <option value="C">فئة C - يحتاج متابعة</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">الحالة</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value as ClientStatus})} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500">
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="suspended">موقوف</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">الرسوم الشهرية (ر.س) *</label>
                <input type="number" value={form.monthlyFee} onChange={e => setForm({...form, monthlyFee: e.target.value})} className={inputClass('monthlyFee')} placeholder="5000" min="0" />
                {errors.monthlyFee && <p className="text-xs text-red-400 mt-1">{errors.monthlyFee}</p>}
                {form.monthlyFee && (
                  <p className="text-[10px] text-gray-500 mt-1">+ ضريبة {monthlyVAT.toLocaleString()} ر.س = {(Number(form.monthlyFee) + monthlyVAT).toLocaleString()} ر.س</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">قيمة العقد الإجمالية (ر.س) *</label>
                <input type="number" value={form.contractValue} onChange={e => setForm({...form, contractValue: e.target.value})} className={inputClass('contractValue')} placeholder="60000" min="0" />
                {errors.contractValue && <p className="text-xs text-red-400 mt-1">{errors.contractValue}</p>}
                {form.contractValue && (
                  <p className="text-[10px] text-gray-500 mt-1">+ ضريبة {totalVAT.toLocaleString()} ر.س = {(Number(form.contractValue) + totalVAT).toLocaleString()} ر.س</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">بداية العقد *</label>
                <input type="date" value={form.contractStart} onChange={e => setForm({...form, contractStart: e.target.value})} className={inputClass('contractStart')} />
                {errors.contractStart && <p className="text-xs text-red-400 mt-1">{errors.contractStart}</p>}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">نهاية العقد *</label>
                <input type="date" value={form.contractEnd} onChange={e => setForm({...form, contractEnd: e.target.value})} className={inputClass('contractEnd')} />
                {errors.contractEnd && <p className="text-xs text-red-400 mt-1">{errors.contractEnd}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">ملاحظات</label>
              <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={2} className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none" placeholder="ملاحظات إضافية..." />
            </div>

            {/* Auto-calculate hint */}
            {form.monthlyFee && contractMonths > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-3 text-xs text-gray-400">
                <span className="text-emerald-400 font-medium">حساب تلقائي: </span>
                مدة العقد: {contractMonths} شهر
                {' '} | القيمة المتوقعة: {autoContractValue.toLocaleString()} ر.س
                {' '} | شامل الضريبة: {Math.round(autoContractValue * 1.15).toLocaleString()} ر.س
              </div>
            )}
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {currentStep === 3 && (
          <div className="p-5 space-y-4">
            {/* Client Info Summary */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <span className="text-blue-400">👤</span> بيانات العميل
                </h3>
                <button onClick={() => setCurrentStep(1)} className="text-xs text-blue-400 hover:text-blue-300">تعديل</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-500">الاسم</p>
                  <p className="text-sm text-white">{form.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">الشركة</p>
                  <p className="text-sm text-white">{form.company}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">البريد</p>
                  <p className="text-sm text-white" dir="ltr">{form.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">الهاتف</p>
                  <p className="text-sm text-white" dir="ltr">{form.phone}</p>
                </div>
              </div>
            </div>

            {/* Contract Summary */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <span className="text-emerald-400">📋</span> تفاصيل العقد
                </h3>
                <button onClick={() => setCurrentStep(2)} className="text-xs text-blue-400 hover:text-blue-300">تعديل</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-500">التصنيف</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs border ${categoryLabels[form.category].bg} ${categoryLabels[form.category].color}`}>
                    {categoryLabels[form.category].label}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">الحالة</p>
                  <p className="text-sm text-white">{statusLabels[form.status]}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">بداية العقد</p>
                  <p className="text-sm text-white">{form.contractStart ? new Date(form.contractStart).toLocaleDateString('ar-SA') : '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500">نهاية العقد</p>
                  <p className="text-sm text-white">{form.contractEnd ? new Date(form.contractEnd).toLocaleDateString('ar-SA') : '-'}</p>
                </div>
              </div>
              {form.notes && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-[10px] text-gray-500">ملاحظات</p>
                  <p className="text-sm text-white">{form.notes}</p>
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                <span>💰</span> الملخص المالي
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">الرسوم الشهرية</span>
                  <span className="text-white">{Number(form.monthlyFee).toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">ضريبة شهرية (15%)</span>
                  <span className="text-gray-300">{monthlyVAT.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">الشهري شامل الضريبة</span>
                  <span className="text-white">{(Number(form.monthlyFee) + monthlyVAT).toLocaleString()} ر.س</span>
                </div>
                <div className="border-t border-gray-700 my-1" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">قيمة العقد</span>
                  <span className="text-white">{Number(form.contractValue).toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">مدة العقد</span>
                  <span className="text-white">{contractMonths} شهر</span>
                </div>
                <div className="flex justify-between text-sm font-bold border-t border-emerald-500/30 pt-2 mt-1">
                  <span className="text-emerald-400">الإجمالي شامل الضريبة</span>
                  <span className="text-emerald-400">{(Number(form.contractValue) + totalVAT).toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex gap-3 p-5 border-t border-gray-800">
          {currentStep > 1 && (
            <button onClick={handleBack} className="px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium">
              السابق
            </button>
          )}
          <button onClick={handleClose} className="flex-1 px-4 py-2.5 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium">
            إلغاء
          </button>
          {currentStep < 3 ? (
            <button onClick={handleNext} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium">
              التالي
            </button>
          ) : (
            <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              إضافة العميل
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
