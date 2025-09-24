import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { readSession } from '@/lib/session'
import { usersCollection } from '@/lib/mongo'

export async function GET() {
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 })
  const col = await usersCollection()
  const user = await col.findOne({ _id: session.uid })
  if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
  // Standardized response shape (was previously `data`)
  return NextResponse.json({ success: true, user: { id: user._id, email: user.email, name: user.name, createdAt: user.createdAt } })
}
