import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { resetSchema } from '@/lib/validation'
import { useResetToken } from '@/lib/auth'
import { rateLimit } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon'
  if (!rateLimit(ip + ':reset', 5, 60_000)) {
    return NextResponse.json({ success: false, message: 'Too many requests' }, { status: 429 })
  }
  try {
    const body = await req.json()
    const parsed = resetSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 })
    const ok = await useResetToken(parsed.data.email, parsed.data.token, parsed.data.newPassword)
    if (!ok) return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 400 })
    return NextResponse.json({ success: true, message: 'Password updated' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
