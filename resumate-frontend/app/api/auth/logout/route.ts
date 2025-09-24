import { NextResponse } from 'next/server'
import { revokeSessionCookie } from '@/lib/session'

export async function POST() {
  await revokeSessionCookie()
  return NextResponse.json({ success: true, message: 'Logged out' })
}
