import { NextRequest, NextResponse } from 'next/server'
import { readSession } from '@/lib/session'
import { analyzeResume } from '@/lib/resumes'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  try {
    const result = await analyzeResume(session.uid, resolvedParams.id)
    if (!result) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, analysis: result })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
