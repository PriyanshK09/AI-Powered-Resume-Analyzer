import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { forgotSchema } from '@/lib/validation'
import { findUserByEmail, createResetToken } from '@/lib/auth'
import { rateLimit } from '@/lib/auth'

// NOTE: In production you would email the token. Here we just return it for demonstration.
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon'
  if (!rateLimit(ip + ':forgot', 5, 60_000)) {
    return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 })
  }
  try {
    const body = await req.json()
    const parsed = forgotSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, message: 'Invalid email' }, { status: 400 })
    const user = await findUserByEmail(parsed.data.email)
    if (!user) return NextResponse.json({ success: true, message: 'If the email exists a reset link was sent.' })
    const token = await createResetToken(user.id)
    return NextResponse.json({ success: true, message: 'Reset token issued', data: { token } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
