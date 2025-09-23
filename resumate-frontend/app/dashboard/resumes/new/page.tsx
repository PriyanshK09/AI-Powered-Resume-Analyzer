"use client"
import { useState, useEffect } from 'react'
// @ts-ignore
import { useRouter } from 'next/navigation'
import Header from '@/components/landing/Header'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useResumes } from '@/hooks/use-resumes'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// @ts-ignore
import { Check, Sparkles, Target, Lightbulb, Layout, Palette, Briefcase, PenTool, Info } from 'lucide-react'
import { GenerateResumeWithAI } from '@/components/ai/GenerateResumeWithAI'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import { templatePresets, skillTaxonomy, smartMerge, TemplatePreset } from '@/lib/templates'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { EditorSkeleton } from '@/components/resume/EditorSkeleton'

// Simple local hint generator (will be replaced by real AI endpoint later)
function generateHints(section: string, targetRole?: string) {
  const role = targetRole || 'the role'
  if (section === 'summary') {
    return [
      `Results-driven professional targeting ${role} with a track record of shipping high-impact features`,
      'Blend strategic thinking with hands-on execution to accelerate product goals',
      'Known for translating ambiguous problems into scalable solutions'
    ]
  }
  if (section === 'experience') {
    return [
      'Led cross-functional initiative that increased deployment frequency 40%',
      'Optimized critical service reducing P99 latency from 820ms to 240ms',
      'Mentored 4 junior engineers accelerating onboarding by 30%'
    ]
  }
  if (section === 'projects') {
    return [
      'Built full-stack e-commerce platform serving 10k+ users with 99.9% uptime',
      'Developed ML recommendation engine increasing user engagement by 35%',
      'Created automated CI/CD pipeline reducing deployment time from 2hrs to 15min'
    ]
  }
  if (section === 'skills') {
    return [
      'Architecture: Event-driven, Microservices, Distributed Systems',
      'Core: TypeScript, Node.js, React, MongoDB, PostgreSQL',
      'Practices: TDD, CI/CD, Observability, Performance Tuning'
    ]
  }
  return []
}

