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

    // Normalize structured fields to strings to match schema
    const normalize = (key: string, value: any): string => {
      if (value == null) return ''
      if (typeof value === 'string') return value
      const joinBullets = (items: any[]): string => items.map(v => `- ${String(v).trim()}`).join('\n')
      if (Array.isArray(value)) {
        if (['experience', 'projects', 'achievements'].includes(key)) {
          const lines: string[] = []
          for (const item of value) {
            if (!item) continue
            if (typeof item === 'string') { lines.push(item.trim()); continue }
            if (typeof item === 'object') {
              const title = item.title || item.role || item.position || ''
              const org = item.company || item.organization || item.org || ''
              const period = item.period || item.dates || item.year || ''
              const header = [title, org].filter(Boolean).join(' @ ')
              const headWithPeriod = [header, period].filter(Boolean).join(' (') + (period ? ')' : '')
              if (header || period) lines.push(`- ${headWithPeriod}`.trim())
              if (Array.isArray(item.bullets)) {
                for (const b of item.bullets) lines.push(`  • ${String(b).trim()}`)
              } else if (item.description || item.summary) {
                lines.push(`  • ${String(item.description || item.summary).trim()}`)
              }
              continue
            }
            lines.push(String(item))
          }
          return lines.join('\n')
        }
        if (key === 'education') {
          const lines: string[] = []
          for (const item of value) {
            if (!item) continue
            if (typeof item === 'string') { lines.push(item.trim()); continue }
            if (typeof item === 'object') {
              const degree = item.degree || item.qualification || ''
              const school = item.school || item.institution || ''
              const year = item.year || item.graduationYear || item.dates || ''
              const composed = [degree, school, year].filter(Boolean).join(' | ')
              if (composed) lines.push(composed)
              else lines.push(JSON.stringify(item))
              continue
            }
            lines.push(String(item))
          }
          return lines.join('\n')
        }
        if (key === 'skills' || key === 'metaKeywords') {
          const flat = value.map(v => (typeof v === 'string' ? v : JSON.stringify(v))).map(s => s.trim()).filter(Boolean)
          return Array.from(new Set(flat)).join(', ')
        }
        if (key === 'testimonials') {
          const blocks: string[] = []
          for (const t of value) {
            if (!t) continue
            if (typeof t === 'string') { blocks.push(t.trim()); continue }
            if (typeof t === 'object') {
              const quote = t.quote || t.text || t.content || ''
              const author = [t.author, t.name].find(Boolean) || ''
              const title = t.title || t.role || ''
              const byline = [author, title].filter(Boolean).join(', ')
              if (quote || byline) blocks.push(`“${String(quote).trim()}” — ${byline}`.trim())
              else blocks.push(JSON.stringify(t))
            }
          }
          return blocks.join('\n\n')
        }
        if (key === 'services') {
          return value.map(v => (typeof v === 'string' ? v.trim() : JSON.stringify(v))).filter(Boolean).join('\n')
        }
        return joinBullets(value)
      }
      if (typeof value === 'object') {
        if (key === 'skills') {
          const parts: string[] = []
          for (const [k, v] of Object.entries(value)) {
            if (Array.isArray(v)) parts.push(`${k}: ${v.map(x => String(x).trim()).join(', ')}`)
            else parts.push(`${k}: ${String(v).trim()}`)
          }
          return parts.join('\n')
        }
        if (key === 'contact') {
          const { email, phone, location, website } = value as any
          const parts = [email && `Email: ${email}`, phone && `Phone: ${phone}`, location && `Location: ${location}`, website && `Website: ${website}`].filter(Boolean)
          if (parts.length) return parts.join(' | ')
        }
        try { return JSON.stringify(value, null, 2) } catch { return String(value) }
      }
      return String(value)
    }

    const normalized: Record<string, any> = { ...body }
    for (const key of ['experience','projects','skills','education','achievements','testimonials','services','metaKeywords','about','contact']) {
      if (key in normalized) normalized[key] = normalize(key, normalized[key])
    }
    
  const parsed = portfolioCreateSchema.safeParse(normalized)
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