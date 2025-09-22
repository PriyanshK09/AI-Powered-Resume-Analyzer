import { NextResponse } from 'next/server'
import { revokeSessionCookie } from '@/lib/auth'

export async function POST() {
  await revokeSessionCookie()
  return NextResponse.json({ success: true, message: 'Logged out' })
}
