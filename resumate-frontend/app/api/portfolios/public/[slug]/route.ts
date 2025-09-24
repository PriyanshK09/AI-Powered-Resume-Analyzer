import { NextRequest, NextResponse } from 'next/server'
import { getPortfolioBySlug, incrementPortfolioViews } from '@/lib/portfolios'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  
  try {
    const portfolio = await getPortfolioBySlug(resolvedParams.slug)
    if (!portfolio) {
      return NextResponse.json({ success: false, message: 'Portfolio not found' }, { status: 404 })
    }
    
    // Increment view count
    await incrementPortfolioViews(resolvedParams.slug)
    
    return NextResponse.json({ success: true, portfolio })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}