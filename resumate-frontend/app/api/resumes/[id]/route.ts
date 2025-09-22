import { NextRequest, NextResponse } from 'next/server'
import { readSession } from '@/lib/auth'
import { getResume, updateResume, deleteResume } from '@/lib/resumes'
import { resumeUpdateSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> } | { params: { id: string } }) {
  const resolved = await (params as any)
  const id: string = resolved.id
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  const resume = await getResume(session.uid, id)
  if (!resume) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true, resume })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> } | { params: { id: string } }) {
  const resolved = await (params as any)
  const id: string = resolved.id
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const parsed = resumeUpdateSchema.safeParse({ ...body, id })
    if (!parsed.success) return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 })
  // Whitelist properties (exclude id) to avoid unintended updates
  const { id: _discard, title, content, targetRole, templateId, summary, experience, skills, fullName, email, phone, location, linkedin, github, portfolio } = parsed.data as any
  const patch: any = {}
  if (title !== undefined) patch.title = title
  if (content !== undefined) patch.content = content
  if (targetRole !== undefined) patch.targetRole = targetRole
  if (templateId !== undefined) patch.templateId = templateId
  if (summary !== undefined) patch.summary = summary
  if (experience !== undefined) patch.experience = experience
  if (skills !== undefined) patch.skills = skills
  if (fullName !== undefined) patch.fullName = fullName
  if (email !== undefined) patch.email = email
  if (phone !== undefined) patch.phone = phone
  if (location !== undefined) patch.location = location
  if (linkedin !== undefined) patch.linkedin = linkedin
  if (github !== undefined) patch.github = github
  if (portfolio !== undefined) patch.portfolio = portfolio
  const updated = await updateResume(session.uid, id, patch)
    if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, resume: updated })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> } | { params: { id: string } }) {
  const resolved = await (params as any)
  const id: string = resolved.id
  const session = await readSession()
  if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  try {
    await deleteResume(session.uid, id)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
