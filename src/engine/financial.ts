import { Client, Payment, FinancialSummary } from '@/types'

// Calculate payment probability based on history
export function calculatePaymentProbability(client: Client): number {
  const reliabilityFactor = client.paymentReliability / 100
  const delayPenalty = Math.min(client.avgDelayDays * 0.02, 0.4)
  const streakPenalty = Math.min(client.latePaymentStreak * 0.1, 0.3)
  return Math.max(0, Math.min(1, reliabilityFactor - delayPenalty - streakPenalty))
}

// Expected Revenue = Σ(active_contracts × monthly_fee × payment_probability)
export function calculateExpectedRevenue(clients: Client[]): number {
  return clients
    .filter(c => c.status === 'active')
    .reduce((sum, client) => {
      const probability = calculatePaymentProbability(client)
      return sum + (client.monthlyFee * probability)
    }, 0)
}

// Client Risk Score = (delay_count × 20) + (avg_delay_days × 3) + (late_payment_streak × 25)
export function calculateRiskScore(client: Client): number {
  const score = (client.delayCount * 20) + (client.avgDelayDays * 3) + (client.latePaymentStreak * 25)
  return Math.min(100, Math.max(0, score))
}

// Break-even clients = Total Monthly Expenses / Average Contract Value
export function calculateBreakEven(totalExpenses: number, clients: Client[]): number {
  const activeClients = clients.filter(c => c.status === 'active')
  if (activeClients.length === 0) return 0
  const avgContractValue = activeClients.reduce((sum, c) => sum + c.monthlyFee, 0) / activeClients.length
  if (avgContractValue === 0) return 0
  return Math.ceil(totalExpenses / avgContractValue)
}

// Collection rate
export function calculateCollectionRate(collected: number, expected: number): number {
  if (expected === 0) return 100
  return Math.round((collected / expected) * 100)
}

// Pricing signal: if collection < 70% for 3 months -> recommend price adjustment
export function checkPricingSignal(monthlyRates: number[]): boolean {
  if (monthlyRates.length < 3) return false
  const last3 = monthlyRates.slice(-3)
  return last3.every(rate => rate < 70)
}

// Revenue forecast (simple moving average + trend)
export function forecastRevenue(historicalRevenue: number[], months: number = 3): number[] {
  if (historicalRevenue.length < 2) return Array(months).fill(historicalRevenue[0] || 0)
  const recent = historicalRevenue.slice(-6)
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length
  const trend = (recent[recent.length - 1] - recent[0]) / recent.length
  return Array.from({ length: months }, (_, i) => Math.max(0, Math.round(avg + trend * (i + 1))))
}

// Financial summary builder
export function buildFinancialSummary(
  clients: Client[],
  payments: Payment[],
  totalExpenses: number,
  historicalRevenue: number[]
): FinancialSummary {
  const activeClients = clients.filter(c => c.status === 'active')
  const totalRevenue = activeClients.reduce((sum, c) => sum + c.monthlyFee, 0)
  const expectedRevenue = calculateExpectedRevenue(clients)
  const collectedRevenue = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)
  const collectionRate = calculateCollectionRate(collectedRevenue, totalRevenue)
  const outstandingPayments = payments
    .filter(p => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0)

  return {
    totalRevenue,
    expectedRevenue,
    collectedRevenue,
    collectionRate,
    totalExpenses,
    profitMargin: totalRevenue > 0 ? Math.round(((totalRevenue - totalExpenses) / totalRevenue) * 100) : 0,
    outstandingPayments,
    breakEvenClients: calculateBreakEven(totalExpenses, clients),
    revenueForcast: forecastRevenue(historicalRevenue),
    monthlyTrend: []
  }
}
