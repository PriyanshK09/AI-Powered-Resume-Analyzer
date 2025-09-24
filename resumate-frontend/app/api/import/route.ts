import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'
import { generateStructuredFromRaw, resumesCollection } from '@/lib/resumes'
import { readSession } from '@/lib/session'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
  const session = await readSession()
  if (!session?.uid) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ success: false, message: 'File missing' }, { status: 400 })

    const ext = (file.name.split('.').pop() || '').toLowerCase()
    if (!['pdf','tex'].includes(ext)) return NextResponse.json({ success: false, message: 'Unsupported type' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    let rawText = ''
    if (ext === 'pdf') {
      const data = await pdfParse(Buffer.from(arrayBuffer))
      rawText = data.text
    } else if (ext === 'tex') {
      rawText = Buffer.from(arrayBuffer).toString('utf-8')
      // Remove LaTeX commands
      rawText = rawText.replace(/%.*$/gm,'')
        .replace(/\\begin\{.*?\}|\\end\{.*?\}/g,'')
        .replace(/\\[a-zA-Z]+\*?(\[[^\]]*\])?(\{[^}]*\})?/g,'')
        .replace(/\{\}|~/g,' ')
    }
    rawText = rawText.replace(/\n{3,}/g,'\n\n').trim()

    const structured = await generateStructuredFromRaw(rawText)
    if (!structured) return NextResponse.json({ success: false, message: 'Parsing failed' }, { status: 500 })
    
    // Insert draft resume with all parsed fields
    const col = await resumesCollection()
    const now = new Date()
    const doc = {
      _id: crypto.randomUUID(),
      userId: session.uid,
      title: file.name.replace(/\.(pdf|tex)$/i,'') || 'Imported Resume',
      content: rawText, // Store original content
      summary: structured.summary || '',
      experience: structured.experience || '',
      projects: structured.projects || '',
      education: structured.education || '',
      certifications: structured.certifications || '',
      skills: structured.skills || '',
      achievements: structured.achievements || '',
      languages: structured.languages || '',
      publications: structured.publications || '',
      volunteerWork: structured.volunteerWork || '',
      interests: structured.interests || '',
      references: structured.references || '',
      createdAt: now,
      updatedAt: now,
      draft: true
    }
    await col.insertOne(doc as any)
    return NextResponse.json({ success: true, resume: doc, ai: structured.ai })
  } catch (e:any) {
    console.error('Import error', e)
    return NextResponse.json({ success: false, message: 'Import failed' }, { status: 500 })
  }
}
