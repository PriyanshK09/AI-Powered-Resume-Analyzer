"use client"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// @ts-ignore
import { MoreHorizontal, Pencil, Trash2, Sparkles, Loader2 } from 'lucide-react'

export interface ResumeItem {
  id: string
  title: string
  updatedAt: string
  score?: number
  roleTarget?: string
  status?: 'draft' | 'review' | 'final'
}

interface ResumeListProps {
  resumes: ResumeItem[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onImprove?: (id: string) => void
  onPreview?: (id: string) => void
  onScore?: (id: string) => void
  loadingStates?: {
    improving?: Set<string>
    scoring?: Set<string>
    deleting?: Set<string>
    updating?: Set<string>
  }
}

export function ResumeList({ resumes, onEdit, onDelete, onImprove, onPreview, onScore, loadingStates }: ResumeListProps) {
  if (!resumes.length) {
    return (
      <Card className="p-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl text-center">
        <p className="text-gray-600 dark:text-slate-400">No resumes yet. Create your first one to get started.</p>
      </Card>
    )
  }
  return (
    <div className="space-y-4">
      {resumes.map(resume => (
        <Card key={resume.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl hover:shadow-md transition-shadow">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900 dark:text-slate-100 font-display text-lg">{resume.title}</h3>
              {resume.status && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-700 dark:text-violet-300 border border-violet-400/30`}>{resume.status}</span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Updated {resume.updatedAt}{resume.roleTarget ? ` • Target: ${resume.roleTarget}` : ''}</p>
            {typeof resume.score === 'number' && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-40 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-600 to-purple-600" style={{ width: `${resume.score}%` }} />
                </div>
                <span className="text-xs font-medium text-violet-700 dark:text-violet-300">{resume.score}%</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button
              {...({ variant: "outline" } as any)}
              {...({ size: "sm" } as any)}
              className="bg-white/40 dark:bg-slate-700/40 backdrop-blur hover:bg-white/60 dark:hover:bg-slate-700/60 border-white/40 dark:border-slate-600/40"
              onClick={() => onPreview?.(resume.id)}
            >
              Preview
            </Button>
            <Button
              {...({ variant: "outline" } as any)}
              {...({ size: "sm" } as any)}
              className="bg-white/40 dark:bg-slate-700/40 backdrop-blur hover:bg-white/60 dark:hover:bg-slate-700/60 border-white/40 dark:border-slate-600/40"
              disabled={loadingStates?.scoring?.has(resume.id)}
              onClick={() => onScore?.(resume.id)}
            >
              {loadingStates?.scoring?.has(resume.id) && <Loader2 className="w-3 h-3 animate-spin mr-1" />}Score
            </Button>
            <Button
              {...({ size: "sm" } as any)}
              className="gap-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 focus-visible:ring-violet-500 border-0 shadow-sm hover:shadow-md transition-colors"
              disabled={loadingStates?.improving?.has(resume.id)}
              onClick={() => onImprove?.(resume.id)}
            >
              {loadingStates?.improving?.has(resume.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} {loadingStates?.improving?.has(resume.id) ? 'Improving…' : 'Improve'}
            </Button>
            <Button
              {...({ variant: "outline" } as any)}
              {...({ size: "sm" } as any)}
              className="bg-white/40 dark:bg-slate-700/40 backdrop-blur hover:bg-white/60 dark:hover:bg-slate-700/60 border-white/40 dark:border-slate-600/40"
              onClick={() => onEdit?.(resume.id)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              {...({ variant: "outline" } as any)}
              {...({ size: "sm" } as any)}
              className="bg-white/40 dark:bg-slate-700/40 backdrop-blur hover:bg-white/60 dark:hover:bg-slate-700/60 border-white/40 dark:border-slate-600/40 disabled:opacity-60"
              disabled={loadingStates?.deleting?.has(resume.id)}
              onClick={() => onDelete?.(resume.id)}
            >
              {loadingStates?.deleting?.has(resume.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
