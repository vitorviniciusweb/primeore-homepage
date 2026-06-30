import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getRedis } from '@/lib/redis'
import type { Activity } from '@/app/admin/_types'

async function requireAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('primeore_session')?.value === 'authenticated'
}

// GET /api/activities/summary?ids=id1,id2,...
// Returns Record<contactId, { scheduledFor, overdue } | null>
export async function GET(req: NextRequest) {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ids = req.nextUrl.searchParams.get('ids')
  if (!ids) return NextResponse.json({})

  const contactIds = ids.split(',').filter(Boolean)
  if (contactIds.length === 0) return NextResponse.json({})

  const now = new Date()
  const redis = getRedis()

  const entries = await Promise.all(
    contactIds.map(async (id) => {
      try {
        const activities = await redis.get<Activity[]>(`primeore_activities:${id}`)
        const list = Array.isArray(activities) ? activities : []
        const pending = list.filter(a => !a.completed)
        if (pending.length === 0) return [id, null] as const
        const next = pending.reduce((a, b) => a.scheduledFor < b.scheduledFor ? a : b)
        return [id, {
          scheduledFor: next.scheduledFor,
          overdue: new Date(next.scheduledFor) < now,
        }] as const
      } catch {
        return [id, null] as const
      }
    }),
  )

  return NextResponse.json(Object.fromEntries(entries))
}
