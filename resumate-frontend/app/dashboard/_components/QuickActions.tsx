"use client"
// @ts-ignore
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// @ts-ignore
import { Plus, FileText, Wand2, LayoutTemplate } from 'lucide-react'

interface QuickActionsProps {
  onCreateResume?: () => void
  onImportResume?: () => void
  onAIAnalyze?: () => void
  onBrowseTemplates?: () => void
}

export function QuickActions({ onCreateResume, onImportResume, onAIAnalyze, onBrowseTemplates }: QuickActionsProps) {
  const router = useRouter()
  const actionClasses = 'flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 border border-white/50 dark:border-slate-700/50 transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-xl cursor-pointer group'
  const iconClasses = 'w-6 h-6 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform'
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div onClick={onCreateResume || (() => router.push('/dashboard/resumes/new'))} className={actionClasses} aria-label="Create new resume">
        <Plus className={iconClasses} />
        <span className="text-sm font-medium text-gray-800 dark:text-slate-200">New Resume</span>
      </div>
      <div onClick={onImportResume || (() => {/* TODO: implement import */})} className={actionClasses} aria-label="Import existing resume">
        <FileText className={iconClasses} />
        <span className="text-sm font-medium text-gray-800 dark:text-slate-200">Import</span>
      </div>
      <div onClick={onAIAnalyze || (() => {/* TODO: open AI analyze modal */})} className={actionClasses} aria-label="AI analyze resume">
        <Wand2 className={iconClasses} />
        <span className="text-sm font-medium text-gray-800 dark:text-slate-200">AI Analyze</span>
      </div>
  <div onClick={onBrowseTemplates || (() => router.push('/dashboard/templates'))} className={actionClasses} aria-label="Browse templates">
        <LayoutTemplate className={iconClasses} />
        <span className="text-sm font-medium text-gray-800 dark:text-slate-200">Templates</span>
      </div>
    </div>
  )
}
