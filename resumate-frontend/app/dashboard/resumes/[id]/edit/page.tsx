"use client"
import { useEffect, useState } from 'react'
// @ts-ignore
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/landing/Header'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useResumes } from '@/hooks/use-resumes'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// @ts-ignore
import { Check, Sparkles, Target, Lightbulb, RefreshCw, Info, Undo2 } from 'lucide-react'
import { templatePresets, skillTaxonomy, smartMerge, TemplatePreset } from '@/lib/templates'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import { EditorSkeleton } from '@/components/resume/EditorSkeleton'

function generateHints(section: string, targetRole?: string) {
  const role = targetRole || 'the role'
  if (section === 'summary') return [
    `Experienced professional targeting ${role} with a focus on scalable delivery`,
    'Blend of strategic architecture and hands-on optimization',
    'Track record of accelerating product velocity and reliability'
  ]
  if (section === 'experience') return [
    'Delivered feature set that improved user retention 18%',
    'Reduced infrastructure cost 22% via right-sizing & caching',
    'Introduced observability stack cutting MTTR from 90m to 25m'
  ]
  if (section === 'skills') return [
    'Backend: Node.js, TypeScript, Go (basic)',
    'Data: PostgreSQL, MongoDB, Redis, Kafka',
    'Tooling: Docker, Kubernetes, Terraform, Prometheus'
  ]
  return []
}

