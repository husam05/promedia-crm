import { NextResponse } from 'next/server'
import { mockClients, mockPayments, mockContracts, mockAlerts, historicalRevenue, monthlyExpenses, mockServices, teamData } from '@/lib/mock-data'
import { buildFinancialSummary, calculateCollectionRate } from '@/engine/financial'
import { evaluateDecisions } from '@/engine/decisions'
import { calculateMaxCapacity, calculateWorkload, calculateHealthScore, generateRecommendations } from '@/engine/growth'
import { DashboardData } from '@/types'

export async function GET() {
  const activeClients = mockClients.filter(c => c.status === 'active')

  // Financial summary
  const financial = buildFinancialSummary(
    mockClients,
    mockPayments,
    monthlyExpenses,
    historicalRevenue.map(h => h.revenue)
  )
  financial.monthlyTrend = historicalRevenue.map(h => ({
    month: h.month,
    revenue: h.revenue,
    expenses: monthlyExpenses
  }))

  // Collection rate
  const paidAmount = mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalDue = mockPayments.reduce((s, p) => s + p.amount, 0)
  const collectionRate = calculateCollectionRate(paidAmount, totalDue)

  // Health score
  const clientSatisfaction = Math.round(activeClients.reduce((s, c) => s + c.communicationStability, 0) / activeClients.length)
  const healthScore = calculateHealthScore(collectionRate, clientSatisfaction, financial.profitMargin)

  // Capacity
  const maxCapacity = calculateMaxCapacity(teamData.workHoursPerWeek, teamData.avgClientServiceHours)
  const workload = calculateWorkload(activeClients.length, maxCapacity)

  // Risk clients
  const riskClients = mockClients.filter(c => c.riskScore > 60)

  // Client distribution
  const clientDistribution = [
    { category: 'A' as const, count: mockClients.filter(c => c.category === 'A').length },
    { category: 'B' as const, count: mockClients.filter(c => c.category === 'B').length },
    { category: 'C' as const, count: mockClients.filter(c => c.category === 'C').length },
  ]

  // Expiring contracts
  const expiringContracts = mockContracts.filter(c => c.status === 'expiring')

  const dashboard: DashboardData = {
    financial,
    health: {
      score: healthScore,
      collectionRate,
      clientSatisfaction,
      profitMargin: financial.profitMargin,
      activeClients: activeClients.length,
      riskClients: riskClients.length,
      totalRevenue: financial.totalRevenue,
      totalExpenses: monthlyExpenses,
    },
    alerts: mockAlerts,
    clientDistribution,
    recentPayments: mockPayments.slice(0, 12),
    expiringContracts,
    topClients: mockClients.filter(c => c.category === 'A').sort((a, b) => b.clientScore - a.clientScore),
    riskClients,
  }

  return NextResponse.json(dashboard)
}
