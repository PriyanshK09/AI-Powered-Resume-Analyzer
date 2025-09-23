"use client"
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Lightbulb, Loader2, Sparkles } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export interface AIQuestionnaireContext {
  role?: string
  yearsExperience?: string
  seniority?: string
  industry?: string
  topSkills?: string
  techStack?: string
  keyAchievements?: string
  educationSummary?: string
  certifications?: string
  languages?: string
  volunteering?: string
  interests?: string
  tone?: string
}

interface Props {
  onApply: (data: Partial<Record<string,string>>) => void
  onContext?: (ctx: AIQuestionnaireContext) => void
  size?: 'sm' | 'default'
  variant?: any
}

export function GenerateResumeWithAI({ onApply, onContext, size='default', variant }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAllSkills, setShowAllSkills] = useState(false)
  const [form, setForm] = useState<AIQuestionnaireContext>({
    role: '',
    yearsExperience: '',
    seniority: 'mid',
    industry: '',
    topSkills: '',
    techStack: '',
    keyAchievements: '',
    educationSummary: '',
    certifications: '',
    languages: '',
    volunteering: '',
    interests: '',
    tone: 'impactful'
  })

  function emitContext() { onContext?.(form) }

  async function handleGenerate() {
    setLoading(true)
    try {
      const payload = {
        role: form.role || undefined,
        yearsExperience: form.yearsExperience ? Number(form.yearsExperience) : undefined,
        seniority: form.seniority || undefined,
        industry: form.industry || undefined,
        topSkills: form.topSkills || undefined,
        techStack: form.techStack || undefined,
        keyAchievements: form.keyAchievements || undefined,
        educationSummary: form.educationSummary || undefined,
        certifications: form.certifications || undefined,
        languages: form.languages || undefined,
        volunteering: form.volunteering || undefined,
        interests: form.interests || undefined,
        tone: form.tone as any
      }
      const res = await fetch('/api/ai/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!data.success) {
        toast({ title: 'AI generation failed', description: data.error || 'Unknown error', variant: 'destructive' })
      } else {
        onApply(data.data || {})
        emitContext()
        toast({ title: 'AI draft ready', description: 'Draft generated. Review & verify every claim for accuracy.' })
        setOpen(false)
      }
    } catch (e:any) {
      toast({ title: 'Network error', description: e.message, variant: 'destructive' })
    } finally { setLoading(false) }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size={size as any} variant={variant} className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700">
          <Sparkles className="w-4 h-4" /> Write with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-[95vw] left-1/2 -translate-x-1/2 top-2 sm:top-[45px] translate-y-0 p-0 flex flex-col sm:rounded-xl max-h-[calc(100vh-16px)] sm:max-h-[calc(100vh-90px)] overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600/90 to-purple-600/90 px-4 sm:px-6 py-3 sm:py-4 text-white flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
              <Lightbulb className="w-4 h-4" /> Intelligent Resume Draft
            </DialogTitle>
            <DialogDescription className="text-violet-100/90 text-xs sm:text-sm">
              Provide concise inputs. We'll create structured bullet-style drafts you can refine.
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-6">
            {/* Left Column - Core Details */}
            <div className="space-y-4 sm:space-y-5">
              <section className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400 flex items-center gap-2">
                  Role & Scope <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                </h4>
                <div className="space-y-3">
                  <Field label="Target Role / Title" value={form.role||''} onChange={v=>setForm(f=>({...f, role:v}))} placeholder="e.g. Senior Backend Engineer" />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Years Experience" value={form.yearsExperience||''} onChange={v=>setForm(f=>({...f, yearsExperience:v}))} placeholder="7" type="number" />
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-gray-600 dark:text-slate-300">Seniority</label>
                      <select value={form.seniority} onChange={e=>setForm(f=>({...f, seniority:e.target.value}))} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-xs focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none">
                        <option value="junior">Junior</option>
                        <option value="mid">Mid</option>
                        <option value="senior">Senior</option>
                        <option value="lead">Lead</option>
                        <option value="staff">Staff</option>
                        <option value="principal">Principal</option>
                      </select>
                    </div>
                  </div>
                  <Field label="Industry / Domain" value={form.industry||''} onChange={v=>setForm(f=>({...f, industry:v}))} placeholder="FinTech, Healthcare, SaaS" />
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">Skills & Stack</h4>
                <Field label="Top Skills (comma separated)" value={form.topSkills||''} onChange={v=>{ setForm(f=>({...f, topSkills:v})); setShowAllSkills(false); }} placeholder="Distributed Systems, API Design, AWS, Mentorship" />
                {form.topSkills && (()=>{
                  const skills = form.topSkills.split(/[,;]/).map(s=>s.trim()).filter(Boolean).slice(0,120)
                  const visible = showAllSkills ? skills : skills.slice(0,12)
                  return (
                    <div className="flex flex-wrap gap-1">
                      {visible.map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded-md bg-violet-600/10 text-[9px] text-violet-700 dark:text-violet-300 border border-violet-500/30 whitespace-nowrap">
                          {skill}
                        </span>
                      ))}
                      {skills.length > 12 && (
                        <button
                          type="button"
                          onClick={()=>setShowAllSkills(s=>!s)}
                          className="px-2 py-0.5 rounded-md border border-violet-500/30 text-[9px] font-medium bg-violet-600/5 text-violet-500 hover:bg-violet-600/10 transition"
                        >
                          {showAllSkills ? 'Show Less' : `+${skills.length-12} More`}
                        </button>
                      )}
                    </div>
                  )
                })()}
                <Field label="Core Tech Stack" value={form.techStack||''} onChange={v=>setForm(f=>({...f, techStack:v}))} placeholder="Node.js, TypeScript, PostgreSQL, Kubernetes" />
              </section>

              <section className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">Impact & Achievements</h4>
                <Field label="Key Achievements (bullet style)" value={form.keyAchievements||''} onChange={v=>setForm(f=>({...f, keyAchievements:v}))} placeholder="Reduced latency 60%; Led migration saving $50k/yr; Mentored 4 engineers" textarea rows={3} />
              </section>
            </div>

            {/* Right Column - Background & Preferences */}
            <div className="space-y-4 sm:space-y-5">
              <section className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">Education & Background</h4>
                <Field label="Education Summary" value={form.educationSummary||''} onChange={v=>setForm(f=>({...f, educationSummary:v}))} placeholder="BSc Computer Science; MS Software Engineering; GPA 3.8" />
                <div className="grid grid-cols-1 gap-3">
                  <Field label="Certifications" value={form.certifications||''} onChange={v=>setForm(f=>({...f, certifications:v}))} placeholder="AWS SA Pro, CKA, GCP Dev" />
                  <Field label="Languages" value={form.languages||''} onChange={v=>setForm(f=>({...f, languages:v}))} placeholder="English (Native), Spanish (Professional)" />
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">Personal Elements</h4>
                <div className="grid grid-cols-1 gap-3">
                  <Field label="Volunteering" value={form.volunteering||''} onChange={v=>setForm(f=>({...f, volunteering:v}))} placeholder="Code mentor, STEM workshops" />
                  <Field label="Interests" value={form.interests||''} onChange={v=>setForm(f=>({...f, interests:v}))} placeholder="Open Source, AI Ethics, Cycling" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-gray-600 dark:text-slate-300">Tone Preference</label>
                  <select value={form.tone} onChange={e=>setForm(f=>({...f, tone:e.target.value}))} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-xs focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none">
                    <option value="impactful">Impactful</option>
                    <option value="concise">Concise</option>
                    <option value="technical">Technical</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </section>
            </div>
          </div>
        </div>
        </div>
        <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-slate-500">
              <button type="button" onClick={emitContext} className="underline decoration-dotted hover:text-violet-600">Save Context Only</button>
              {form.topSkills && <span className="hidden sm:inline">{form.topSkills.split(/[,;]/).filter(s=>s.trim()).length} skills captured</span>}
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button type="button" variant="outline" size="sm" onClick={()=>setOpen(false)} disabled={loading}>Close</Button>
              <Button type="button" size="sm" onClick={handleGenerate} disabled={loading} className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 inline-flex items-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />} Generate Draft
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, value, onChange, placeholder, type='text', textarea=false, rows=2 }: { label: string; value: string; onChange:(v:string)=>void; placeholder?: string; type?: string; textarea?: boolean; rows?: number }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-gray-600 dark:text-slate-300">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-xs focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
      ) : (
        <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type} className="w-full rounded-lg border border-gray-300/60 dark:border-slate-600/60 bg-white/70 dark:bg-slate-700/50 px-3 py-2 text-xs focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30 outline-none" />
      )}
    </div>
  )
}
