import { NextRequest, NextResponse } from 'next/server'
import { clientStore } from '@/lib/store'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'all'
  const status = searchParams.get('status') || ''

  let clients = clientStore.search(query, category)

  if (status) {
    clients = clients.filter(c => c.status === status)
  }

  return NextResponse.json(clients)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const required = ['name', 'email', 'phone', 'company', 'category', 'monthlyFee', 'contractValue', 'contractStart', 'contractEnd']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `الحقل مطلوب: ${field}` }, { status: 400 })
      }
    }

    const newClient = clientStore.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      category: body.category || 'B',
      status: body.status || 'active',
      contractValue: Number(body.contractValue),
      monthlyFee: Number(body.monthlyFee),
      contractStart: body.contractStart,
      contractEnd: body.contractEnd,
      paymentReliability: body.paymentReliability || 70,
      communicationStability: body.communicationStability || 70,
      projectProfitability: body.projectProfitability || 60,
      notes: body.notes || '',
    })

    return NextResponse.json(newClient, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'خطأ في البيانات المرسلة' }, { status: 400 })
  }
}
