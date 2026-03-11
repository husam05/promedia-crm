'use client'

import { FinancialSummary } from '@/types'
import StatCard from '@/components/ui/stat-card'

interface Props {
  financial: FinancialSummary
}

export default function FinancialOverview({ financial }: Props) {
  const formatCurrency = (amount: number) => `${amount.toLocaleString()} ر.س`

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4">النظرة المالية</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="إجمالي الإيرادات"
          value={formatCurrency(financial.totalRevenue)}
          subtitle="الشهر الحالي"
          trend="up"
          trendValue="+7% عن الشهر السابق"
          color="emerald"
          icon="💰"
        />
        <StatCard
          title="الإيرادات المتوقعة"
          value={formatCurrency(financial.expectedRevenue)}
          subtitle="بناءً على احتمالية الدفع"
          color="blue"
          icon="📈"
        />
        <StatCard
          title="المبالغ المحصلة"
          value={formatCurrency(financial.collectedRevenue)}
          subtitle={`معدل التحصيل: ${financial.collectionRate}%`}
          trend={financial.collectionRate >= 70 ? 'up' : 'down'}
          trendValue={`${financial.collectionRate}%`}
          color={financial.collectionRate >= 70 ? 'emerald' : 'amber'}
          icon="✅"
        />
        <StatCard
          title="المبالغ المعلقة"
          value={formatCurrency(financial.outstandingPayments)}
          subtitle={`نقطة التعادل: ${financial.breakEvenClients} عميل`}
          trend="down"
          trendValue="يجب المتابعة"
          color="red"
          icon="⏳"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-medium text-gray-400 mb-3">هامش الربح</h3>
          <div className="flex items-end gap-4">
            <span className="text-4xl font-bold text-white">{financial.profitMargin}%</span>
            <div className="flex-1">
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    financial.profitMargin >= 30 ? 'bg-emerald-500' :
                    financial.profitMargin >= 15 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(100, financial.profitMargin)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-medium text-gray-400 mb-3">توقعات الإيرادات (3 أشهر)</h3>
          <div className="flex items-end gap-2 h-20">
            {financial.revenueForcast.map((val, i) => {
              const maxVal = Math.max(...financial.revenueForcast)
              const height = maxVal > 0 ? (val / maxVal) * 100 : 0
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400">{formatCurrency(val)}</span>
                  <div className="w-full bg-gray-800 rounded-t-lg overflow-hidden" style={{ height: '60px' }}>
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all"
                      style={{ height: `${height}%`, marginTop: `${100 - height}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">شهر {i + 1}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
