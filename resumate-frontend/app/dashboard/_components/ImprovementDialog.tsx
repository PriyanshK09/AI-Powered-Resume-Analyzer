"use client"
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface SectionImprovement {
  original: string
  improved: string
}
interface ImprovementsPreview {
  improvedSections: {
    summary: SectionImprovement
    experience: SectionImprovement
    skills: SectionImprovement
  }
  ai: boolean
  rationale?: string
  changeSummary?: { bulletsModified?: number; metricsAdded?: number; verbsAdded?: number; skillsDeduplicated?: number }
  bullets?: { original: string; improved: string; changed: boolean; metricsAdded: boolean; verbsAdded: boolean }[]
}

interface ImprovementDialogProps {
  resumeId: string | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onApplied: (updated?: any) => void
}

export function ImprovementDialog({ resumeId, open, onOpenChange, onApplied }: ImprovementDialogProps) {
  const [loading, setLoading] = useState(false)
  const [improvements, setImprovements] = useState<ImprovementsPreview | null>(null)
  const [selected, setSelected] = useState<{ [k: string]: boolean }>({ summary: true, experience: true, skills: true })
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aggressiveness, setAggressiveness] = useState<'conservative' | 'moderate' | 'bold'>('moderate')
  const [regenerating, setRegenerating] = useState(false)
  const [view, setView] = useState<'sections' | 'bullets'>('sections')
  const [bulletFilter, setBulletFilter] = useState<'all' | 'changed' | 'metrics' | 'verbs'>('all')

  useEffect(() => {
    if (open && resumeId) {
      setLoading(true)
      setError(null)
      fetch(`/api/resumes/${resumeId}/improve`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'preview', aggressiveness }) })
        .then(r => r.json())
        .then(d => { if (d.success) setImprovements(d); else setError(d.message || 'Failed to load improvements') })
        .catch(e => setError(e.message || 'Error'))
        .finally(() => setLoading(false))
    } else if (!open) {
      setImprovements(null)
      setSelected({ summary: true, experience: true, skills: true })
      setError(null)
    }
  }, [open, resumeId, aggressiveness])

  async function regenerate() {
    if (!resumeId) return
    setRegenerating(true)
    setError(null)
    try {
      const res = await fetch(`/api/resumes/${resumeId}/improve`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'preview', aggressiveness }) })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Regenerate failed')
      setImprovements(data)
    } catch (e:any) {
      setError(e.message || 'Regenerate failed')
    } finally {
      setRegenerating(false)
    }
  }

  function toggle(key: string) {
    setSelected(s => ({ ...s, [key]: !s[key] }))
  }

  async function apply() {
    if (!resumeId) return
    setApplying(true)
    try {
      const sections = Object.keys(selected).filter(k => selected[k])
      const res = await fetch(`/api/resumes/${resumeId}/improve`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'apply', sections, aggressiveness }) })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Apply failed')
      onApplied(data.resume)
      onOpenChange(false)
    } catch (e:any) {
      setError(e.message || 'Apply failed')
    } finally {
      setApplying(false)
    }
  }

  function diffWords(a: string, b: string) {
    const aWords = a.split(/(\s+)/)
    const bWords = b.split(/(\s+)/)
    // Simple dynamic programming LCS index mapping
    const m = aWords.length, n = bWords.length
    const dp: number[][] = Array.from({ length: m+1 }, () => Array(n+1).fill(0))
    for (let i=m-1;i>=0;i--) {
      for (let j=n-1;j>=0;j--) {
        if (aWords[i] === bWords[j]) dp[i][j] = dp[i+1][j+1] + 1
        else dp[i][j] = Math.max(dp[i+1][j], dp[i][j+1])
      }
    }
    const result: { type: 'equal'|'del'|'add'; text: string }[] = []
    let i=0,j=0
    while (i<m && j<n) {
      if (aWords[i] === bWords[j]) { result.push({ type: 'equal', text: aWords[i] }); i++; j++; }
      else if (dp[i+1][j] >= dp[i][j+1]) { result.push({ type: 'del', text: aWords[i] }); i++; }
      else { result.push({ type: 'add', text: bWords[j] }); j++; }
    }
    while (i<m) { result.push({ type: 'del', text: aWords[i++] }) }
    while (j<n) { result.push({ type: 'add', text: bWords[j++] }) }
    return result
  }

  function renderDiff(original: string, improved: string) {
    if (original === improved) return <span className="opacity-70">{improved || '—'}</span>
    return <span>{diffWords(original, improved).map((p, idx) => {
      if (p.type === 'equal') return <span key={idx}>{p.text}</span>
      if (p.type === 'add') return <span key={idx} className="diff-add">{p.text}</span>
      return <span key={idx} className="diff-del">{p.text}</span>
    })}</span>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-lg font-semibold">AI Improvements Preview</DialogTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-[11px]">
                {(['conservative','moderate','bold'] as const).map(a => (
                  <button
                    key={a}
                    onClick={() => setAggressiveness(a)}
                    className={cn('px-2 py-1 rounded border text-[11px] capitalize transition',
                      aggressiveness === a ? 'bg-violet-600 text-white border-violet-600' : 'bg-transparent text-gray-600 dark:text-slate-400 border-gray-300/40 dark:border-slate-600/40 hover:bg-violet-600/10')}
                  >{a}</button>
                ))}
              </div>
              <Button variant="outline" size="sm" disabled={loading || regenerating} onClick={regenerate}>{regenerating ? 'Regenerating…' : 'Regenerate'}</Button>
              {improvements?.ai && <span className="text-xs text-emerald-600 dark:text-emerald-400">AI generated</span>}
            </div>
          </div>
        </DialogHeader>
        {loading && <div className="flex-1 flex items-center justify-center text-sm text-gray-500 dark:text-slate-400">Generating improvements…</div>}
        {!loading && error && <div className="flex-1 flex items-center justify-center text-sm text-red-500">{error}</div>}
        {!loading && improvements && view === 'sections' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
            <ScrollArea className="border rounded-md p-4 space-y-4">
              <h3 className="text-sm font-medium">Original</h3>
              {(['summary','experience','skills'] as const).map(key => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Checkbox id={`orig-${key}`} checked={selected[key]} onCheckedChange={() => toggle(key)} />
                    <label htmlFor={`orig-${key}`} className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">{key}</label>
                  </div>
                  <pre className="bg-muted/40 dark:bg-slate-800/60 rounded-md p-2 text-[11px] whitespace-pre-wrap leading-relaxed font-mono border border-border overflow-x-auto max-h-40">{improvements.improvedSections[key].original || '—'}</pre>
                </div>
              ))}
              {(improvements.rationale || improvements.changeSummary) && (
                <div className="pt-2 border-t border-dashed space-y-2">
                  {improvements.rationale && <div>
                    <h4 className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-1">AI Rationale</h4>
                    <p className="text-[11px] text-gray-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{improvements.rationale}</p>
                  </div>}
                  {improvements.changeSummary && <div className="grid grid-cols-2 gap-2">
                    {Object.entries(improvements.changeSummary).map(([k,v]) => (
                      <div key={k} className="text-[11px] bg-gray-100 dark:bg-slate-800/60 rounded px-2 py-1 flex items-center justify-between">
                        <span className="capitalize tracking-wide text-gray-600 dark:text-slate-400">{k.replace(/([A-Z])/g,' $1')}</span>
                        <span className="font-semibold text-gray-800 dark:text-slate-200">{v ?? 0}</span>
                      </div>
                    ))}
                  </div>}
                </div>
              )}
            </ScrollArea>
            <ScrollArea className="border rounded-md p-4 space-y-4">
              <h3 className="text-sm font-medium">Improved</h3>
              {(['summary','experience','skills'] as const).map(key => {
                const changed = improvements.improvedSections[key].original.trim() !== improvements.improvedSections[key].improved.trim()
                return (
                  <div key={key} className={cn('space-y-1', changed ? '' : 'opacity-60')}> 
                    <div className="flex items-center gap-2">
                      <Checkbox id={`imp-${key}`} checked={selected[key]} onCheckedChange={() => toggle(key)} />
                      <label htmlFor={`imp-${key}`} className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-300">{key} {changed ? '' : '(no change)'}</label>
                    </div>
                    <pre className="bg-emerald-50/70 dark:bg-emerald-900/10 ring-1 ring-emerald-500/20 rounded-md p-2 text-[11px] whitespace-pre-wrap leading-relaxed font-mono overflow-x-auto max-h-40">{renderDiff(improvements.improvedSections[key].original, improvements.improvedSections[key].improved)}</pre>
                  </div>
                )
              })}
            </ScrollArea>
          </div>
        )}
        {!loading && improvements && view === 'bullets' && (
          <ScrollArea className="flex-1 border rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium">Experience Bullets ({improvements.bullets?.length || 0})</h3>
              <div className="flex gap-2">
                {(['all','changed','metrics','verbs'] as const).map(f => (
                  <button key={f} onClick={()=>setBulletFilter(f)} className={cn('px-2 py-1 rounded text-[11px] border', bulletFilter===f ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-300/40 dark:border-slate-600/40 text-gray-600 dark:text-slate-400 hover:bg-violet-600/10')}>{f}</button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {improvements.bullets?.filter(b => {
                if (bulletFilter==='all') return true
                if (bulletFilter==='changed') return b.changed
                if (bulletFilter==='metrics') return b.metricsAdded
                if (bulletFilter==='verbs') return b.verbsAdded
              }).map((b,i) => (
                <div key={i} className={cn('rounded-md p-2 text-[11px] font-mono whitespace-pre-wrap leading-relaxed border', b.changed ? 'bg-emerald-50/60 dark:bg-emerald-900/10 border-emerald-400/30' : 'bg-muted/40 dark:bg-slate-800/40 border-transparent')}> 
                  {renderDiff(b.original, b.improved)}
                  <div className="mt-1 flex gap-2 flex-wrap">
                    {b.changed && <span className="px-1.5 py-0.5 rounded bg-violet-600/10 text-violet-600 dark:text-violet-300 border border-violet-600/20 text-[10px]">changed</span>}
                    {b.metricsAdded && <span className="px-1.5 py-0.5 rounded bg-emerald-600/10 text-emerald-600 dark:text-emerald-300 border border-emerald-600/20 text-[10px]">metrics</span>}
                    {b.verbsAdded && <span className="px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-600 dark:text-blue-300 border border-blue-600/20 text-[10px]">verb</span>}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        <DialogFooter className="pt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[11px] text-gray-500 dark:text-slate-400">
            <span className="hidden md:inline">Select which sections to apply. Uncheck to keep original text.</span>
            {improvements && (
              <div className="flex gap-2">
                <button onClick={()=>setView('sections')} className={cn('px-2 py-1 rounded border text-[11px]', view==='sections' ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-300/40 dark:border-slate-600/40 hover:bg-violet-600/10')}>Sections</button>
                <button onClick={()=>setView('bullets')} className={cn('px-2 py-1 rounded border text-[11px]', view==='bullets' ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-300/40 dark:border-slate-600/40 hover:bg-violet-600/10')}>Bullets</button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={applying}>Cancel</Button>
            <Button onClick={apply} disabled={applying || loading || !improvements}><span>{applying ? 'Applying…' : 'Apply Selected'}</span></Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
