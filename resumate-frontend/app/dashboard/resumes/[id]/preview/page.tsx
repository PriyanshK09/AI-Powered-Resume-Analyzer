"use client"
// @ts-ignore
import { useParams, useRouter } from 'next/navigation'
import { useResumes } from '@/hooks/use-resumes'
import { useEffect, useMemo, useState } from 'react'
import Header from '@/components/landing/Header'
import { Button } from '@/components/ui/button'

export default function PreviewResumePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { resumes, analyze } = useResumes()
  const record = resumes.find(r => r._id === id)
  const [darkMode, setDarkMode] = useState<boolean>(() => typeof window !== 'undefined' && document.documentElement.classList.contains('dark'))
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => { const onScroll = () => setScrollY(window.scrollY); window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll) }, [])
  useEffect(() => { if (darkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark') }, [darkMode])

  const combined = useMemo(() => {
    if (!record) return ''
    const parts = [record.summary, record.experience, record.skills].filter(Boolean)
    return parts.join('\n\n') || record.content
  }, [record])

  if (!record) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500 dark:text-slate-400">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="relative z-30 print:hidden"><Header darkMode={darkMode} setDarkMode={setDarkMode} scrollY={scrollY} /></div>
      <main className="pt-28 pb-16 px-4 md:px-8 max-w-5xl mx-auto" id="resume-print-root">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {record.title}
          </h1>
          <div className="flex gap-2 flex-wrap">
            <Button {...({ variant: "outline" } as any)} onClick={() => router.push(`/dashboard/resumes/${record._id}/edit`)}>Edit</Button>
            <Button {...({ variant: "outline" } as any)} onClick={() => analyze(record._id)}>Score Resume</Button>
            <Button {...({ variant: "outline" } as any)} onClick={() => window.print()}>Print / PDF</Button>
            <Button onClick={() => router.back()}>Back</Button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl p-8 border border-violet-100/60 dark:border-slate-700/60 print:shadow-none print:border print:border-black/10 print:rounded-none print:p-6 print:bg-white resume-paper">
          {(record.fullName || record.email || record.phone || record.location || record.linkedin || record.github || record.portfolio) && (
            <section className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  {record.fullName && <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100 leading-tight">{record.fullName}</h2>}
                  {(record.location || record.phone) && <p className="text-xs text-gray-500 dark:text-slate-400">{[record.location, record.phone].filter(Boolean).join(' • ')}</p>}
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-violet-700 dark:text-violet-300">
                  {record.email && <a href={`mailto:${record.email}`} className="underline decoration-dotted">Email</a>}
                  {record.linkedin && <a href={record.linkedin} target="_blank" rel="noreferrer" className="underline decoration-dotted">LinkedIn</a>}
                  {record.github && <a href={record.github} target="_blank" rel="noreferrer" className="underline decoration-dotted">GitHub</a>}
                  {record.portfolio && <a href={record.portfolio} target="_blank" rel="noreferrer" className="underline decoration-dotted">Portfolio</a>}
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-violet-200 via-purple-200 to-pink-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 mt-4 print:bg-gradient-to-r print:from-gray-300 print:via-gray-300 print:to-gray-300" />
            </section>
          )}
          {record.summary && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2 print:text-gray-800">Professional Summary</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{record.summary}</p>
            </section>
          )}
          {record.experience && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2 print:text-gray-800">Experience</h2>
              <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{record.experience}</div>
            </section>
          )}
          {record.skills && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2 print:text-gray-800">Skills</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{record.skills}</p>
            </section>
          )}
          {record.projects && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2 print:text-gray-800">Projects</h2>
              <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{record.projects}</div>
            </section>
          )}
          {record.education && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2 print:text-gray-800">Education</h2>
              <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{record.education}</div>
            </section>
          )}
          {record.certifications && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2 print:text-gray-800">Certifications</h2>
              <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{record.certifications}</div>
            </section>
          )}
          {record.achievements && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2 print:text-gray-800">Achievements</h2>
              <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{record.achievements}</div>
            </section>
          )}
          {record.languages && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2 print:text-gray-800">Languages</h2>
              <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{record.languages}</div>
            </section>
          )}
          {record.publications && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2 print:text-gray-800">Publications</h2>
              <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{record.publications}</div>
            </section>
          )}
          {record.volunteerWork && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2 print:text-gray-800">Volunteer Work</h2>
              <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{record.volunteerWork}</div>
            </section>
          )}
          {record.interests && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2 print:text-gray-800">Interests</h2>
              <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{record.interests}</div>
            </section>
          )}
          {record.references && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold text-violet-700 dark:text-violet-300 mb-2 print:text-gray-800">References</h2>
              <div className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{record.references}</div>
            </section>
          )}
          {!record.summary && !record.experience && !record.skills && !record.projects && !record.education && !record.certifications && !record.achievements && !record.languages && !record.publications && !record.volunteerWork && !record.interests && !record.references && (
            <div className="text-sm whitespace-pre-line text-gray-700 dark:text-slate-300 print:text-gray-800">{combined}</div>
          )}
        </div>
      </main>
    </div>
  )
}
