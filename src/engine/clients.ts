import { Client, ClientCategory } from '@/types'

// Client Score = (payment_reliability × 40) + (contract_value_normalized × 30) + (communication_stability × 15) + (project_profitability × 15)
export function calculateClientScore(client: Client, maxContractValue: number): number {
  const normalizedContractValue = maxContractValue > 0 ? (client.contractValue / maxContractValue) * 100 : 50
  const score =
    (client.paymentReliability * 0.40) +
    (normalizedContractValue * 0.30) +
    (client.communicationStability * 0.15) +
    (client.projectProfitability * 0.15)
  return Math.round(Math.min(100, Math.max(0, score)))
}

// Classify client: 80-100 -> A, 60-79 -> B, <60 -> C
export function classifyClient(score: number): ClientCategory {
  if (score >= 80) return 'A'
  if (score >= 60) return 'B'
  return 'C'
}

// Loyalty score based on contract duration and payment history
export function calculateLoyaltyScore(client: Client): number {
  const contractMonths = Math.max(1, Math.ceil(
    (new Date(client.contractEnd).getTime() - new Date(client.contractStart).getTime()) / (1000 * 60 * 60 * 24 * 30)
  ))
  const durationScore = Math.min(40, contractMonths * 2)
  const paymentScore = client.paymentReliability * 0.4
  const consistencyScore = Math.max(0, 20 - client.latePaymentStreak * 5)
  return Math.round(Math.min(100, durationScore + paymentScore + consistencyScore))
}

// Lifetime value calculation
export function calculateLifetimeValue(client: Client): number {
  const monthlyValue = client.monthlyFee
  const contractMonths = Math.max(1, Math.ceil(
    (new Date(client.contractEnd).getTime() - new Date(client.contractStart).getTime()) / (1000 * 60 * 60 * 24 * 30)
  ))
  const probability = client.paymentReliability / 100
  return Math.round(monthlyValue * contractMonths * probability)
}

// Detect unprofitable clients (pay but lose money)
export function detectUnprofitableClients(clients: Client[], serviceCostPerClient: number): Client[] {
  return clients.filter(client => {
    const effectiveRevenue = client.monthlyFee * (client.paymentReliability / 100)
    return effectiveRevenue < serviceCostPerClient && client.status === 'active'
  })
}

// Full client analysis
export function analyzeClient(client: Client, maxContractValue: number): {
  score: number
  category: ClientCategory
  loyaltyScore: number
  lifetimeValue: number
  isProfitable: boolean
} {
  const score = calculateClientScore(client, maxContractValue)
  return {
    score,
    category: classifyClient(score),
    loyaltyScore: calculateLoyaltyScore(client),
    lifetimeValue: calculateLifetimeValue(client),
    isProfitable: client.projectProfitability > 30
  }
}
