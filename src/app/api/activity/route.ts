import { NextResponse } from 'next/server'
import { getActivities } from '@/lib/activity-store'

export async function GET() {
  const activities = getActivities()
  return NextResponse.json(activities)
}
