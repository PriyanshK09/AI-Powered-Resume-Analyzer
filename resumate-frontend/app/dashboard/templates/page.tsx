"use client"
import { useEffect, useState } from 'react'
import Header from '@/components/landing/Header'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

interface TemplateMeta { id: string; name: string; image: string; category?: string; accent?: string }

// Force dynamic rendering to avoid prerender issues
export const dynamic = 'force-dynamic'

export default function TemplatesPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [darkMode, setDarkMode] = useState<boolean>(() => typeof window !== 'undefined' && document.documentElement.classList.contains('dark'))
  const [scrollY, setScrollY] = useState(0)
  const [templates, setTemplates] = useState<TemplateMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => { 
        if (d.success) {
          setTemplates(d.templates)
        } else {
          setError(d.message || 'Failed to load templates')
        }
      })
      .catch(e => {
        console.error('Failed to load templates:', e)
        setError('Failed to load templates')
      })
      .finally(() => setLoading(false))
  }, [])

  function choose(t: TemplateMeta) {
    router.push(`/dashboard/resumes/new?templateId=${encodeURIComponent(t.id)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="relative z-30"><Header darkMode={darkMode} setDarkMode={setDarkMode} scrollY={scrollY} /></div>
      <main className="pt-32 pb-20 max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Templates</h1>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">Pick a starting design—you can always change later.</p>
          </div>
        </div>
        {loading && <p className="text-sm text-gray-500 dark:text-slate-500">Loading templates…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {templates.map(t => (
              <button key={t.id} onClick={()=>choose(t)} className="group relative rounded-2xl overflow-hidden border border-white/50 dark:border-slate-700/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-4 flex flex-col text-left hover:shadow-lg transition-shadow">
                <div className="aspect-[4/5] w-full rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-slate-700 dark:to-slate-800 mb-3 flex items-center justify-center text-sm text-gray-500 dark:text-slate-400">
                  Preview
                </div>
                <span className="font-medium text-gray-800 dark:text-slate-100">{t.name}</span>
                <span className="text-[11px] uppercase tracking-wide mt-1 text-violet-600 dark:text-violet-400">{t.category || 'General'}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-violet-700 dark:text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity">Use this →</span>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
