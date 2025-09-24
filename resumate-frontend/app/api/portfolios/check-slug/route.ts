import { NextRequest, NextResponse } from 'next/server'
import { readSession } from '@/lib/auth'
import { checkSlugAvailability } from '@/lib/portfolios'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const excludeId = searchParams.get('excludeId')
  
  if (!slug) {
    return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 })
  }
  
  try {
    const available = await checkSlugAvailability(slug, excludeId || undefined)
    return NextResponse.json({ success: true, available })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}