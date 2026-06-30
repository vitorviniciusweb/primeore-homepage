import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getRedis } from '@/lib/redis'
import type { Activity } from '@/app/admin/_types'

async function requireAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('primeore_session')?.value === 'authenticated'
}

function redisKey(contactId: string) {
  return `primeore_activities:${contactId}`
}

async function getActivities(contactId: string): Promise<Activity[]> {
  const data = await getRedis().get<Activity[]>(redisKey(contactId))
  return Array.isArray(data) ? data : []
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ contactId: string }> },
) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { contactId } = await params
    return NextResponse.json(await getActivities(contactId))
  } catch (e) {
    console.error('[Activities GET]', e)
    return NextResponse.json({ error: 'Redis error' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ contactId: string }> },
) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { contactId } = await params
    const activity = (await req.json()) as Activity
    const existing = await getActivities(contactId)
    await getRedis().set(redisKey(contactId), [...existing, activity])
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[Activities POST]', e)
    return NextResponse.json({ error: 'Redis error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ contactId: string }> },
) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { contactId } = await params
    const { id, completed } = (await req.json()) as { id: string; completed: boolean }
    const existing = await getActivities(contactId)
    const updated = existing.map(a =>
      a.id === id
        ? { ...a, completed, completedAt: completed ? new Date().toISOString() : undefined }
        : a,
    )
    await getRedis().set(redisKey(contactId), updated)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[Activities PATCH]', e)
    return NextResponse.json({ error: 'Redis error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ contactId: string }> },
) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { contactId } = await params
    const { id } = (await req.json()) as { id: string }
    const existing = await getActivities(contactId)
    await getRedis().set(redisKey(contactId), existing.filter(a => a.id !== id))
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[Activities DELETE]', e)
    return NextResponse.json({ error: 'Redis error' }, { status: 500 })
  }
}
