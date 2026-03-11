'use client'

import { Contract } from '@/types'
import { Clock, RefreshCw } from 'lucide-react'

interface Props {
  contracts: Contract[]
}

export default function ContractsTracker({ contracts }: Props) {
  const getDaysRemaining = (endDate: string) => {
    return Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  const getStatusStyle = (days: number) => {
    if (days <= 0) return { bg: 'bg-red-500/[0.06]', border: 'border-red-500/15', text: 'text-red-400', ring: 'ring-red-500/20' }
    if (days <= 30) return { bg: 'bg-amber-500/[0.06]', border: 'border-amber-500/15', text: 'text-amber-400', ring: 'ring-amber-500/20' }
    if (days <= 90) return { bg: 'bg-blue-500/[0.06]', border: 'border-blue-500/15', text: 'text-blue-400', ring: 'ring-blue-500/20' }
    return { bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-500/15', text: 'text-emerald-400', ring: 'ring-emerald-500/20' }
  }

  return (
    <div className="glass-card p-5 animate-fade-in-up stagger-6">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Clock size={16} className="text-cyan-400" />
        متتبع العقود
      </h2>
      {contracts.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">لا توجد عقود تنتهي قريباً</p>
      ) : (
        <div className="space-y-2.5">
          {contracts.map((contract) => {
            const days = getDaysRemaining(contract.endDate)
            const style = getStatusStyle(days)
            return (
              <div key={contract.id} className={`p-3 rounded-xl border ${style.bg} ${style.border} transition-all duration-200 hover:translate-x-[-2px]`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{contract.serviceName}</p>
                    <p className={`text-[11px] ${style.text} opacity-70`}>قيمة العقد: {contract.value.toLocaleString()} د.ع</p>
                  </div>
                  <div className="text-left">
                    <p className={`text-xl font-bold ${style.text}`}>{days}</p>
                    <p className="text-[10px] text-gray-600">يوم متبقي</p>
                  </div>
                </div>
                {contract.autoRenew && (
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] bg-emerald-500/[0.06] text-emerald-400/80 px-2 py-0.5 rounded-lg">
                    <RefreshCw size={9} />
                    تجديد تلقائي
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
