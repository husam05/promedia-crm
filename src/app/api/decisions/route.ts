import { NextResponse } from 'next/server'
import { mockClients, mockPayments, mockDecisionRules, monthlyExpenses } from '@/lib/mock-data'
import { evaluateDecisions } from '@/engine/decisions'
import { calculateCollectionRate } from '@/engine/financial'

export async function GET() {
  const paidAmount = mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const totalDue = mockPayments.reduce((s, p) => s + p.amount, 0)
  const collectionRate = calculateCollectionRate(paidAmount, totalDue)
  const monthlyRevenue = mockClients.filter(c => c.status === 'active').reduce((s, c) => s + c.monthlyFee, 0)

  const decisions = evaluateDecisions({
    clients: mockClients,
    collectionRate,
    monthlyExpenses,
    monthlyRevenue,
    currentDay: new Date().getDate(),
  })

  return NextResponse.json({
    decisions,
    rules: mockDecisionRules,
    collectionRate,
    monthlyRevenue,
    monthlyExpenses,
  })
}
