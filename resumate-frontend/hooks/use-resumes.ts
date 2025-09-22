"use client"
import { useEffect, useState, useCallback } from 'react'
import { toast } from '@/hooks/use-toast'

export interface ResumeRecord {
  _id: string
  title: string
  content: string
  targetRole?: string
  templateId?: string
  summary?: string
  experience?: string
  skills?: string
  fullName?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  portfolio?: string
  updatedAt: string
  createdAt: string
  score?: number
  analysisMeta?: { keywordCoverage?: number; lastAnalyzedAt?: string }
}

interface ResumesState {
  resumes: ResumeRecord[]
  loading: boolean
  error: string | null
}

export function useResumes() {
  const [state, setState] = useState<ResumesState>({ resumes: [], loading: true, error: null })
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState<Set<string>>(() => new Set())
  const [deleting, setDeleting] = useState<Set<string>>(() => new Set())
  const [improving, setImproving] = useState<Set<string>>(() => new Set())
  const [scoring, setScoring] = useState<Set<string>>(() => new Set())

  const load = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetch('/api/resumes', { credentials: 'include' })
      if (res.status === 401) { setState({ resumes: [], loading: false, error: 'unauthorized' }); return }
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Failed')
      setState({ resumes: data.resumes, loading: false, error: null })
    } catch (e: any) {
      setState(s => ({ ...s, loading: false, error: e.message || 'Error' }))
      toast({ title: 'Failed to load resumes', description: e.message || 'Unknown error', variant: 'destructive' as any })
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function create(payload: { title: string; content: string; targetRole?: string; templateId?: string; summary?: string; experience?: string; skills?: string; fullName?: string; email?: string; phone?: string; location?: string; linkedin?: string; github?: string; portfolio?: string }) {
    setCreating(true)
    const optimistic: ResumeRecord = { _id: 'temp-' + Date.now(), title: payload.title, content: payload.content, targetRole: payload.targetRole, templateId: payload.templateId, summary: payload.summary, experience: payload.experience, skills: payload.skills, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    setState(s => ({ ...s, resumes: [optimistic, ...s.resumes] }))
    try {
      const res = await fetch('/api/resumes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Create failed')
      setState(s => ({ ...s, resumes: s.resumes.map(r => r._id === optimistic._id ? data.resume : r) }))
      toast({ title: 'Resume created', description: data.resume.title })
      return data.resume as ResumeRecord
    } catch (e:any) {
      setState(s => ({ ...s, resumes: s.resumes.filter(r => r._id !== optimistic._id) }))
      toast({ title: 'Create failed', description: e.message || 'Unknown error', variant: 'destructive' as any })
      throw e
    } finally {
      setCreating(false)
    }
  }

  async function update(id: string, patch: Partial<{ title: string; content: string; targetRole?: string; templateId?: string; summary?: string; experience?: string; skills?: string; fullName?: string; email?: string; phone?: string; location?: string; linkedin?: string; github?: string; portfolio?: string }>) {
    const prev = state.resumes.find(r => r._id === id)
    if (!prev) return
    const merged = { ...prev, ...patch, updatedAt: new Date().toISOString() }
    setState(s => ({ ...s, resumes: s.resumes.map(r => r._id === id ? merged : r) }))
    setUpdating(s => new Set(s).add(id))
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Update failed')
      setState(s => ({ ...s, resumes: s.resumes.map(r => r._id === id ? data.resume : r) }))
      toast({ title: 'Resume updated', description: data.resume.title })
      return data.resume as ResumeRecord
    } catch (e:any) {
      setState(s => ({ ...s, resumes: s.resumes.map(r => r._id === id ? prev : r) }))
      toast({ title: 'Update failed', description: e.message || 'Unknown error', variant: 'destructive' as any })
      throw e
    } finally {
      setUpdating(s => { const copy = new Set(s); copy.delete(id); return copy })
    }
  }

  async function remove(id: string) {
    const prev = state.resumes
    setState(s => ({ ...s, resumes: s.resumes.filter(r => r._id !== id) }))
    setDeleting(s => new Set(s).add(id))
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Delete failed')
      toast({ title: 'Resume deleted' })
    } catch (e:any) {
      setState(s => ({ ...s, resumes: prev }))
      toast({ title: 'Delete failed', description: e.message || 'Unknown error', variant: 'destructive' as any })
      throw e
    } finally {
      setDeleting(s => { const copy = new Set(s); copy.delete(id); return copy })
    }
  }

  async function analyze(id: string) {
    setScoring(s => new Set(s).add(id))
    try {
      const res = await fetch(`/api/resumes/${id}/analyze`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Analyze failed')
      setState(s => ({
        ...s,
        resumes: s.resumes.map(r => r._id === id ? { ...r, score: data.analysis.score, analysisMeta: { ...(r.analysisMeta || {}), keywordCoverage: data.analysis.keywordCoverage, lastAnalyzedAt: new Date().toISOString() } } : r)
      }))
      toast({ title: 'Analysis complete', description: `Score: ${data.analysis.score}` })
      return data.analysis
    } catch (e:any) {
      toast({ title: 'Analysis failed', description: e.message || 'Unknown error', variant: 'destructive' as any })
      throw e
    } finally {
      setScoring(s => { const copy = new Set(s); copy.delete(id); return copy })
    }
  }

  async function improve(id: string) {
    setImproving(s => new Set(s).add(id))
    try {
      const res = await fetch(`/api/resumes/${id}/improve`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.message || 'Improve failed')
      if (data.improved && data.resume) {
        setState(s => ({ ...s, resumes: s.resumes.map(r => r._id === id ? data.resume : r) }))
        toast({ title: 'Resume improved', description: 'Light enhancements applied' })
      } else {
        toast({ title: 'No improvements needed', description: 'Content already optimized' })
      }
      return data
    } catch (e:any) {
      toast({ title: 'Improve failed', description: e.message || 'Unknown error', variant: 'destructive' as any })
      throw e
    } finally {
      setImproving(s => { const copy = new Set(s); copy.delete(id); return copy })
    }
  }
  function replaceLocal(updated: ResumeRecord) {
    setState(s => ({ ...s, resumes: s.resumes.map(r => r._id === updated._id ? { ...r, ...updated } : r) }))
  }

  return { ...state, reload: load, create, update, remove, analyze, improve, replaceLocal, creating, updating, deleting, improving, scoring }
}
