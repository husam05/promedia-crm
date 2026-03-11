import { NextResponse } from 'next/server'
import { mockClients, mockPayments, historicalRevenue, monthlyExpenses, mockServices } from '@/lib/mock-data'
import { buildFinancialSummary, forecastRevenue, checkPricingSignal, calculateCollectionRate } from '@/engine/financial'
import { calculateServiceProfit } from '@/engine/growth'

export async function GET() {
  const financial = buildFinancialSummary(
    mockClients,
    mockPayments,
    monthlyExpenses,
    historicalRevenue.map(h => h.revenue)
  )

  const serviceProfits = calculateServiceProfit(mockServices)
  const forecast = forecastRevenue(historicalRevenue.map(h => h.revenue), 6)
  const monthlyCollectionRates = [72, 68, 75, 70, 65, 78]
  const pricingSignal = checkPricingSignal(monthlyCollectionRates)

  return NextResponse.json({
    ...financial,
    serviceProfits,
    forecast,
    pricingSignal,
    historicalRevenue,
    monthlyExpenses,
  })
}
