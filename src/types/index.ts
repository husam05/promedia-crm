// Client types
export type ClientCategory = 'A' | 'B' | 'C'
export type ClientStatus = 'active' | 'inactive' | 'suspended'
export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial'
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'
export type AlertType = 'payment' | 'contract' | 'financial' | 'capacity' | 'emergency'

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  company: string
  category: ClientCategory
  status: ClientStatus
  contractValue: number
  monthlyFee: number
  contractStart: string
  contractEnd: string
  paymentReliability: number // 0-100
  communicationStability: number // 0-100
  projectProfitability: number // 0-100
  clientScore: number // 0-100
  riskScore: number // 0-100
  loyaltyScore: number // 0-100
  lifetimeValue: number
  delayCount: number
  avgDelayDays: number
  latePaymentStreak: number
  lastPaymentDate: string | null
  notes: string
  createdAt: string
}

export interface Payment {
  id: string
  clientId: string
  amount: number
  dueDate: string
  paidDate: string | null
  status: PaymentStatus
  delayDays: number
}

export interface Contract {
  id: string
  clientId: string
  serviceName: string
  value: number
  monthlyFee: number
  startDate: string
  endDate: string
  autoRenew: boolean
  status: 'active' | 'expiring' | 'expired' | 'cancelled'
}

export interface FinancialSummary {
  totalRevenue: number
  expectedRevenue: number
  collectedRevenue: number
  collectionRate: number
  totalExpenses: number
  profitMargin: number
  outstandingPayments: number
  breakEvenClients: number
  revenueForcast: number[]
  monthlyTrend: { month: string; revenue: number; expenses: number }[]
}

export interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  clientId?: string
  isRead: boolean
  createdAt: string
  action?: string
}

export interface CompanyHealth {
  score: number
  collectionRate: number
  clientSatisfaction: number
  profitMargin: number
  activeClients: number
  riskClients: number
  totalRevenue: number
  totalExpenses: number
}

export interface DashboardData {
  financial: FinancialSummary
  health: CompanyHealth
  alerts: Alert[]
  clientDistribution: { category: ClientCategory; count: number }[]
  recentPayments: Payment[]
  expiringContracts: Contract[]
  topClients: Client[]
  riskClients: Client[]
}

export interface DecisionRule {
  id: string
  name: string
  condition: string
  action: string
  isActive: boolean
  lastTriggered?: string
  triggerCount: number
}

export interface GrowthMetrics {
  maxClientCapacity: number
  currentWorkload: number
  workloadPercentage: number
  hiringRecommendation: boolean
  mostProfitableService: string
  seasonalTrends: { month: string; revenue: number }[]
  strategicRecommendations: string[]
}

export interface WeeklyReport {
  id: string
  generatedAt: string
  period: string
  revenue: number
  expenses: number
  profit: number
  collectionRate: number
  newClients: number
  lostClients: number
  riskClients: number
  healthScore: number
  highlights: string[]
  recommendations: string[]
}

// Receipt & Invoice types
export interface Receipt {
  id: string
  receiptNumber: string
  clientId: string
  clientName: string
  company: string
  amount: number
  paymentMethod: 'cash' | 'bank_transfer' | 'credit_card' | 'check'
  paymentDate: string
  description: string
  items: ReceiptItem[]
  tax: number
  totalWithTax: number
  notes: string
  createdAt: string
  createdBy: string
}

export interface ReceiptItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface ClientFormData {
  name: string
  email: string
  phone: string
  company: string
  category: ClientCategory
  status: ClientStatus
  monthlyFee: number
  contractValue: number
  contractStart: string
  contractEnd: string
  notes: string
}

export type StatusType = 'idle' | 'loading' | 'success' | 'error' | 'warning'

export interface StatusMessage {
  type: StatusType
  text: string
  timestamp: number
}
