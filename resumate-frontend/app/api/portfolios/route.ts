import { NextRequest, NextResponse } from 'next/server'
import { readSession } from '@/lib/session'
import { createPortfolio, getUserPortfolios } from '@/lib/portfolios'
import { portfolioCreateSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  
  try {
    const portfolios = await getUserPortfolios(session.uid)
    return NextResponse.json({ success: true, portfolios })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  
  try {
    const body = await req.json()
    console.log('Received portfolio data:', JSON.stringify(body, null, 2))
    
    const parsed = portfolioCreateSchema.safeParse(body)
    if (!parsed.success) {
      console.error('Validation errors:', parsed.error.issues)
      const firstError = parsed.error.issues[0]
      const detailedMessage = `${firstError.message} at field: ${firstError.path.join('.')}`
      return NextResponse.json({ 
        success: false, 
        message: detailedMessage,
        errors: parsed.error.issues,
        fieldPath: firstError.path
      }, { status: 400 })
    }
    
    const portfolio = await createPortfolio(session.uid, parsed.data)
    return NextResponse.json({ success: true, portfolio })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ 
      success: false, 
      message: e.message || 'Server error' 
    }, { status: 500 })
  }
}