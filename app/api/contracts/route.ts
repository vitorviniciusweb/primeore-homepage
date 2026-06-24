import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getRedis } from '@/lib/redis'
import type { Contrato } from '@/app/admin/contratos/_types'

const REDIS_KEY = 'primeore_contracts'

async function requireAuth(): Promise<boolean> {
  const store = await cookies()
  return store.get('primeore_session')?.value === 'authenticated'
}

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await getRedis().get<Contrato[]>(REDIS_KEY)
    return NextResponse.json(Array.isArray(data) ? data : [])
  } catch (error) {
    console.error('[Redis Error] GET primeore_contracts:', error)
    return NextResponse.json({ error: 'Redis error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const contracts = (await request.json()) as Contrato[]
    await getRedis().set(REDIS_KEY, contracts)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Redis Error] POST primeore_contracts:', error)
    return NextResponse.json({ error: 'Redis error' }, { status: 500 })
  }
}
