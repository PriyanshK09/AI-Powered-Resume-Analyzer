import { NextRequest, NextResponse } from 'next/server'
import { readSession } from '@/lib/auth'
import { improveResume, generateResumeImprovements, applySelectedImprovements } from '@/lib/resumes'

export const dynamic = 'force-dynamic'

// Next.js may now require awaiting the context to safely access params in some edge/runtime modes.
// Adjusting signature to fetch id safely.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // In newer Next.js versions params may be a Promise.
  const resolvedParams = await params
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  try {
    let body: any = {}
    try { body = await req.json() } catch {}
    const mode = body.mode || 'legacy'
    if (mode === 'preview') {
      const improvements = await generateResumeImprovements(session.uid, resolvedParams.id, { aggressiveness: body.aggressiveness })
      if (!improvements) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
      return NextResponse.json({ success: true, preview: true, ...improvements })
    } else if (mode === 'apply') {
      const sections: string[] = Array.isArray(body.sections) ? body.sections : ['summary','experience','skills']
      const improvements = body.generated ? body.generated : undefined
      const result = await applySelectedImprovements(session.uid, resolvedParams.id, sections, improvements, { aggressiveness: body.aggressiveness })
      if (!result) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
      return NextResponse.json({ success: true, ...result })
    } else {
      // legacy immediate apply for backward compatibility
      const result = await improveResume(session.uid, resolvedParams.id)
      if (!result) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
      return NextResponse.json({ success: true, ...result })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
