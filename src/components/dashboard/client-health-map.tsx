'use client'

import { Client, ClientCategory } from '@/types'
import ProgressRing from '@/components/ui/progress-ring'

interface Props {
  distribution: { category: ClientCategory; count: number }[]
  topClients: Client[]
  riskClients: Client[]
  healthScore: number
}

const categoryLabels: Record<ClientCategory, { label: string; color: string; bgColor: string }> = {
  A: { label: 'مميز', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  B: { label: 'عادي', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  C: { label: 'عالي الصيانة', color: 'text-red-400', bgColor: 'bg-red-500/20' },
}

export default function ClientHealthMap({ distribution, topClients, riskClients, healthScore }: Props) {
  const totalClients = distribution.reduce((s, d) => s + d.count, 0)

  return (
    <div className="space-y-4">
      {/* Health Score */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h2 className="text-lg font-bold text-white mb-4">صحة الشركة</h2>
        <div className="flex items-center justify-around">
          <ProgressRing value={healthScore} size={140} label="النتيجة" />
          <div className="space-y-3">
            {distribution.map(({ category, count }) => (
              <div key={category} className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg ${categoryLabels[category].bgColor} flex items-center justify-center text-sm font-bold ${categoryLabels[category].color}`}>
                  {category}
                </span>
                <div>
                  <p className={`text-sm font-medium ${categoryLabels[category].color}`}>
                    {categoryLabels[category].label}
                  </p>
                  <p className="text-xs text-gray-400">{count} عميل ({Math.round((count / totalClients) * 100)}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Clients */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-sm font-medium text-gray-400 mb-3">أفضل العملاء</h3>
        <div className="space-y-2">
          {topClients.slice(0, 4).map((client) => (
            <div key={client.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400">
                  {client.category}
                </span>
                <div>
                  <p className="text-sm text-white">{client.name}</p>
                  <p className="text-xs text-gray-400">{client.monthlyFee.toLocaleString()} ر.س/شهر</p>
                </div>
              </div>
              <span className="text-sm font-medium text-emerald-400">{client.clientScore}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Clients */}
      {riskClients.length > 0 && (
        <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-5">
          <h3 className="text-sm font-medium text-red-400 mb-3">عملاء عالي المخاطر ({riskClients.length})</h3>
          <div className="space-y-2">
            {riskClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-2 rounded-lg bg-red-500/5">
                <div>
                  <p className="text-sm text-white">{client.name}</p>
                  <p className="text-xs text-red-400">درجة المخاطر: {client.riskScore}</p>
                </div>
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                  {client.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
