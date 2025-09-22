"use client"
import { useState, useEffect, useMemo } from 'react'
import nextDynamic from 'next/dynamic'
import Header from '@/components/landing/Header'
import { useCurrentUser } from '@/hooks/use-current-user'
import { QuickActions } from './_components/QuickActions'
import { ResumeList, type ResumeItem } from './_components/ResumeList'
import { ResumeListSkeleton } from './_components/ResumeListSkeleton'
import { AIInsights } from './_components/AIInsights'
import { TemplateGalleryPreview } from './_components/TemplateGalleryPreview'
import { ActivityFeed } from './_components/ActivityFeed'
import { GettingStartedChecklist } from './_components/GettingStartedChecklist'
import { PlanStatus } from './_components/PlanStatus'
import { useResumes } from '@/hooks/use-resumes'
import { Card } from '@/components/ui/card'
import { ImprovementDialog } from './_components/ImprovementDialog'
import { ImportDialog } from './_components/ImportDialog'

export const dynamic = 'force-dynamic'

// Potential future heavy editor or chart components could be dynamically imported:
// const HeavyEditor = dynamic(() => import('./_components/HeavyEditor'), { ssr: false, loading: () => <div className="text-sm text-gray-500 dark:text-slate-500">Loading editor…</div> })

export default function DashboardPage() {
  // Theme + scroll state replicated (could be centralized later)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try { return localStorage.getItem('resumate-theme') === 'dark' || document.documentElement.classList.contains('dark') } catch { return false }
  })
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch {}
  }, [darkMode])

  // Listen for theme change events (emitted by Header toggles on other pages) so state stays in sync
  useEffect(() => {
    function onTheme(e: any) {
      if (typeof e?.detail?.dark === 'boolean') setDarkMode(e.detail.dark)
    }
    window.addEventListener('resumate-theme-change', onTheme)
    return () => window.removeEventListener('resumate-theme-change', onTheme)
  }, [])

  const { user } = useCurrentUser()
  const { resumes: resumeDocs, loading: resumesLoading, analyze, improve, remove, scoring, improving: improvingSet, deleting, updating, replaceLocal } = useResumes()
  const [improveTarget, setImproveTarget] = useState<string | null>(null)
  const [templates, setTemplates] = useState<{ id: string; name: string; image: string; category?: string }[]>([])
  const [importOpen, setImportOpen] = useState(false)
  useEffect(() => {
    fetch('/api/templates').then(r => r.json()).then(d => { if (d.success) setTemplates(d.templates) }).catch(()=>{})
  }, [])

  // Mock data placeholders (replace with real fetches later)
  const resumes: ResumeItem[] = useMemo(() => (
    resumeDocs.map(r => ({
      id: r._id,
      title: r.title,
      updatedAt: new Intl.RelativeTimeFormat('en',{numeric:'auto'}).format(Math.round((new Date(r.updatedAt).getTime() - Date.now())/ (1000*60*60*24)), 'day'),
      score: r.score,
      roleTarget: r.targetRole,
      status: 'draft' as const
    }))
  ), [resumeDocs])

  const insights = useMemo(() => ([
    { id: 'i1', type: 'strength' as const, title: 'Strong quantifiable achievements', description: 'Multiple bullet points include metrics (increased performance by 35%, reduced cost 20%).', impact: 'Higher recruiter interest' },
    { id: 'i2', type: 'opportunity' as const, title: 'Add leadership indicators', description: 'Consider highlighting mentorship or cross-team collaboration to strengthen seniority signal.', impact: 'Improves senior-level alignment' },
    { id: 'i3', type: 'metric' as const, title: 'Keyword coverage 68%', description: 'You match 34 of 50 high-priority keywords for typical backend roles.' },
  ]), [])

  const templatePreview = templates

  const activity = useMemo(() => ([
    { id: 'a1', action: 'AI analysis run on "Software Engineer Resume" (score +4%)', ts: 'Today 10:12' },
    { id: 'a2', action: 'Edited summary section in "Product Manager Resume"', ts: 'Yesterday 16:40' },
    { id: 'a3', action: 'Created new resume "Software Engineer Resume"', ts: '2 days ago' },
  ]), [])

  const checklist = useMemo(() => ([
    { id: 'c1', label: 'Create your first resume', done: true },
    { id: 'c2', label: 'Run AI analysis', done: true },
    { id: 'c3', label: 'Improve score above 80%', done: false },
    { id: 'c4', label: 'Export PDF', done: false },
  ]), [])

  const planUsage = { resumes: 2, limit: 5, aiAnalyses: 3, aiLimit: 10 }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Floating gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden max-w-[100vw]">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-r from-violet-400/20 to-purple-400/20 dark:from-violet-600/20 dark:to-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-gradient-to-r from-purple-400/20 to-pink-400/20 dark:from-purple-600/20 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header overlay (consistent with landing) */}
      <div className="relative z-30">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} scrollY={scrollY} />
      </div>

      <main className="relative z-10 pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Greeting & quick stats */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold font-display bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
            {user ? `Welcome back, ${user.name || user.email.split('@')[0]}` : 'Welcome to your dashboard'}
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-slate-400 mt-2 max-w-2xl">
            Manage resumes, run AI analyses, explore templates, and track your progress—all in one place.
          </p>
        </div>

        {/* Top grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <section aria-labelledby="quick-actions-heading" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 id="quick-actions-heading" className="text-sm font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Quick Actions</h2>
              </div>
              <QuickActions onImportResume={() => setImportOpen(true)} />
            </section>

            <section aria-labelledby="resumes-heading" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 id="resumes-heading" className="text-sm font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Your Resumes</h2>
                {/* TODO: add filter/sort */}
              </div>
              {resumesLoading ? (
                <ResumeListSkeleton />
              ) : (
                <ResumeList
                  resumes={resumes}
                  onImprove={async (id) => { setImproveTarget(id) }}
                  onScore={async (id) => { await analyze(id) }}
                  onPreview={(id) => { window.location.href = `/dashboard/resumes/${id}/preview` }}
                  onEdit={(id) => { window.location.href = `/dashboard/resumes/${id}/edit` }}
                  onDelete={async (id) => { await remove(id) }}
                  loadingStates={{ scoring, improving: improvingSet, deleting, updating }}
                />
              )}
            </section>
            <ImprovementDialog
              resumeId={improveTarget}
              open={!!improveTarget}
              onOpenChange={(v) => { if (!v) setImproveTarget(null) }}
              onApplied={(updated) => { if (updated?._id) replaceLocal(updated) }}
            />
            <ImportDialog
              open={importOpen}
              onOpenChange={setImportOpen}
              onImported={(draft) => { /* trigger refresh: simplest is window reload or fetch resumes hook auto-polls */ }}
            />

            <section aria-labelledby="insights-heading" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 id="insights-heading" className="text-sm font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">AI Insights</h2>
              </div>
              <AIInsights insights={insights} />
            </section>
          </div>

          <div className="space-y-8">
            <PlanStatus plan='free' usage={planUsage} />
            <TemplateGalleryPreview templates={templatePreview} />
            <GettingStartedChecklist items={checklist} />
            <ActivityFeed items={activity} />
          </div>
        </div>

        {/* Future area: Editor shortcut / analytics charts */}
        <div className="mt-16">
          <Card className="p-8 bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 rounded-2xl text-center">
            <p className="text-sm text-gray-600 dark:text-slate-400">More advanced analytics and an inline editor will appear here soon. 🚀</p>
          </Card>
        </div>
      </main>
    </div>
  )
}
