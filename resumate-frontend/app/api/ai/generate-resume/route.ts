import { NextRequest, NextResponse } from 'next/server'

// Model constant (can be parameterized later)
const MODEL = 'gemini-1.5-flash'

interface QuestionnaireBody {
  yearsExperience?: number
  role?: string
  seniority?: string
  industry?: string
  topSkills?: string
  keyAchievements?: string
  techStack?: string
  educationSummary?: string
  certifications?: string
  languages?: string
  volunteering?: string
  interests?: string
  tone?: 'concise' | 'impactful' | 'technical' | 'executive'
}

/*
  Response shape expected by client:
  {
    success: true,
    data: {
      summary: string,
      experience: string,
      projects: string,
      education: string,
      certifications: string,
      skills: string,
      achievements: string,
      languages: string,
      volunteerWork: string,
      interests: string,
      references: string
    }
  }
*/

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Missing GEMINI_API_KEY env variable.' }, { status: 500 })
    }
    const body = await req.json() as QuestionnaireBody

    // Build a structured prompt; instruct model to return JSON ONLY.
    const prompt = `You are an expert resume writing assistant. Using the questionnaire answers below, craft professional resume section drafts.
Return ONLY valid JSON with keys: summary, experience, projects, education, certifications, skills, achievements, languages, volunteerWork, interests, references.
Use concise bullet points separated by newlines. Avoid first-person pronouns. Quantify impact with metrics. Keep lines < 140 chars.
If a field is missing in the questionnaire, return an empty string for that key.

Questionnaire Answers:\n${JSON.stringify(body, null, 2)}\n
Return JSON now:`

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

    // Attempt to isolate JSON (model may wrap in markdown)
    const jsonMatch = text.match(/```json[\s\S]*?```/i)
    let jsonStr = text
    if (jsonMatch) {
      jsonStr = jsonMatch[0].replace(/```json|```/gi, '').trim()
    }
    try {
      const parsed = JSON.parse(jsonStr)
      const clean = {
        summary: parsed.summary || '',
        experience: parsed.experience || '',
        projects: parsed.projects || '',
        education: parsed.education || '',
        certifications: parsed.certifications || '',
        skills: parsed.skills || '',
        achievements: parsed.achievements || '',
        languages: parsed.languages || '',
        volunteerWork: parsed.volunteerWork || '',
        interests: parsed.interests || '',
        references: parsed.references || ''
      }
      return NextResponse.json({ success: true, data: clean })
    } catch (e:any) {
      // Fallback heuristic: attempt to split sections by headings
      const fallback = {
        summary: text.split(/Summary:/i)[1]?.split(/\n\n/)[0]?.trim() || '',
        experience: text.split(/Experience:/i)[1]?.split(/\n\n/)[0]?.trim() || '',
        projects: text.split(/Projects:/i)[1]?.split(/\n\n/)[0]?.trim() || '',
        education: text.split(/Education:/i)[1]?.split(/\n\n/)[0]?.trim() || '',
        certifications: text.split(/Certifications:/i)[1]?.split(/\n\n/)[0]?.trim() || '',
        skills: text.split(/Skills:/i)[1]?.split(/\n\n/)[0]?.trim() || '',
        achievements: text.split(/Achievements:/i)[1]?.split(/\n\n/)[0]?.trim() || '',
        languages: text.split(/Languages:/i)[1]?.split(/\n\n/)[0]?.trim() || '',
        volunteerWork: text.split(/VolunteerWork:|Volunteer Work:/i)[1]?.split(/\n\n/)[0]?.trim() || '',
        interests: text.split(/Interests:/i)[1]?.split(/\n\n/)[0]?.trim() || '',
        references: ''
      }
      return NextResponse.json({ success: true, data: fallback, warning: 'JSON parse failed; heuristic extraction used.' })
    }
  } catch (e:any) {
    return NextResponse.json({ success: false, error: e.message || 'Unexpected error' }, { status: 500 })
  }
}
