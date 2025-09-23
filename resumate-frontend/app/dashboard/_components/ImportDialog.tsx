"use client"
import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ImportDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  onImported: (resume: any) => void
}

export function ImportDialog({ open, onOpenChange, onImported }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoTitle, setAutoTitle] = useState('')
  const [stage, setStage] = useState<'select' | 'preview'>('select')
  const inputRef = useRef<HTMLInputElement | null>(null)
  
  // Helper function to safely convert values to strings
  const safeStringify = (value: any): string => {
    if (typeof value === 'string') return value
    if (value === null || value === undefined) return ''
    if (Array.isArray(value)) {
      return value.map(item => {
        if (typeof item === 'string') return item
        if (typeof item === 'object' && item !== null) {
          // Handle education objects specifically
          if (item.degree && item.school) {
            const parts = []
            if (item.degree) parts.push(item.degree)
            if (item.school) parts.push(item.school)
            if (item.year) parts.push(item.year)
            return parts.join(' | ')
          }
          return Object.values(item).filter(Boolean).join(' ')
        }
        return String(item)
      }).filter(Boolean).join('\n')
    }
    if (typeof value === 'object') {
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
  
  // All resume sections
  const [sections, setSections] = useState({
    summary: '',
    experience: '',
    projects: '',
    education: '',
    certifications: '',
    skills: '',
    achievements: '',
    languages: '',
    publications: '',
    volunteerWork: '',
    interests: '',
    references: ''
  })

  function resetAll() {
    setFile(null)
    setSections({
      summary: '',
      experience: '',
      projects: '',
      education: '',
      certifications: '',
      skills: '',
      achievements: '',
      languages: '',
      publications: '',
      volunteerWork: '',
      interests: '',
      references: ''
    })
    setError(null)
    setStage('select')
    setAutoTitle('')
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
      
      // Update all sections with parsed data
      setSections({
        summary: safeStringify(data.resume.summary),
        experience: safeStringify(data.resume.experience),
        projects: safeStringify(data.resume.projects),
        education: safeStringify(data.resume.education),
        certifications: safeStringify(data.resume.certifications),
        skills: safeStringify(data.resume.skills),
        achievements: safeStringify(data.resume.achievements),
        languages: safeStringify(data.resume.languages),
        publications: safeStringify(data.resume.publications),
        volunteerWork: safeStringify(data.resume.volunteerWork),
        interests: safeStringify(data.resume.interests),
        references: safeStringify(data.resume.references)
      })
      setAutoTitle(data.resume.title || '')
      setStage('preview')
    } catch (e:any) {
      setError(e.message || 'Import failed')
    } finally {
      setUploading(false)
    }
  }

  function updateSection(key: keyof typeof sections, value: string) {
    setSections(prev => ({ ...prev, [key]: value }))
  }

  function close() {
    onOpenChange(false)
    setTimeout(() => resetAll(), 300)
  }

  const sectionTabs = [
    { key: 'summary', label: 'Summary', height: 'h-28' },
    { key: 'experience', label: 'Experience', height: 'h-64' },
    { key: 'projects', label: 'Projects', height: 'h-48' },
    { key: 'education', label: 'Education', height: 'h-32' },
    { key: 'certifications', label: 'Certs', height: 'h-32' },
    { key: 'skills', label: 'Skills', height: 'h-24' },
    { key: 'achievements', label: 'Awards', height: 'h-32' },
    { key: 'languages', label: 'Languages', height: 'h-20' },
    { key: 'publications', label: 'Publications', height: 'h-32' },
    { key: 'volunteerWork', label: 'Volunteer', height: 'h-32' },
    { key: 'interests', label: 'Interests', height: 'h-20' },
    { key: 'references', label: 'References', height: 'h-24' }
  ] as const

  return (
    <Dialog open={open} onOpenChange={(v: any) => { if (!v) close(); else onOpenChange(v) }}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Import Resume</DialogTitle>
        </DialogHeader>
        {stage === 'select' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 border border-dashed rounded-md p-8 text-center">
            <div className="text-sm text-gray-600 dark:text-slate-400 max-w-md">
              Upload a PDF or LaTeX (.tex) resume. We'll parse all sections and let you review before editing further.
            </div>
            <input ref={inputRef} onChange={e => setFile(e.target.files?.[0] || null)} type="file" accept=".pdf,.tex" className="text-xs" />
            {file && <div className="text-xs text-gray-500 dark:text-slate-500">Selected: {file.name}</div>}
            {error && <div className="text-xs text-red-500">{error}</div>}
            <Button disabled={!file || uploading} onClick={handleUpload}>{uploading ? 'Parsing…' : 'Parse & Continue'}</Button>
          </div>
        )}
        {stage === 'preview' && (
          <div className="flex-1 flex flex-col space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-violet-600 dark:text-violet-300">Title (auto)</label>
              <Input value={autoTitle} onChange={e=>setAutoTitle(e.target.value)} placeholder="Backend Engineer Resume" className="mt-1" />
            </div>
            
            <Tabs defaultValue="summary" className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-6 lg:grid-cols-12 gap-1 h-auto p-1">
                {sectionTabs.map(tab => (
                  <TabsTrigger 
                    key={tab.key} 
                    value={tab.key} 
                    className="text-[10px] py-2 px-1 data-[state=active]:bg-violet-600 data-[state=active]:text-white"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <ScrollArea className="flex-1 mt-4">
                {sectionTabs.map(tab => (
                  <TabsContent key={tab.key} value={tab.key} className="mt-0">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-wide text-violet-600 dark:text-violet-300">
                        {tab.label} {sections[tab.key as keyof typeof sections] && `(${sections[tab.key as keyof typeof sections].length} chars)`}
                      </label>
                      <Textarea 
                        value={sections[tab.key as keyof typeof sections]} 
                        onChange={e => updateSection(tab.key as keyof typeof sections, e.target.value)}
                        className={`${tab.height} resize-none font-mono text-[11px] leading-relaxed`}
                        placeholder={`Enter ${tab.label.toLowerCase()} content...`}
                      />
                    </div>
                  </TabsContent>
                ))}
              </ScrollArea>
            </Tabs>
            
            <div className="text-[11px] text-gray-500 dark:text-slate-400">
              Parsed {Object.values(sections).filter(Boolean).length} of {sectionTabs.length} sections. You can refine with AI afterward using Improve.
            </div>
          </div>
        )}
        <DialogFooter className="pt-4">
          {stage === 'preview' ? (
            <>
              <Button variant="outline" onClick={close}>Close</Button>
              <Button onClick={() => { onImported({ _id: 'temp', title: autoTitle, ...sections }); close() }}>Done</Button>
            </>
          ) : (
            <Button variant="outline" onClick={close}>Cancel</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}