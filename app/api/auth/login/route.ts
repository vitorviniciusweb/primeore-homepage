import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, message: 'Senha incorreta' },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('primeore_session', 'authenticated', {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'strict',
  })
  return response
}
