"use client"
import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ImportDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onImported: (resume: any) => void
}

export function ImportDialog({ open, onOpenChange, onImported }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState('')
  const [experience, setExperience] = useState('')
  const [skills, setSkills] = useState('')
  const [autoTitle, setAutoTitle] = useState('')
  const [stage, setStage] = useState<'select' | 'preview'>('select')
  const inputRef = useRef<HTMLInputElement | null>(null)

  function resetAll() {
    setFile(null); setSummary(''); setExperience(''); setSkills(''); setError(null); setStage('select'); setAutoTitle('')
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true); setError(null)
    try {
      const form = new FormData()
      form.append('file', file)
      const resp = await fetch('/api/import', { method: 'POST', body: form })
      const data = await resp.json()
      if (!resp.ok || !data.success) throw new Error(data.message || 'Import failed')
      setSummary(data.resume.summary || '')
      setExperience(data.resume.experience || '')
      setSkills(data.resume.skills || '')
      setAutoTitle(data.resume.title || '')
      setStage('preview')
    } catch (e:any) {
      setError(e.message || 'Import failed')
    } finally {
      setUploading(false)
    }
  }

  function close() {
    onOpenChange(false)
    setTimeout(() => resetAll(), 300)
  }

  return (
    <Dialog open={open} onOpenChange={(v: any) => { if (!v) close(); else onOpenChange(v) }}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Import Resume</DialogTitle>
        </DialogHeader>
        {stage === 'select' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 border border-dashed rounded-md p-8 text-center">
            <div className="text-sm text-gray-600 dark:text-slate-400 max-w-md">
              Upload a PDF or LaTeX (.tex) resume. We'll parse the content and let you review before editing further.
            </div>
            <input ref={inputRef} onChange={e => setFile(e.target.files?.[0] || null)} type="file" accept=".pdf,.tex" className="text-xs" />
            {file && <div className="text-xs text-gray-500 dark:text-slate-500">Selected: {file.name}</div>}
            {error && <div className="text-xs text-red-500">{error}</div>}
            <Button disabled={!file || uploading} onClick={handleUpload}>{uploading ? 'Parsing…' : 'Parse & Continue'}</Button>
          </div>
        )}
        {stage === 'preview' && (
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-2">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-violet-600 dark:text-violet-300">Title (auto)</label>
                <Input value={autoTitle} onChange={e=>setAutoTitle(e.target.value)} placeholder="Backend Engineer Resume" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-violet-600 dark:text-violet-300">Summary</label>
                <Textarea value={summary} onChange={e=>setSummary(e.target.value)} className="mt-1 h-28 resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-violet-600 dark:text-violet-300">Experience (bullets)</label>
                <Textarea value={experience} onChange={e=>setExperience(e.target.value)} className="mt-1 h-56 font-mono text-[11px] leading-relaxed resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-violet-600 dark:text-violet-300">Skills</label>
                <Textarea value={skills} onChange={e=>setSkills(e.target.value)} className="mt-1 h-24 resize-none font-mono text-[11px]" />
              </div>
              <div className="text-[11px] text-gray-500 dark:text-slate-400">You can refine with AI afterward using Improve.</div>
            </div>
          </ScrollArea>
        )}
        <DialogFooter className="pt-4">
          {stage === 'preview' ? (
            <>
              <Button {...({ variant: "outline" } as any)} onClick={close}>Close</Button>
              <Button onClick={() => { onImported({ _id: 'temp', title: autoTitle, summary, experience, skills }); close() }}>Done</Button>
            </>
          ) : (
            <Button {...({ variant: "outline" } as any)} onClick={close}>Cancel</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}