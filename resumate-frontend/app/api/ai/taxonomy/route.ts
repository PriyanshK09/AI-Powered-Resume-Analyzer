import { NextRequest, NextResponse } from 'next/server'

// IMPORTANT: Set GEMINI_API_KEY in your environment. Do NOT hardcode secrets.
// The user supplied a key earlier; it should be stored securely (e.g., .env.local) as GEMINI_API_KEY.

const MODEL = 'gemini-1.5-flash'

interface Body {
  accent?: string
  existing?: string
  targetRole?: string
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Missing GEMINI_API_KEY env variable.' }, { status: 500 })
    }
    const body = await req.json() as Body
    const { accent='general', existing='', targetRole='' } = body

    // Basic prompt engineering; can be refined.
    const prompt = `You are assisting in crafting a resume skills taxonomy. Accent/theme: ${accent}. Target role: ${targetRole||'unspecified'}. Existing skills lines (avoid duplicates):\n${existing}\n\nReturn 6-10 NEW concise category lines (Category: item1, item2...) focusing on modern, role-relevant technology and practices. No numbering. Keep each line < 90 chars.`

    // Use fetch to Gemini REST API (since we did not add dependency yet). If @google/generative-ai is desired, add it to deps.
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    })
    if (!resp.ok) {
      const txt = await resp.text()
      return NextResponse.json({ success: false, error: 'Gemini API error', detail: txt }, { status: 502 })
    }
    const data = await resp.json()
    const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const lines = text.split(/\n+/).map((l:string)=>l.trim()).filter(Boolean).slice(0,12)

    return NextResponse.json({ success: true, suggestions: lines })
  } catch (e:any) {
    return NextResponse.json({ success: false, error: e.message || 'Unexpected error' }, { status: 500 })
  }
}
