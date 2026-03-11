import { NextRequest, NextResponse } from 'next/server'
import { clientStore, receiptStore } from '@/lib/store'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const clientId = searchParams.get('clientId')

  if (clientId) {
    return NextResponse.json(receiptStore.getByClient(clientId))
  }
  return NextResponse.json(receiptStore.getAll())
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.clientId || !body.amount) {
      return NextResponse.json({ error: 'معرف العميل والمبلغ مطلوبان' }, { status: 400 })
    }

    const client = clientStore.getById(body.clientId)
    if (!client) {
      return NextResponse.json({ error: 'العميل غير موجود' }, { status: 404 })
    }

    const items = body.items || [{
      description: `رسوم خدمة شهرية - ${client.company}`,
      quantity: 1,
      unitPrice: body.amount,
      total: body.amount,
    }]

    const tax = body.tax !== undefined ? body.tax : Math.round(body.amount * 0.15)
    const totalWithTax = body.amount + tax

    const receipt = receiptStore.create({
      clientId: client.id,
      clientName: client.name,
      company: client.company,
      amount: body.amount,
      paymentMethod: body.paymentMethod || 'bank_transfer',
      paymentDate: body.paymentDate || new Date().toISOString().split('T')[0],
      description: body.description || `سداد رسوم خدمة - ${client.company}`,
      items,
      tax,
      totalWithTax,
      notes: body.notes || '',
      createdBy: 'النظام',
    })

    return NextResponse.json(receipt, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'خطأ في إنشاء الإيصال' }, { status: 400 })
  }
}
