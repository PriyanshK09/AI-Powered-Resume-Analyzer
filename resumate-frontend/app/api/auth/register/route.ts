import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { registerSchema } from '@/lib/validation'
import { createUser, findUserByEmail } from '@/lib/auth'
import { issueSession } from '@/lib/session'
import { rateLimit } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon'
  if (!rateLimit(ip + ':register')) {
    return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 })
  }
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Auth register error: MONGODB_URI env var not set')
      return NextResponse.json({ success: false, message: 'Server misconfigured' }, { status: 500 })
    }
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 })
    }
    const existing = await findUserByEmail(parsed.data.email)
    if (existing) return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 409 })
    const user = await createUser(parsed.data.email, parsed.data.password, parsed.data.name)
  await issueSession({ id: user.id, tokenVersion: user.tokenVersion })
  // Standardized response shape: user object under `user` key
  return NextResponse.json({ success: true, message: 'Registered', user: { id: user.id, email: user.email, name: user.name } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
