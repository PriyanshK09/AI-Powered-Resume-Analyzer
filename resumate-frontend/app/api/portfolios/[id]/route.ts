import { NextRequest, NextResponse } from 'next/server'
import { readSession } from '@/lib/auth'
import { getPortfolio, updatePortfolio, deletePortfolio } from '@/lib/portfolios'
import { portfolioUpdateSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  
  try {
    const resolvedParams = await params
    console.log('Loading portfolio:', resolvedParams.id, 'for user:', session.uid)
    const portfolio = await getPortfolio(session.uid, resolvedParams.id)
    if (!portfolio) {
      console.log('Portfolio not found:', resolvedParams.id)
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, portfolio })
  } catch (e) {
    console.error('Portfolio GET error:', e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  
  try {
    const resolvedParams = await params
    const body = await req.json()
    console.log('Updating portfolio:', resolvedParams.id, body)
    
    const parsed = portfolioUpdateSchema.safeParse(body)
    if (!parsed.success) {
      console.error('Portfolio update validation errors:', parsed.error.issues)
      return NextResponse.json({ 
        success: false, 
        message: parsed.error.issues[0].message 
      }, { status: 400 })
    }
    
    const portfolio = await updatePortfolio(session.uid, resolvedParams.id, parsed.data)
    
    if (!portfolio) {
      console.log('Portfolio not found for update:', resolvedParams.id)
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, portfolio })
  } catch (e: any) {
    console.error('Portfolio UPDATE error:', e)
    return NextResponse.json({ 
      success: false, 
      message: e.message || 'Server error' 
    }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  
  try {
    const resolvedParams = await params
    console.log('Deleting portfolio:', resolvedParams.id, 'for user:', session.uid)
    const deleted = await deletePortfolio(session.uid, resolvedParams.id)
    if (!deleted) {
      console.log('Portfolio not found for deletion:', resolvedParams.id)
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: 'Portfolio deleted successfully' })
  } catch (e) {
    console.error('Portfolio DELETE error:', e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}