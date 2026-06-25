import { NextRequest, NextResponse } from 'next/server'
import { getRedis } from '@/lib/redis'
import type { Briefing } from '@/app/admin/_types'

function key(id: string) {
  return `primeore_briefing:${id}`
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const data = await getRedis().get<Briefing>(key(id))
    return NextResponse.json(data ?? null)
  } catch (error) {
    console.error('[Redis Error] GET briefing:', error)
    return NextResponse.json({ error: 'Redis error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const body = (await request.json()) as Briefing
    await getRedis().set(key(id), body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Redis Error] POST briefing:', error)
    return NextResponse.json({ error: 'Redis error' }, { status: 500 })
  }
}