export default function EditResumePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { resumes, update } = useResumes()
  const record = resumes.find(r => r._id === id)
  const [darkMode, setDarkMode] = useState<boolean>(() => typeof window !== 'undefined' && document.documentElement.classList.contains('dark'))
  const [scrollY, setScrollY] = useState(0)
  // Basic legacy extraction: attempt to split content into blocks if structured fields missing
  const legacy = (() => {
    if (!record) return { summary: '', experience: '', skills: '' }
    if (record.summary || record.experience || record.skills) {
      return { summary: record.summary || '', experience: record.experience || '', skills: record.skills || '' }
    }
    const parts = (record.content || '').split(/\n{2,}/)
    return {
      summary: parts[0]?.length < 400 ? parts[0] : '',
      experience: parts.slice(1, parts.length-1).join('\n\n'),
      skills: parts[parts.length-1] || ''
    }
  })()
  const [form, setForm] = useState({
    title: record?.title || '', targetRole: record?.targetRole || '', templateId: record?.templateId || '',
    summary: legacy.summary, experience: legacy.experience, projects: record?.projects || '', education: record?.education || '', certifications: record?.certifications || '', skills: legacy.skills,
    achievements: record?.achievements || '', languages: record?.languages || '', publications: record?.publications || '', volunteerWork: record?.volunteerWork || '', interests: record?.interests || '', references: record?.references || '',
    fullName: record?.fullName || '', email: record?.email || '', phone: record?.phone || '', location: record?.location || '',
    linkedin: record?.linkedin || '', github: record?.github || '', portfolio: record?.portfolio || '', website: record?.website || ''
  })
  const [undoStack, setUndoStack] = useState<typeof form[]>([])
  // Single apply flow (always replace) for parity with New page
  const [templates, setTemplates] = useState<{ id: string; name: string; category?: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper function to safely convert values to strings
  const safeStringify = (value: any): string => {
    if (typeof value === 'string') return value
    if (value === null || value === undefined) return ''
    if (typeof value === 'object' && value !== null) {
      // Handle education object specifically
      if (value.degree && value.school) {
        const parts = []
        if (value.degree) parts.push(value.degree)
        if (value.school) parts.push(value.school)
        if (value.year) parts.push(value.year)
        return parts.join(' | ')
      }
      return Object.values(value).filter(Boolean).join(' ')
    }
    return String(value)
  }

  useEffect(() => { if (record) {
    const legacy = (() => {
      if (record.summary || record.experience || record.skills) return { summary: record.summary||'', experience: record.experience||'', skills: record.skills||'' }
      const parts = (record.content || '').split(/\n{2,}/)
      return {
        summary: parts[0]?.length < 400 ? parts[0] : '',
        experience: parts.slice(1, parts.length-1).join('\n\n'),
        skills: parts[parts.length-1] || ''
      }
    })()
  setForm({ title: record.title, targetRole: record.targetRole||'', templateId: record.templateId || '', summary: legacy.summary, experience: legacy.experience, projects: safeStringify(record.projects), education: safeStringify(record.education), certifications: safeStringify(record.certifications), skills: legacy.skills, achievements: safeStringify(record.achievements), languages: safeStringify(record.languages), publications: safeStringify(record.publications), volunteerWork: safeStringify(record.volunteerWork), interests: safeStringify(record.interests), references: safeStringify(record.references), fullName: record.fullName||'', email: record.email||'', phone: record.phone||'', location: record.location||'', linkedin: record.linkedin||'', github: record.github||'', portfolio: record.portfolio||'', website: record.website||'' })
  } }, [record])
  useEffect(() => { fetch('/api/templates').then(r=>r.json()).then(d=>{ if(d.success) setTemplates(d.templates) }).catch(()=>{}) }, [])

  const activePreset: TemplatePreset | undefined = form.templateId ? templatePresets[form.templateId] : undefined
  const activeGradient = activePreset?.gradient || 'from-violet-600/90 to-purple-600/90'

  function pushUndo() { setUndoStack(s => [...s.slice(-24), form]) } // keep last 25
  function undoLast() {
    setUndoStack(s => {
      if (!s.length) return s
      const prev = s[s.length-1]
      setForm(prev)
      return s.slice(0, -1)
    })
  }

  function applyTemplate() {
    if (!activePreset) return
    pushUndo()
    setForm(f => ({ ...f, summary: activePreset.summary, experience: activePreset.experience, skills: activePreset.skills }))
    toast({ title: 'Template applied', description: 'Sections replaced with template content.' })
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') { e.preventDefault(); (document.getElementById('apply-template-trigger') as HTMLElement)?.click() }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'b') { e.preventDefault(); normalizeBullets('*') }
      if (e.ctrlKey && e.key.toLowerCase() === 'z') { e.preventDefault(); undoLast() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undoStack, form])

  function normalizeBullets(prefix: string) {
    pushUndo()
    setForm(f => {
      const lines = f.experience.split(/\n/)
      const cleaned = lines.map(l => {
        const trimmed = l.trim()
        if (!trimmed) return ''
        // Remove any common bullet chars
        const stripped = trimmed.replace(/^([-*•→]+\s*)/, '')
        return `${prefix} ${stripped}`
      }).join('\n')
      return { ...f, experience: cleaned }
    })
    toast({ title: 'Bullets normalized', description: `All experience lines now use '${prefix}'.` })
  }

  const [activeTab, setActiveTab] = useState<'summary'|'experience'|'projects'|'education'|'certifications'|'skills'|'achievements'|'languages'|'publications'|'volunteerWork'|'interests'|'references'>('summary')

  function appendHint(section: 'summary'|'experience'|'projects'|'skills') {
    const hints = generateHints(section, form.targetRole)
    if (!hints.length) return
    setForm(f => {
      const key = section
      const existing = f[key]
      const toAdd = hints[Math.floor(Math.random()*hints.length)]
      return { ...f, [key]: existing ? existing + (existing.endsWith('\n') ? '' : '\n') + toAdd : toAdd }
    })
    toast({ title: 'Suggestion added', description: `${section} hint inserted.` })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    setError(null)
    try {
      setSaving(true)
    const combinedContent = [form.summary, form.experience, form.skills].filter(Boolean).join('\n\n') || 'Draft content'
    await update(id, { 
      title: form.title, 
      targetRole: form.targetRole, 
      content: combinedContent, 
      templateId: form.templateId || '', 
      summary: form.summary || '', 
      experience: form.experience || '', 
      projects: form.projects || '', 
      education: form.education || '', 
      certifications: form.certifications || '', 
      skills: form.skills || '', 
      achievements: form.achievements || '', 
      languages: form.languages || '', 
      publications: form.publications || '', 
      volunteerWork: form.volunteerWork || '', 
      interests: form.interests || '', 
      references: form.references || '', 
      fullName: form.fullName || '', 
      email: form.email || '', 
      phone: form.phone || '', 
      location: form.location || '', 
      linkedin: form.linkedin || '', 
      github: form.github || '', 
      portfolio: form.portfolio || '', 
      website: form.website || '' 
    })
      router.push('/dashboard')
    } catch (e:any) {
      setError(e.message)
    } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="relative z-30"><Header darkMode={darkMode} setDarkMode={setDarkMode} scrollY={scrollY} /></div>
      <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between mb-8"><h1 className="text-3xl font-display font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Edit Resume</h1></div>
  {!record && <Card className="p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl"><EditorSkeleton /></Card>}
        {record && (
          <form onSubmit={handleSave} className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="flex-1 space-y-8 min-w-0">
            <Card className="p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl space-y-8">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Basic Info</h2>
                <p className="text-xs text-gray-500 dark:text-slate-500">Update title or adjust target role to refine AI insights.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-500" /> Title</label>
                  <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required className="w-full rounded-xl border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-4 py-2.5 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2"><Target className="w-4 h-4 text-violet-500" /> Target Role</label>
                  <input value={form.targetRole} onChange={e => setForm(f=>({...f,targetRole:e.target.value}))} className="w-full rounded-xl border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-4 py-2.5 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none transition" />
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Personal / Contact Details</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Full Name</label>
                    <input value={form.fullName} onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Email</label>
                    <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} type="email" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Phone</label>
                    <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Location</label>
                    <input value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-slate-300">LinkedIn</label>
                    <input value={form.linkedin} onChange={e=>setForm(f=>({...f,linkedin:e.target.value}))} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-slate-300">GitHub</label>
                    <input value={form.github} onChange={e=>setForm(f=>({...f,github:e.target.value}))} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Portfolio</label>
                    <input value={form.portfolio} onChange={e=>setForm(f=>({...f,portfolio:e.target.value}))} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Website</label>
                    <input value={form.website} onChange={e=>setForm(f=>({...f,website:e.target.value}))} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl space-y-8">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Template</h2>
                <p className="text-xs text-gray-500 dark:text-slate-500">Select a template then Apply. Applying overwrites Summary, Experience & Skills. Undo supported.</p>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {templates.map(t => {
                  const selected = form.templateId === t.id
                  return (
                    <button type="button" key={t.id} onClick={() => setForm(f=>({...f, templateId: selected ? '' : t.id }))} className={`group relative rounded-xl border text-left p-4 bg-white/60 dark:bg-slate-700/50 backdrop-blur hover:shadow-md transition overflow-hidden ${selected ? 'border-violet-500 ring-2 ring-violet-500/40' : 'border-white/50 dark:border-slate-600/50'}`}>
                      <div className="aspect-[4/5] w-full rounded-md bg-gradient-to-br from-violet-100 to-purple-100 dark:from-slate-600 dark:to-slate-700 mb-3 flex items-center justify-center text-[11px] text-gray-500 dark:text-slate-400">{t.name}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700 dark:text-slate-200 truncate">{t.name}</span>
                        {selected && <Check className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
                      </div>
                      <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-violet-500/0 via-violet-500/60 to-violet-500/0 opacity-0 group-hover:opacity-100 transition" />
                    </button>
                  )
                })}
                {!templates.length && <div className="text-xs text-gray-500 dark:text-slate-500 col-span-full">Loading templates…</div>}
              </div>
              {activePreset && <div className="text-[11px] text-gray-500 dark:text-slate-500 flex items-start gap-1"><Info className="w-3 h-3 mt-0.5" /> {activePreset.tagline}</div>}
              <div className="flex items-center gap-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button id="apply-template-trigger" type="button" disabled={!activePreset} {...({ variant: "outline" } as any)} className="text-xs">Apply Template</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Apply Template</AlertDialogTitle>
                      <AlertDialogDescription>This will replace current section content with the template. You can undo afterwards.</AlertDialogDescription>
                    </AlertDialogHeader>
                    {activePreset && <div className="space-y-4 py-2">
                      <div className="rounded-md border border-violet-500/30 bg-violet-500/5 p-3 text-xs text-gray-600 dark:text-slate-400">
                        <p className="font-semibold mb-1">Template Snapshot</p>
                        <p className="mb-2">Summary lines: {activePreset.summary.split(/\n/).length}, Experience lines: {activePreset.experience.split(/\n/).length}, Skills lines: {activePreset.skills.split(/\n/).length}</p>
                        <p className="italic text-[11px] opacity-80">{activePreset.tagline}</p>
                      </div>
                    </div>}
                    <div className="flex justify-end gap-3">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={applyTemplate}>Apply</AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
                <Button type="button" {...({ variant: "ghost" } as any)} disabled={!undoStack.length} onClick={undoLast} className="text-xs inline-flex items-center gap-1"><Undo2 className="w-3 h-3" /> Undo</Button>
              </div>
            </Card>

            <Card className="p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl space-y-6">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Structured Content</h2>
                <p className="text-xs text-gray-500 dark:text-slate-500">Refine sections individually for better future AI optimization.</p>
              </div>
              <Tabs value={activeTab} onValueChange={(v: any)=>setActiveTab(v as any)} className="w-full">
                <TabsList aria-label="Resume sections" className="mb-4 relative flex flex-wrap h-auto gap-1 bg-white/50 dark:bg-slate-700/40 border border-white/40 dark:border-slate-600/40 rounded-xl p-1">
                  <TabsTrigger value="summary" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50">Summary</TabsTrigger>
                  <TabsTrigger value="experience" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50">Experience</TabsTrigger>
                  <TabsTrigger value="projects" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50">Projects</TabsTrigger>
                  <TabsTrigger value="education" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50">Education</TabsTrigger>
                  <TabsTrigger value="skills" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50">Skills</TabsTrigger>
                  <TabsTrigger value="certifications" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50">Certs</TabsTrigger>
                  <TabsTrigger value="achievements" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50">Achievements</TabsTrigger>
                  <TabsTrigger value="languages" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50">Languages</TabsTrigger>
                  <TabsTrigger value="publications" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50">Publications</TabsTrigger>
                  <TabsTrigger value="volunteerWork" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50">Volunteer</TabsTrigger>
                  <TabsTrigger value="interests" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50">Interests</TabsTrigger>
                  <TabsTrigger value="references" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50">References</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                    <p>2-3 line positioning snapshot.</p>
                    <button type="button" onClick={()=>appendHint('summary')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-violet-600/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600/20 transition"><Lightbulb className="w-3.5 h-3.5" /> Hint</button>
                  </div>
                  <textarea value={form.summary} onChange={e=>setForm(f=>({...f,summary:e.target.value}))} rows={4} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.summary.length} chars</p>
                </TabsContent>
                <TabsContent value="experience" className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                    <p>Metric-driven achievements.</p>
                    <button type="button" onClick={()=>appendHint('experience')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-violet-600/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600/20 transition"><Lightbulb className="w-3.5 h-3.5" /> Hint</button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    {['*','-','•','→'].map(p => (
                      <button key={p} type="button" onClick={()=>normalizeBullets(p)} className="px-2 py-1 rounded-md bg-violet-600/10 hover:bg-violet-600/20 text-violet-600 dark:text-violet-300 transition">{p} bullets</button>
                    ))}
                    <span className="text-gray-400 dark:text-slate-500 flex items-center">(Ctrl+Alt+B = *)</span>
                  </div>
                  <textarea value={form.experience} onChange={e=>setForm(f=>({...f,experience:e.target.value}))} rows={8} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none font-mono" />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.experience.length} chars</p>
                </TabsContent>
                <TabsContent value="projects" className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                    <p>Notable projects.</p>
                    <button type="button" onClick={()=>appendHint('projects')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-violet-600/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600/20 transition"><Lightbulb className="w-3.5 h-3.5" /> Hint</button>
                  </div>
                  <textarea value={form.projects} onChange={e=>setForm(f=>({...f,projects:e.target.value}))} rows={6} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none font-mono" />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.projects.length} chars</p>
                </TabsContent>
                <TabsContent value="education" className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500"><p>Education background.</p></div>
                  <textarea value={form.education} onChange={e=>setForm(f=>({...f,education:e.target.value}))} rows={5} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.education.length} chars</p>
                </TabsContent>
                <TabsContent value="certifications" className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500"><p>Certifications.</p></div>
                  <textarea value={form.certifications} onChange={e=>setForm(f=>({...f,certifications:e.target.value}))} rows={5} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.certifications.length} chars</p>
                </TabsContent>
                <TabsContent value="skills" className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                    <p>Organize by category.</p>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={()=>appendHint('skills')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-violet-600/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600/20 transition"><Lightbulb className="w-3.5 h-3.5" /> Hint</button>
                      {activePreset && <button type="button" onClick={async ()=>{
                        if (!activePreset) return
                        pushUndo()
                        try {
                          const res = await fetch('/api/ai/taxonomy', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ accent: activePreset.accent, existing: form.skills, targetRole: form.targetRole }) })
                          const data = await res.json()
                          if (data.success) {
                            const merged = data.suggestions.reduce((acc:string, line:string) => smartMerge(acc, line), form.skills)
                            setForm(f => ({ ...f, skills: smartMerge(merged, data.suggestions.join('\n')) }))
                            toast({ title: 'AI suggestions added', description: `${data.suggestions.length} taxonomy lines merged.` })
                          } else {
                            toast({ title: 'AI error', description: data.error || 'Failed to fetch suggestions.' })
                          }
                        } catch (e:any) {
                          toast({ title: 'Network error', description: e.message })
                        }
                      }} className="px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700">AI Expand</button>}
                    </div>
                  </div>
                  <textarea value={form.skills} onChange={e=>setForm(f=>({...f,skills:e.target.value}))} rows={5} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.skills.length} chars</p>
                </TabsContent>
                <TabsContent value="achievements" className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500"><p>Achievements.</p></div>
                  <textarea value={form.achievements} onChange={e=>setForm(f=>({...f,achievements:e.target.value}))} rows={5} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.achievements.length} chars</p>
                </TabsContent>
                <TabsContent value="languages" className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500"><p>Languages.</p></div>
                  <textarea value={form.languages} onChange={e=>setForm(f=>({...f,languages:e.target.value}))} rows={3} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.languages.length} chars</p>
                </TabsContent>
                <TabsContent value="publications" className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500"><p>Publications.</p></div>
                  <textarea value={form.publications} onChange={e=>setForm(f=>({...f,publications:e.target.value}))} rows={5} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.publications.length} chars</p>
                </TabsContent>
                <TabsContent value="volunteerWork" className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500"><p>Volunteer work.</p></div>
                  <textarea value={form.volunteerWork} onChange={e=>setForm(f=>({...f,volunteerWork:e.target.value}))} rows={5} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.volunteerWork.length} chars</p>
                </TabsContent>
                <TabsContent value="interests" className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500"><p>Interests.</p></div>
                  <textarea value={form.interests} onChange={e=>setForm(f=>({...f,interests:e.target.value}))} rows={3} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.interests.length} chars</p>
                </TabsContent>
                <TabsContent value="references" className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500"><p>References.</p></div>
                  <textarea value={form.references} onChange={e=>setForm(f=>({...f,references:e.target.value}))} rows={4} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.references.length} chars</p>
                </TabsContent>
              </Tabs>
              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className={`col-span-3 md:col-span-1 p-4 rounded-xl bg-gradient-to-br ${activeGradient} text-white text-xs space-y-2 shadow-inner border border-white/20`}>
                  <p className="font-semibold tracking-wide">Preview</p>
                  <div className="h-px bg-white/20" />
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {[form.summary, form.experience, form.skills].filter(Boolean).map((block, i)=>(<p key={i} className="whitespace-pre-wrap leading-relaxed text-[11px] opacity-90">{block}</p>))}
                    {!form.summary && !form.experience && !form.skills && <p className="text-white/60">Start editing or add hints to see a preview.</p>}
                  </div>
                </div>
                <div className="md:col-span-2 text-[11px] text-gray-500 dark:text-slate-500 flex flex-col justify-between gap-2">
                  <p><span className="text-violet-600 dark:text-violet-400 font-medium">Tips:</span> Quantify outcomes (%, time saved, revenue). Lead with action verbs. Align skills to target role.</p>
                  {activePreset && <p className="text-[10px] italic text-gray-400 dark:text-slate-500 flex items-start gap-1"><Info className="w-3 h-3 mt-0.5" /> {activePreset.tagline}</p>}
                  <p className="mt-auto text-right">Total chars: {(form.summary+form.experience+form.skills).length}</p>
                </div>
              </div>
            </Card>

            {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
            <div className="flex gap-3">
              <Button type="submit" disabled={saving} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-md shadow-violet-500/20 px-8">{saving ? 'Saving…' : 'Save Changes'}</Button>
              <Button type="button" {...({ variant: 'outline' } as any)} onClick={()=>router.back()} className="px-8">Cancel</Button>
            </div>
            </div>
            <aside className="w-72 hidden lg:flex flex-col gap-6 pt-14 sticky top-20 self-start max-w-full">
              <Card className={`p-5 bg-gradient-to-br ${activeGradient} text-white rounded-2xl border border-white/30 space-y-3 shadow-inner`}>
                <p className="text-sm font-semibold tracking-wide">Preview</p>
                <div className="h-px bg-white/20" />
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar text-[11px] leading-relaxed">
                  {(['summary','experience','projects','education','skills'] as const).map(key => {
                    const val = (form as any)[key]
                    if (!val) return null
                    return (
                      <div key={key} className="space-y-1">
                        <p className="uppercase tracking-wide text-[10px] font-semibold text-white/70">{key}</p>
                        <p className="whitespace-pre-wrap opacity-90 font-medium">{val.slice(0, 1200)}</p>
                      </div>
                    )
                  })}
                  {!form.summary && !form.experience && !form.projects && !form.skills && <p className="text-white/60">Start editing or add hints to see a preview.</p>}
                </div>
                <p className="text-[10px] text-white/50 text-right">Chars: {(form.summary+form.experience+form.projects+form.skills).length}</p>
              </Card>
            </aside>
          </form>
        )}
      </main>
    </div>
  )
}
