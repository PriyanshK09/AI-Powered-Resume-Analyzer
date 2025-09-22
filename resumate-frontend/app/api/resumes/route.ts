import { NextRequest, NextResponse } from 'next/server'
import { readSession } from '@/lib/auth'
import { listResumes, createResume } from '@/lib/resumes'
import { resumeCreateSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  const items = await listResumes(session.uid)
  return NextResponse.json({ success: true, resumes: items })
}

export async function POST(req: NextRequest) {
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const parsed = resumeCreateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 })
  const doc = await createResume(session.uid, parsed.data)
    return NextResponse.json({ success: true, resume: doc })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
