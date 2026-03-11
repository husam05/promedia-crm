'use client'

import dynamic from 'next/dynamic'

interface Props {
  data: { month: string; revenue: number; expenses: number }[]
}

const RevenueChartInner = dynamic(() => import('./revenue-chart-inner'), { ssr: false, loading: () => (
  <div className="glass-card p-5 animate-fade-in-up stagger-3">
    <div className="h-5 w-40 bg-white/[0.03] rounded-lg mb-4 animate-shimmer" />
    <div className="h-72 bg-white/[0.02] rounded-xl animate-shimmer" />
  </div>
) })

export default function RevenueChart({ data }: Props) {
  return <RevenueChartInner data={data} />
}
