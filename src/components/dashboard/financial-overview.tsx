'use client'

import { FinancialSummary } from '@/types'
import StatCard from '@/components/ui/stat-card'

interface Props {
  financial: FinancialSummary
}

export default function FinancialOverview({ financial }: Props) {
  const formatCurrency = (amount: number) => `${amount.toLocaleString()} د.ع`

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-purple-400" />
        النظرة المالية
      </h2>
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
        {/* Profit Margin */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-gray-400 mb-3">هامش الربح</h3>
          <div className="flex items-end gap-4">
            <span className="text-4xl font-bold text-white animate-count-up">{financial.profitMargin}%</span>
            <div className="flex-1">
              <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    financial.profitMargin >= 30 ? 'bg-gradient-to-l from-emerald-400 to-emerald-600' :
                    financial.profitMargin >= 15 ? 'bg-gradient-to-l from-amber-400 to-amber-600' : 'bg-gradient-to-l from-red-400 to-red-600'
                  }`}
                  style={{ width: `${Math.min(100, financial.profitMargin)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[10px] text-gray-600">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Forecast */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-medium text-gray-400 mb-3">توقعات الإيرادات (3 أشهر)</h3>
          <div className="flex items-end gap-3 h-20">
            {financial.revenueForcast.map((val, i) => {
              const maxVal = Math.max(...financial.revenueForcast)
              const height = maxVal > 0 ? (val / maxVal) * 100 : 0
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[11px] text-gray-400 font-medium">{formatCurrency(val)}</span>
                  <div className="w-full bg-white/5 rounded-t-xl overflow-hidden" style={{ height: '60px' }}>
                    <div
                      className="w-full rounded-t-xl transition-all duration-1000"
                      style={{
                        height: `${height}%`,
                        marginTop: `${100 - height}%`,
                        background: `linear-gradient(180deg, rgba(16, 185, 129, 0.6), rgba(6, 182, 212, 0.3))`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-600">شهر {i + 1}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
