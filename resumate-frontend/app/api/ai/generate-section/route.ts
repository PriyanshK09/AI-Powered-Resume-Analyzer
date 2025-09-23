import { NextRequest, NextResponse } from 'next/server'

const MODEL = 'gemini-1.5-flash'

interface Body {
  section: string
  context?: any // questionnaire context
  current?: string // existing section content (to improve)
  targetRole?: string
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ success:false, error:'Missing GEMINI_API_KEY' }, { status:500 })
    const body = await req.json() as Body
    const { section, context = {}, current = '', targetRole = '' } = body
    if (!section) return NextResponse.json({ success:false, error:'section required' }, { status:400 })

    const instructionMap: Record<string,string> = {
      summary: 'Return a 2-3 line professional summary highlighting differentiated impact.',
      experience: 'Return metric-driven bullet points (3-6) improving clarity & quantification.',
      projects: 'Return 2-3 concise project entries with impact bullets.',
      education: 'Return formatted education lines with degree, institution, achievements.',
      certifications: 'Return certification list (one per line).',
      skills: 'Return grouped skills lines: Category: a, b, c',
      achievements: 'Return notable achievements / awards (one per line).',
      languages: 'Return language list with proficiency.',
      volunteerWork: 'Return volunteer experiences with impact.',
      interests: 'Return concise interests list (comma separated).',
      references: "Return either 'Available upon request' or structured reference lines if context implies names." 
    }

    const sectionInstruction = instructionMap[section] || 'Return concise professional lines.'

    const prompt = `You rewrite a resume section. Section: ${section}. Target Role: ${targetRole}.\nQuestionnaire Context: ${JSON.stringify(context)}\nExisting Content (may be empty):\n${current}\n\n${sectionInstruction}\nReturn ONLY the raw text (no JSON, no markdown fences). Keep bullets < 140 chars.`

    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ contents:[{ parts:[{ text: prompt }] }] })
    })
    if (!resp.ok) {
      const t = await resp.text()
      return NextResponse.json({ success:false, error:'Gemini API error', detail:t }, { status:502 })
    }
    const data = await resp.json()
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return NextResponse.json({ success:true, section, content: text.trim() })
  } catch(e:any) {
    return NextResponse.json({ success:false, error:e.message||'Unexpected error' }, { status:500 })
  }
}
