'use client'

import { Client, ClientCategory } from '@/types'
import ProgressRing from '@/components/ui/progress-ring'
import { Crown, AlertTriangle } from 'lucide-react'

interface Props {
  distribution: { category: ClientCategory; count: number }[]
  topClients: Client[]
  riskClients: Client[]
  healthScore: number
}

const categoryLabels: Record<ClientCategory, { label: string; color: string; bgColor: string }> = {
  A: { label: 'مميز', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  B: { label: 'عادي', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  C: { label: 'عالي الصيانة', color: 'text-red-400', bgColor: 'bg-red-500/10' },
}

export default function ClientHealthMap({ distribution, topClients, riskClients, healthScore }: Props) {
  const totalClients = distribution.reduce((s, d) => s + d.count, 0) || 1

  return (
    <div className="space-y-4 animate-fade-in-up stagger-4">
      {/* Health Score */}
      <div className="glass-card p-5">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-400" />
          صحة الشركة
        </h2>
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
                  <p className="text-[11px] text-gray-500">{count} عميل ({Math.round((count / totalClients) * 100)}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Clients */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
          <Crown size={14} className="text-amber-400" />
          أفضل العملاء
        </h3>
        <div className="space-y-1.5">
          {topClients.slice(0, 4).map((client, i) => (
            <div key={client.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.03] transition-all duration-200 group">
              <div className="flex items-center gap-2.5">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                  i === 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {client.category}
                </span>
                <div>
                  <p className="text-sm text-white group-hover:text-cyan-300 transition-colors">{client.name}</p>
                  <p className="text-[10px] text-gray-600">{client.monthlyFee.toLocaleString()} د.ع/شهر</p>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-400">{client.clientScore}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Clients */}
      {riskClients.length > 0 && (
        <div className="glass-card p-5" style={{ borderColor: 'rgba(239, 68, 68, 0.1)' }}>
          <h3 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
            <AlertTriangle size={14} />
            عملاء عالي المخاطر ({riskClients.length})
          </h3>
          <div className="space-y-1.5">
            {riskClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-2.5 rounded-xl bg-red-500/[0.03] hover:bg-red-500/[0.06] transition-colors">
                <div>
                  <p className="text-sm text-white">{client.name}</p>
                  <p className="text-[10px] text-red-400/70">درجة المخاطر: {client.riskScore}</p>
                </div>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded-lg font-medium">
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