export default function NewResumePage() {
  const router = useRouter()
  const { user } = useCurrentUser()
  const { create } = useResumes()
  const [darkMode, setDarkMode] = useState<boolean>(() => typeof window !== 'undefined' && document.documentElement.classList.contains('dark'))
  const [scrollY, setScrollY] = useState(0)
  const [form, setForm] = useState({
    title: '', targetRole: '', templateId: '', 
    fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', website: '',
    summary: '', experience: '', projects: '', education: '', certifications: '', skills: '', 
    achievements: '', languages: '', publications: '', volunteerWork: '', interests: '', references: ''
  })
  const [templates, setTemplates] = useState<{ id: string; name: string; category?: string; accent?: string }[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'summary'|'experience'|'projects'|'education'|'certifications'|'skills'|'achievements'|'languages'|'publications'|'volunteerWork'|'interests'|'references'>('summary')
  const [applyModeOpen, setApplyModeOpen] = useState(false)
  const [aiContext, setAIContext] = useState<any>(null)
  const [sectionLoading, setSectionLoading] = useState<string>('')

  async function regenerateSection(section: string) {
    if (sectionLoading) return
    setSectionLoading(section)
    try {
      const res = await fetch('/api/ai/generate-section', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ section, context: aiContext, targetRole: form.targetRole, current: (form as any)[section] || '' }) })
      const data = await res.json()
      if (!data.success) {
        toast({ title: 'AI rewrite failed', description: data.error || 'Unknown error', variant: 'destructive' })
      } else {
        const key = section as keyof typeof form
        setForm(f=>({ ...f, [key]: data.content }))
        toast({ title: 'Section regenerated', description: 'Review & verify the updated content.' })
      }
    } catch(e:any) {
      toast({ title: 'Network error', description: e.message, variant: 'destructive' })
    } finally { setSectionLoading('') }
  }

  function mergeAIData(data: any) {
    setForm(f=>({
      ...f,
      summary: data.summary ?? f.summary,
      experience: data.experience ?? f.experience,
      projects: data.projects ?? f.projects,
      education: data.education ?? f.education,
      certifications: data.certifications ?? f.certifications,
      skills: data.skills ?? f.skills,
      achievements: data.achievements ?? f.achievements,
      languages: data.languages ?? f.languages,
      volunteerWork: data.volunteerWork ?? f.volunteerWork,
      interests: data.interests ?? f.interests,
      references: data.references ?? f.references,
    }))
  }

  function appendHint(section: 'summary'|'experience'|'projects'|'skills') {
    const hints = generateHints(section, form.targetRole)
    if (!hints.length) return
    setForm(f => {
      const key = section
      const existing = f[key]
      const toAdd = hints[Math.floor(Math.random()*hints.length)]
      return { ...f, [key]: existing ? existing + (existing.endsWith('\n') ? '' : '\n') + toAdd : toAdd }
    })
    toast({ title: 'Suggestion added', description: `${section.charAt(0).toUpperCase()+section.slice(1)} hint inserted.` })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setError(null)
    try {
      setLoading(true)
      // Combine structured fields into raw content for backward compatibility
      const combinedContent = [form.summary, form.experience, form.skills].filter(Boolean).join('\n\n') || 'Draft content'
      await create({
        title: form.title,
        content: combinedContent,
        targetRole: form.targetRole || undefined,
        templateId: form.templateId || undefined,
        summary: form.summary || undefined,
        experience: form.experience || undefined,
        projects: form.projects || undefined,
        education: form.education || undefined,
        certifications: form.certifications || undefined,
        skills: form.skills || undefined,
        achievements: form.achievements || undefined,
        languages: form.languages || undefined,
        publications: form.publications || undefined,
        volunteerWork: form.volunteerWork || undefined,
        interests: form.interests || undefined,
        references: form.references || undefined,
        fullName: form.fullName || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        location: form.location || undefined,
        linkedin: form.linkedin || undefined,
        github: form.github || undefined,
        portfolio: form.portfolio || undefined,
        website: form.website || undefined,
      })
      router.push('/dashboard')
    } catch (e: any) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  useEffect(() => {
    setTemplatesLoading(true)
    fetch('/api/templates')
      .then(r=>r.json())
      .then(d=>{ if(d.success) setTemplates(d.templates) })
      .catch(()=>{})
      .finally(()=> setTemplatesLoading(false))
  }, [])


  const templateIcon = (id: string) => {
    if (id.includes('modern')) return <Layout className="w-4 h-4" />
    if (id.includes('minimal')) return <Palette className="w-4 h-4" />
    if (id.includes('executive')) return <Briefcase className="w-4 h-4" />
    if (id.includes('creative')) return <PenTool className="w-4 h-4" />
    return <Layout className="w-4 h-4" />
  }


  const activePreset: TemplatePreset | undefined = form.templateId ? templatePresets[form.templateId] : undefined

  // (smartMerge imported for taxonomy suggestions & future AI expansion)

  // Keep dark mode class in sync when toggled from Header (emits resumate-theme-change)
  useEffect(() => {
    try {
      if (darkMode) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    } catch {}
  }, [darkMode])
  useEffect(() => {
    function onTheme(e: any) { if (typeof e?.detail?.dark === 'boolean') setDarkMode(e.detail.dark) }
    window.addEventListener('resumate-theme-change', onTheme)
    return () => window.removeEventListener('resumate-theme-change', onTheme)
  }, [])

  // Removed auto-prefill: user now explicitly applies template via confirmation modal for consistency.

  function applyTemplate() {
    if (!form.templateId) return
    const preset = templatePresets[form.templateId]
    if (!preset) return
    setForm(f => ({ ...f, summary: preset.summary, experience: preset.experience, skills: preset.skills }))
    toast({ title: 'Template applied', description: 'Sections populated with template content.' })
    setApplyModeOpen(false)
  }

  const activeGradient = activePreset?.gradient || 'from-violet-600/90 to-purple-600/90'

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="relative z-30"><Header darkMode={darkMode} setDarkMode={setDarkMode} scrollY={scrollY} /></div>
      <main className="pt-24 pb-16 max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-start gap-6 lg:gap-10 max-w-full">
          <div className="flex-1 space-y-8 min-w-0">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">New Resume</h1>
              <div className="hidden md:flex gap-2 items-center">
                <GenerateResumeWithAI onApply={mergeAIData} onContext={setAIContext} size="sm" />
                <Button type="button" {...({ variant: "outline", size: "sm" } as any)} onClick={()=>router.back()}>Cancel</Button>
                <Button onClick={handleSubmit as any} disabled={loading} {...({ size: "sm" } as any)} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-md shadow-violet-500/20">{loading ? 'Creating…' : 'Create'}</Button>
              </div>
            </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {templatesLoading && !templates.length && (
            <Card className="p-6 bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/40 rounded-2xl">
              <EditorSkeleton />
            </Card>
          )}
          {/* Mobile horizontal template picker (no negative margins to avoid page overflow) */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-2 px-0">
              <h2 className="text-xs font-semibold tracking-wide text-violet-700 dark:text-violet-300 uppercase">Templates</h2>
              <span className="text-[10px] text-gray-500 dark:text-slate-500">{templates.length || 0}</span>
            </div>
            <div
              className="flex gap-3 overflow-x-auto pb-2 pr-1 snap-x snap-mandatory scrollbar-thin [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-violet-500/30 hover:[&::-webkit-scrollbar-thumb]:bg-violet-500/50 scrollbar-thumb-rounded-full"
              aria-label="Template selector"
            >
              {templatesLoading && Array.from({length:4}).map((_,i)=>(
                <div key={i} className="w-40 flex-shrink-0 h-20 rounded-xl bg-white/50 dark:bg-slate-700/50 animate-pulse border border-white/40 dark:border-slate-600/40" />
              ))}
              {!templatesLoading && templates.map(t => {
                const selected = form.templateId === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={()=>setForm(f=>({...f,templateId:selected?'':t.id}))}
                    className={`w-40 flex-shrink-0 rounded-xl p-3 text-left border flex flex-col justify-between bg-white/70 dark:bg-slate-800/60 backdrop-blur transition relative snap-start ${selected ? 'border-violet-500 ring-2 ring-violet-500/30' : 'border-white/40 dark:border-slate-600/40'}`}
                  >
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-slate-200">
                      <span className="p-2 rounded-md bg-gradient-to-br from-violet-100 to-purple-100 dark:from-slate-600 dark:to-slate-700 text-violet-600 dark:text-violet-300">{templateIcon(t.id)}</span>
                      <span className="truncate">{t.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">{t.category}</span>
                    {selected && <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 absolute top-2 right-2" />}
                  </button>
                )
              })}
            </div>
            {activePreset && <p className="mt-2 text-[10px] leading-relaxed text-gray-500 dark:text-slate-500 italic">{activePreset.tagline}</p>}
          </div>
          <Card className="p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl space-y-8 max-w-full overflow-hidden">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Basic Info</h2>
              <p className="text-xs text-gray-500 dark:text-slate-500">Give your resume a clear, searchable title and specify the role you are targeting.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2"><Sparkles className="w-4 h-4 text-violet-500" /> Title</label>
                <div className="relative">
                  <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} required placeholder="e.g. Senior Backend Engineer" className="peer w-full rounded-xl border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-4 py-2.5 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none transition" />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wide">Title</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2"><Target className="w-4 h-4 text-violet-500" /> Target Role <span className="text-xs font-normal text-gray-400 dark:text-slate-500">(optional)</span></label>
                <input value={form.targetRole} onChange={e => setForm(f=>({...f,targetRole:e.target.value}))} placeholder="e.g. Staff Platform Engineer" className="w-full rounded-xl border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-4 py-2.5 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none transition" />
              </div>
            </div>
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Personal / Contact Details <span className="text-gray-400 dark:text-slate-500 normal-case font-normal">(improves recruiter context)</span></h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Full Name</label>
                  <input value={form.fullName} onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} placeholder="Jane Doe" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Email</label>
                  <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="name@example.com" type="email" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Phone</label>
                  <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+1 555 123 4567" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Location</label>
                  <input value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="City, Country" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-slate-300">LinkedIn</label>
                  <input value={form.linkedin} onChange={e=>setForm(f=>({...f,linkedin:e.target.value}))} placeholder="https://linkedin.com/in/username" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-slate-300">GitHub</label>
                  <input value={form.github} onChange={e=>setForm(f=>({...f,github:e.target.value}))} placeholder="https://github.com/username" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                </div>
                <div className="space-y-1 md:col-span-3">
                  <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Portfolio / Website</label>
                  <input value={form.website} onChange={e=>setForm(f=>({...f,website:e.target.value}))} placeholder="https://yourdomain.dev" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                </div>
              </div>
            </div>
          </Card>

          {/* Template selection moved to sidebar */}

          <Card className="p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl space-y-6 max-w-full overflow-hidden">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Structured Content</h2>
              <p className="text-xs text-gray-500 dark:text-slate-500">Organize your resume into clear sections. Inline AI hints can help you brainstorm strong bullet points.</p>
              <div className="pt-2">
                <GenerateResumeWithAI onApply={mergeAIData} onContext={setAIContext} size="sm" />
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={(v)=> setActiveTab(v as any)} className="w-full">
              {/* Two-row grid (6 x 2) to display all section tabs without scrolling */}
              <TabsList aria-label="Resume sections" className="mb-4 relative flex flex-wrap h-auto gap-1 bg-white/50 dark:bg-slate-700/40 border border-white/40 dark:border-slate-600/40 rounded-xl p-1">
                <TabsTrigger value="summary" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition">Summary</TabsTrigger>
                <TabsTrigger value="experience" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition">Experience</TabsTrigger>
                <TabsTrigger value="projects" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition">Projects</TabsTrigger>
                <TabsTrigger value="education" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition">Education</TabsTrigger>
                <TabsTrigger value="skills" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition">Skills</TabsTrigger>
                <TabsTrigger value="certifications" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition">Certs</TabsTrigger>
                <TabsTrigger value="achievements" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition">Achievements</TabsTrigger>
                <TabsTrigger value="languages" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition">Languages</TabsTrigger>
                <TabsTrigger value="publications" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition">Publications</TabsTrigger>
                <TabsTrigger value="volunteerWork" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition">Volunteer</TabsTrigger>
                <TabsTrigger value="interests" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition">Interests</TabsTrigger>
                <TabsTrigger value="references" className="text-center data-[state=active]:bg-violet-600 data-[state=active]:text-white text-[11px] leading-tight py-2 px-2 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 transition">References</TabsTrigger>
              </TabsList>

              {/* Tab Contents */}
              <TabsContent value="summary" className="space-y-3 focus:outline-none">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                  <p>2-3 line professional snapshot highlighting your value proposition</p>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={()=>appendHint('summary')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-violet-600/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600/20 transition"><Lightbulb className="w-3.5 h-3.5" /> Hint</button>
                    {aiContext && <button type="button" disabled={sectionLoading==='summary'} onClick={()=>regenerateSection('summary')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-50">{sectionLoading==='summary' ? 'AI…' : 'AI Rewrite'}</button>}
                  </div>
                </div>
                <textarea value={form.summary} onChange={e=>setForm(f=>({...f,summary:e.target.value}))} rows={4} placeholder="Experienced software engineer with 5+ years building scalable web applications..." className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.summary.length} chars</p>
              </TabsContent>

              <TabsContent value="experience" className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                  <p>Professional work experience with metric-driven bullet points</p>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={()=>appendHint('experience')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-violet-600/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600/20 transition"><Lightbulb className="w-3.5 h-3.5" /> Hint</button>
                    {aiContext && <button type="button" disabled={sectionLoading==='experience'} onClick={()=>regenerateSection('experience')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-50">{sectionLoading==='experience' ? 'AI…' : 'AI Rewrite'}</button>}
                  </div>
                </div>
                <textarea value={form.experience} onChange={e=>setForm(f=>({...f,experience:e.target.value}))} rows={8} placeholder="Senior Software Engineer | TechCorp | 2021-Present&#10;- Led migration of legacy system reducing downtime by 85%&#10;- Optimized database queries improving performance by 40%" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none font-mono" />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.experience.length} chars</p>
              </TabsContent>

              <TabsContent value="projects" className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                  <p>Notable projects that demonstrate your skills and impact</p>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={()=>appendHint('projects')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-violet-600/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600/20 transition"><Lightbulb className="w-3.5 h-3.5" /> Hint</button>
                    {aiContext && <button type="button" disabled={sectionLoading==='projects'} onClick={()=>regenerateSection('projects')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-50">{sectionLoading==='projects' ? 'AI…' : 'AI Rewrite'}</button>}
                  </div>
                </div>
                <textarea value={form.projects} onChange={e=>setForm(f=>({...f,projects:e.target.value}))} rows={6} placeholder="E-Commerce Platform Redesign | 2023&#10;- Built responsive React frontend with 99.9% uptime&#10;- Implemented payment gateway increasing conversions by 23%&#10;&#10;AI Resume Analyzer | Personal Project | 2023&#10;- Developed ML model for resume scoring using Python/TensorFlow" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none font-mono" />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.projects.length} chars</p>
              </TabsContent>

              <TabsContent value="education" className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                  <p>Educational background including degrees, institutions, and relevant coursework</p>
                  {aiContext && <button type="button" disabled={sectionLoading==='education'} onClick={()=>regenerateSection('education')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-50">{sectionLoading==='education' ? 'AI…' : 'AI Rewrite'}</button>}
                </div>
                <textarea value={form.education} onChange={e=>setForm(f=>({...f,education:e.target.value}))} rows={5} placeholder="Bachelor of Science in Computer Science | State University | 2020&#10;- Magna Cum Laude, GPA: 3.8/4.0&#10;- Relevant Coursework: Data Structures, Algorithms, Software Engineering&#10;&#10;Master of Science in Software Engineering | Tech Institute | 2022&#10;- Specialized in Machine Learning and Distributed Systems" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.education.length} chars</p>
              </TabsContent>

              <TabsContent value="certifications" className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                  <p>Professional certifications and licenses relevant to your field</p>
                  {aiContext && <button type="button" disabled={sectionLoading==='certifications'} onClick={()=>regenerateSection('certifications')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-50">{sectionLoading==='certifications' ? 'AI…' : 'AI Rewrite'}</button>}
                </div>
                <textarea value={form.certifications} onChange={e=>setForm(f=>({...f,certifications:e.target.value}))} rows={5} placeholder="AWS Certified Solutions Architect - Professional | 2023&#10;Google Cloud Professional Developer | 2022&#10;Certified Kubernetes Administrator (CKA) | 2023&#10;Scrum Master Certification (CSM) | 2021" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.certifications.length} chars</p>
              </TabsContent>

              <TabsContent value="skills" className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                  <p>Technical and soft skills organized by category</p>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={()=>appendHint('skills')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-violet-600/10 text-violet-600 dark:text-violet-400 hover:bg-violet-600/20 transition"><Lightbulb className="w-3.5 h-3.5" /> Hint</button>
                    {aiContext && <button type="button" disabled={sectionLoading==='skills'} onClick={()=>regenerateSection('skills')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-50">{sectionLoading==='skills' ? 'AI…' : 'AI Rewrite'}</button>}
                  </div>
                </div>
                <textarea value={form.skills} onChange={e=>setForm(f=>({...f,skills:e.target.value}))} rows={5} placeholder="Programming Languages: JavaScript, Python, TypeScript, Java&#10;Frontend: React, Next.js, Vue.js, Tailwind CSS&#10;Backend: Node.js, Express, Django, FastAPI&#10;Databases: PostgreSQL, MongoDB, Redis&#10;Cloud: AWS, Google Cloud, Docker, Kubernetes" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                {activePreset && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-1"><Info className="w-3 h-3" /> Taxonomy suggestions ({activePreset.accent})</p>
                    <div className="flex flex-wrap gap-2">
                      {(skillTaxonomy[activePreset.accent] || []).map(s => (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, skills: smartMerge(f.skills, s.lines.join('\n')) }))}
                          className="px-2 py-1 rounded-md bg-violet-600/10 dark:bg-slate-600/40 text-[10px] text-violet-600 dark:text-violet-300 hover:bg-violet-600/20 transition"
                        >{s.label}</button>
                      ))}
                      {!!(skillTaxonomy[activePreset.accent]?.length) && <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, skills: smartMerge(f.skills, (skillTaxonomy[activePreset.accent]||[]).map(t => t.lines[0]).join('\n')) }))}
                        className="px-2 py-1 rounded-md bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] hover:from-violet-700 hover:to-purple-700"
                      >Insert Skeleton</button>}
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.skills.length} chars</p>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                  <p>Awards, recognitions, and notable accomplishments</p>
                  {aiContext && <button type="button" disabled={sectionLoading==='achievements'} onClick={()=>regenerateSection('achievements')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-50">{sectionLoading==='achievements' ? 'AI…' : 'AI Rewrite'}</button>}
                </div>
                <textarea value={form.achievements} onChange={e=>setForm(f=>({...f,achievements:e.target.value}))} rows={5} placeholder="Employee of the Year | TechCorp | 2023&#10;Best Innovation Award for AI Project | 2022&#10;Dean's List | State University | 2018-2020&#10;Hackathon Winner | National Coding Challenge | 2021&#10;Patent: 'Method for Optimizing Database Queries' | Pending" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.achievements.length} chars</p>
              </TabsContent>

              <TabsContent value="languages" className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                  <p>Languages you speak and your proficiency level</p>
                  {aiContext && <button type="button" disabled={sectionLoading==='languages'} onClick={()=>regenerateSection('languages')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-50">{sectionLoading==='languages' ? 'AI…' : 'AI Rewrite'}</button>}
                </div>
                <textarea value={form.languages} onChange={e=>setForm(f=>({...f,languages:e.target.value}))} rows={3} placeholder="English: Native&#10;Spanish: Professional working proficiency&#10;French: Conversational&#10;Mandarin: Basic" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.languages.length} chars</p>
              </TabsContent>

              <TabsContent value="publications" className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                  <p>Research papers, articles, and other published work</p>
                  {aiContext && <button type="button" disabled={sectionLoading==='publications'} onClick={()=>regenerateSection('publications')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-50">{sectionLoading==='publications' ? 'AI…' : 'AI Rewrite'}</button>}
                </div>
                <textarea value={form.publications} onChange={e=>setForm(f=>({...f,publications:e.target.value}))} rows={5} placeholder="'Machine Learning Approaches to Resume Analysis' | IEEE Conference on AI | 2023&#10;'Optimizing Web Performance with Modern JavaScript' | Tech Blog | 2022&#10;'Building Scalable Microservices' | Medium | 2023 | 15k+ views&#10;Patent Application: 'Automated Code Review System' | USPTO | 2023" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.publications.length} chars</p>
              </TabsContent>

              <TabsContent value="volunteerWork" className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                  <p>Volunteer experience and community involvement</p>
                  {aiContext && <button type="button" disabled={sectionLoading==='volunteerWork'} onClick={()=>regenerateSection('volunteerWork')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-50">{sectionLoading==='volunteerWork' ? 'AI…' : 'AI Rewrite'}</button>}
                </div>
                <textarea value={form.volunteerWork} onChange={e=>setForm(f=>({...f,volunteerWork:e.target.value}))} rows={5} placeholder="Code Mentor | CodePath | 2022-Present&#10;- Mentoring 20+ students in technical interview preparation&#10;- Increased mentee success rate by 75%&#10;&#10;Tech Workshop Instructor | Local Community Center | 2021-Present&#10;- Teaching basic programming to underserved youth&#10;- Organized 15+ workshops reaching 200+ participants" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.volunteerWork.length} chars</p>
              </TabsContent>

              <TabsContent value="interests" className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                  <p>Personal interests and hobbies (keep professional)</p>
                  {aiContext && <button type="button" disabled={sectionLoading==='interests'} onClick={()=>regenerateSection('interests')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-50">{sectionLoading==='interests' ? 'AI…' : 'AI Rewrite'}</button>}
                </div>
                <textarea value={form.interests} onChange={e=>setForm(f=>({...f,interests:e.target.value}))} rows={3} placeholder="Technology Innovation, Open Source Contributing, Chess, Rock Climbing, Photography, Sustainable Technology, AI Ethics, Startup Mentoring" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.interests.length} chars</p>
              </TabsContent>

              <TabsContent value="references" className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-slate-500">
                  <p>Professional references (or 'Available upon request')</p>
                  {aiContext && <button type="button" disabled={sectionLoading==='references'} onClick={()=>regenerateSection('references')} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-gradient-to-r from-violet-600 to-purple-600 text-white disabled:opacity-50">{sectionLoading==='references' ? 'AI…' : 'AI Rewrite'}</button>}
                </div>
                <textarea value={form.references} onChange={e=>setForm(f=>({...f,references:e.target.value}))} rows={4} placeholder="Available upon request&#10;&#10;Or include specific references:&#10;John Smith | Senior Engineering Manager | TechCorp | john.smith@techcorp.com | (555) 123-4567&#10;Jane Doe | Product Director | StartupXYZ | jane.doe@startupxyz.com | (555) 987-6543" className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
                <p className="text-[10px] text-gray-400 dark:text-slate-500 text-right">{form.references.length} chars</p>
              </TabsContent>
            </Tabs>
            <div className="grid md:grid-cols-3 gap-4 pt-4">
              <div className={`col-span-3 md:col-span-1 p-4 rounded-xl bg-gradient-to-br ${activeGradient} text-white text-xs space-y-2 shadow-inner border border-white/20 relative`}>
                {/* Merge / Replace controls removed for simplified apply flow */}
                <p className="font-semibold tracking-wide">Preview</p>
                <div className="h-px bg-white/20" />
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {[form.summary, form.experience, form.skills].filter(Boolean).map((block, i)=>(<p key={i} className="whitespace-pre-wrap leading-relaxed text-[11px] opacity-90">{block}</p>))}
                  {!form.summary && !form.experience && !form.skills && <p className="text-white/60">Start writing or insert hints to see a preview.</p>}
                </div>
              </div>
              <div className="md:col-span-2 text-[11px] text-gray-500 dark:text-slate-500 flex flex-col justify-between gap-2">
                <p><span className="text-violet-600 dark:text-violet-400 font-medium">Tips:</span> Start bullets with strong verbs (Led, Optimized, Built). Quantify impact (% latency reduction, revenue, adoption). Keep lines concise.</p>
                {activePreset && <p className="text-[10px] italic text-gray-400 dark:text-slate-500 flex items-start gap-1"><Info className="w-3 h-3 mt-0.5" /> {activePreset.tagline}</p>}
                <p className="mt-auto text-right">Total chars: {(form.summary+form.experience+form.skills).length}</p>
              </div>
            </div>
          </Card>

          {error && <p className="text-sm text-red-500" role="alert">{error}</p>}
          <div className="md:hidden flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 shadow-md shadow-violet-500/20">{loading ? 'Creating…' : 'Create Resume'}</Button>
            <Button type="button" {...({ variant: "outline" } as any)} onClick={()=>router.back()} className="flex-1">Cancel</Button>
          </div>
        </form>
          </div>
          <aside className="w-72 hidden lg:flex flex-col gap-6 pt-14 sticky top-20 self-start max-w-full">
            <Card className="p-5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold tracking-wide text-violet-700 dark:text-violet-300 uppercase">Templates</h2>
                <span className="text-[10px] text-gray-500 dark:text-slate-500">{templates.length || 0}</span>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar" aria-label="Template selector">
                {templatesLoading && Array.from({length:5}).map((_,i)=>(
                  <div key={i} className="h-14 rounded-lg border border-white/40 dark:border-slate-600/40 bg-white/60 dark:bg-slate-700/50 animate-pulse" />
                ))}
                {!templatesLoading && templates.map(t => {
                  const selected = form.templateId === t.id
                  return (
                    <button key={t.id} type="button" onClick={()=>setForm(f=>({...f,templateId:selected?'':t.id}))} className={`w-full group flex items-center gap-3 rounded-lg border px-3 py-2 text-left text-xs transition bg-white/60 dark:bg-slate-700/50 hover:shadow-sm ${selected ? 'border-violet-500 ring-1 ring-violet-500/40' : 'border-white/50 dark:border-slate-600/50'}`}> 
                      <span className="p-2 rounded-md bg-gradient-to-br from-violet-100 to-purple-100 dark:from-slate-600 dark:to-slate-700 text-violet-600 dark:text-violet-300">{templateIcon(t.id)}</span>
                      <div className="flex-1">
                        <p className="font-medium text-[11px] text-gray-700 dark:text-slate-200 truncate">{t.name}</p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">{t.category || 'Theme'}</p>
                      </div>
                      {selected && <Check className="w-4 h-4 text-violet-600 dark:text-violet-400" />}
                    </button>
                  )
                })}
                {!templatesLoading && !templates.length && <p className="text-[11px] text-gray-500 dark:text-slate-500">No templates</p>}
              </div>
              {form.templateId && <div className="mt-4 space-y-2">
                <AlertDialog open={applyModeOpen} onOpenChange={setApplyModeOpen}>
                  <AlertDialogTrigger asChild>
                    <Button type="button" {...({ size: "sm" } as any)} className="w-full text-xs bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">Apply Template</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Apply Template</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will overwrite current Summary, Experience and Skills with the template content. You can still edit afterwards.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    {activePreset && <div className="rounded-md border border-violet-500/30 bg-violet-500/5 p-3 text-xs text-gray-600 dark:text-slate-400">
                      <p className="font-semibold mb-1">Template Snapshot</p>
                      <p className="mb-2">Summary lines: {activePreset.summary.split(/\n/).length}, Experience lines: {activePreset.experience.split(/\n/).length}, Skills lines: {activePreset.skills.split(/\n/).length}</p>
                      <p className="italic text-[11px] opacity-80">{activePreset.tagline}</p>
                    </div>}
                    <div className="flex justify-end gap-3 pt-2">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={applyTemplate}>Apply</AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
                {activePreset && <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-relaxed">{activePreset.tagline}</p>}
              </div>}
            </Card>
            <Card className={`p-5 bg-gradient-to-br ${activeGradient} text-white rounded-2xl border border-white/30 space-y-3 shadow-inner`}>
              <h3 className="text-xs font-semibold tracking-wide uppercase">Preview</h3>
              <div className="h-px bg-white/20" />
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 custom-scrollbar text-[11px]">
                {[
                  form.summary && {title: 'Summary', content: form.summary},
                  form.experience && {title: 'Experience', content: form.experience},
                  form.projects && {title: 'Projects', content: form.projects},
                  form.education && {title: 'Education', content: form.education},
                  form.skills && {title: 'Skills', content: form.skills},
                  form.certifications && {title: 'Certifications', content: form.certifications}
                ].filter(Boolean).map((block,i)=>(
                  <div key={i} className="space-y-1">
                    <p className="text-white/80 font-medium text-[10px] uppercase tracking-wide">{(block as any).title}</p>
                    <p className="whitespace-pre-wrap leading-relaxed opacity-90">{(block as any).content}</p>
                  </div>
                ))}
                {!form.summary && !form.experience && !form.projects && !form.education && !form.skills && !form.certifications && <p className="text-white/60">Draft sections to see a live preview.</p>}
              </div>
            </Card>
            <Card className="p-5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-2xl space-y-4">
              <h3 className="text-xs font-semibold tracking-wide text-violet-700 dark:text-violet-300 uppercase">Progress</h3>
              <ul className="space-y-2 text-[11px]">
                {[
                  {label: 'Title', condition: form.title.trim()},
                  {label: 'Summary', condition: form.summary.trim()},
                  {label: 'Experience', condition: form.experience.trim()},
                  {label: 'Projects', condition: form.projects.trim()},
                  {label: 'Education', condition: form.education.trim()},
                  {label: 'Skills', condition: form.skills.trim()},
                  {label: 'Certifications', condition: form.certifications.trim()}
                ].map(({label, condition}) => (
                    <li key={label} className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${condition ? 'bg-violet-500' : 'bg-gray-300 dark:bg-slate-600'}`}></span>
                      <span className={condition ? 'text-gray-600 dark:text-slate-400 line-through' : 'text-gray-700 dark:text-slate-300'}>{label}</span>
                    </li>
                  )
                )}
              </ul>
              <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all" style={{width: `${([
                  form.title.trim(),
                  form.summary.trim(),
                  form.experience.trim(),
                  form.projects.trim(),
                  form.education.trim(),
                  form.skills.trim(),
                  form.certifications.trim()
                ].filter(Boolean).length/7)*100}%`}} />
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
}
