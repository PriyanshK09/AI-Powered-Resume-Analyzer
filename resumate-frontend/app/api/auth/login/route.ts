import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { loginSchema } from '@/lib/validation'
import { findUserByEmail, verifyPassword } from '@/lib/auth'
import { issueSession } from '@/lib/session'
import { rateLimit } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon'
  if (!rateLimit(ip + ':login', 8, 60_000)) {
    return NextResponse.json({ success: false, message: 'Too many attempts. Try again later.' }, { status: 429 })
  }
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Auth login error: MONGODB_URI env var not set')
      return NextResponse.json({ success: false, message: 'Server misconfigured' }, { status: 500 })
    }
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 400 })
    }
    const user = await findUserByEmail(parsed.data.email)
    if (!user) return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
    const ok = await verifyPassword(user.passwordHash, parsed.data.password)
    if (!ok) return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
  await issueSession({ id: user.id, tokenVersion: user.tokenVersion })
  // Standardized response shape: return user object under `user` key (previously `data`)
  return NextResponse.json({ success: true, message: 'Logged in', user: { id: user.id, email: user.email, name: user.name } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
