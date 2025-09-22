import { NextResponse } from 'next/server'
import { readSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Static template metadata; in future could be stored in DB or CDN
const templates = [
  { id: 'modern-gradient', name: 'Modern Gradient', category: 'Modern', image: '/placeholder.jpg', accent: 'violet' },
  { id: 'minimal-focus', name: 'Minimal Focus', category: 'Minimal', image: '/placeholder.jpg', accent: 'slate' },
  { id: 'executive-clean', name: 'Executive Clean', category: 'Professional', image: '/placeholder.jpg', accent: 'purple' },
  { id: 'creative-splash', name: 'Creative Splash', category: 'Creative', image: '/placeholder.jpg', accent: 'pink' },
]

export async function GET() {
  // Optional: require auth to view; we read session but allow proceed if absent for marketing preview later
  const session = await readSession()
  return NextResponse.json({ success: true, templates, authenticated: !!session })
}
