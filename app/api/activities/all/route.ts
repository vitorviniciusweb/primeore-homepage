import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getRedis } from '@/lib/redis'
import type { Activity, Contact, ActivityWithContact } from '@/app/admin/_types'

async function requireAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('primeore_session')?.value === 'authenticated'
}

async function scanActivityKeys(): Promise<string[]> {
  const redis = getRedis()
  const keys: string[] = []
  let cursor = '0'
  do {
    const result: [string, string[]] = await redis.scan(cursor, { match: 'primeore_activities:*', count: 100 })
    keys.push(...result[1])
    cursor = result[0]
  } while (cursor !== '0')
  return keys
}

// GET /api/activities/all
// Returns every Activity across every contact, enriched with contactName.
export async function GET() {
  if (!(await requireAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const redis = getRedis()

    const [contacts, keys] = await Promise.all([
      redis.get<Contact[]>('primeore_contacts').then(c => (Array.isArray(c) ? c : [])),
      scanActivityKeys(),
    ])
    const nameById = new Map(contacts.map(c => [c.id, c.name]))

    const lists = await Promise.all(
      keys.map(key => redis.get<Activity[]>(key).then(list => (Array.isArray(list) ? list : []))),
    )

    const allActivities: ActivityWithContact[] = lists.flat().map(a => ({
      ...a,
      contactName: nameById.get(a.contactId) ?? 'Contato removido',
    }))

    return NextResponse.json(allActivities)
  } catch (e) {
    console.error('[Activities ALL GET]', e)
    return NextResponse.json({ error: 'Redis error' }, { status: 500 })
  }
}
