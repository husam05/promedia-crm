'use client'

import { Contract } from '@/types'

interface Props {
  contracts: Contract[]
}

export default function ContractsTracker({ contracts }: Props) {
  const getDaysRemaining = (endDate: string) => {
    return Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  }

  const getStatusColor = (days: number) => {
    if (days <= 0) return 'bg-red-500/20 text-red-400 border-red-500/30'
    if (days <= 30) return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    if (days <= 90) return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <h2 className="text-lg font-bold text-white mb-4">متتبع العقود</h2>
      {contracts.length === 0 ? (
        <p className="text-gray-400 text-sm">لا توجد عقود تنتهي قريباً</p>
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => {
            const days = getDaysRemaining(contract.endDate)
            return (
              <div key={contract.id} className={`p-3 rounded-xl border ${getStatusColor(days)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{contract.serviceName}</p>
                    <p className="text-xs opacity-80">قيمة العقد: {contract.value.toLocaleString()} ر.س</p>
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold">{days}</p>
                    <p className="text-xs">يوم متبقي</p>
                  </div>
                </div>
                {contract.autoRenew && (
                  <span className="inline-block mt-2 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
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
