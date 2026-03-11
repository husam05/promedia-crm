import { Client } from '@/types'

// Max Clients = team_work_hours / avg_client_service_hours
export function calculateMaxCapacity(teamWorkHours: number, avgClientServiceHours: number): number {
  if (avgClientServiceHours <= 0) return 0
  return Math.floor(teamWorkHours / avgClientServiceHours)
}

// Workload percentage
export function calculateWorkload(currentClients: number, maxCapacity: number): number {
  if (maxCapacity <= 0) return 100
  return Math.round((currentClients / maxCapacity) * 100)
}

// Hiring trigger: workload > 85%
export function shouldHire(workloadPercentage: number): boolean {
  return workloadPercentage > 85
}

// Service Profit = service_revenue - service_cost
export function calculateServiceProfit(services: { name: string; revenue: number; cost: number }[]): { name: string; profit: number; margin: number }[] {
  return services
    .map(s => ({
      name: s.name,
      profit: s.revenue - s.cost,
      margin: s.revenue > 0 ? Math.round(((s.revenue - s.cost) / s.revenue) * 100) : 0
    }))
    .sort((a, b) => b.profit - a.profit)
}

// Detect seasonal dips
export function detectSeasonalDips(monthlyRevenue: { month: string; revenue: number }[]): string[] {
  if (monthlyRevenue.length < 3) return []
  const avg = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / monthlyRevenue.length
  return monthlyRevenue
    .filter(m => m.revenue < avg * 0.7)
    .map(m => m.month)
}

// Company Health Score = (collection_rate × 0.4) + (client_satisfaction × 0.3) + (profit_margin × 0.3)
export function calculateHealthScore(collectionRate: number, clientSatisfaction: number, profitMargin: number): number {
  const normalizedMargin = Math.min(100, Math.max(0, profitMargin))
  return Math.round(
    (collectionRate * 0.4) +
    (clientSatisfaction * 0.3) +
    (normalizedMargin * 0.3)
  )
}

// Strategic recommendations
export function generateRecommendations(metrics: {
  workloadPercentage: number
  collectionRate: number
  profitMargin: number
  riskClientCount: number
  totalClients: number
}): string[] {
  const recs: string[] = []

  if (metrics.workloadPercentage > 85) {
    recs.push('يُنصح بتوظيف موظفين جدد - الطاقة الاستيعابية تتجاوز 85%')
  }
  if (metrics.collectionRate < 70) {
    recs.push('تحسين نظام التحصيل - معدل التحصيل أقل من 70%')
  }
  if (metrics.profitMargin < 20) {
    recs.push('مراجعة هيكل التسعير - هامش الربح منخفض')
  }
  if (metrics.riskClientCount > metrics.totalClients * 0.3) {
    recs.push('أكثر من 30% من العملاء عالي المخاطر - يجب تنويع قاعدة العملاء')
  }
  if (metrics.workloadPercentage < 50) {
    recs.push('طاقة استيعابية متاحة - يمكن قبول عملاء جدد')
  }
  if (recs.length === 0) {
    recs.push('الأداء العام جيد - استمر في المراقبة')
  }

  return recs
}
