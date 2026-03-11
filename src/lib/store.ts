import { Client, Receipt } from '@/types'
import { mockClients } from './mock-data'

// Mutable store - starts with mock data, supports CRUD
let clients: Client[] = [...mockClients]
let receipts: Receipt[] = []
let nextClientId = 13
let nextReceiptId = 1

export const clientStore = {
  getAll: () => [...clients],

  getById: (id: string) => clients.find(c => c.id === id) || null,

  create: (data: Omit<Client, 'id' | 'createdAt' | 'clientScore' | 'riskScore' | 'loyaltyScore' | 'lifetimeValue' | 'delayCount' | 'avgDelayDays' | 'latePaymentStreak' | 'lastPaymentDate'>) => {
    const newClient: Client = {
      ...data,
      id: String(nextClientId++),
      clientScore: Math.round((data.paymentReliability * 0.4) + ((data.contractValue / 144000) * 100 * 0.3) + (data.communicationStability * 0.15) + (data.projectProfitability * 0.15)),
      riskScore: 0,
      loyaltyScore: 50,
      lifetimeValue: data.monthlyFee * 12,
      delayCount: 0,
      avgDelayDays: 0,
      latePaymentStreak: 0,
      lastPaymentDate: null,
      createdAt: new Date().toISOString().split('T')[0],
    }
    clients.push(newClient)
    return newClient
  },

  update: (id: string, data: Partial<Client>) => {
    const index = clients.findIndex(c => c.id === id)
    if (index === -1) return null
    clients[index] = { ...clients[index], ...data, id }
    return clients[index]
  },

  delete: (id: string) => {
    const index = clients.findIndex(c => c.id === id)
    if (index === -1) return false
    clients.splice(index, 1)
    return true
  },

  search: (query: string, category?: string) => {
    return clients.filter(c => {
      const matchesQuery = !query || c.name.includes(query) || c.company.includes(query) || c.email.includes(query) || c.phone.includes(query)
      const matchesCategory = !category || category === 'all' || c.category === category
      return matchesQuery && matchesCategory
    })
  }
}

export const receiptStore = {
  getAll: () => [...receipts],

  getByClient: (clientId: string) => receipts.filter(r => r.clientId === clientId),

  create: (data: Omit<Receipt, 'id' | 'receiptNumber' | 'createdAt'>) => {
    const receipt: Receipt = {
      ...data,
      id: `rec-${nextReceiptId}`,
      receiptNumber: `REC-${String(nextReceiptId++).padStart(5, '0')}`,
      createdAt: new Date().toISOString(),
    }
    receipts.push(receipt)
    return receipt
  },

  getById: (id: string) => receipts.find(r => r.id === id) || null,
}
