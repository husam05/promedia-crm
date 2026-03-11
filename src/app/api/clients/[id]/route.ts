import { NextRequest, NextResponse } from 'next/server'
import { clientStore } from '@/lib/store'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const client = clientStore.getById(id)
  if (!client) {
    return NextResponse.json({ error: 'العميل غير موجود' }, { status: 404 })
  }
  return NextResponse.json(client)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const updated = clientStore.update(id, body)
    if (!updated) {
      return NextResponse.json({ error: 'العميل غير موجود' }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'خطأ في البيانات' }, { status: 400 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deleted = clientStore.delete(id)
  if (!deleted) {
    return NextResponse.json({ error: 'العميل غير موجود' }, { status: 404 })
  }
  return NextResponse.json({ success: true, message: 'تم حذف العميل بنجاح' })
}
