"use client"
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ResumeListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({length:3}).map((_,i)=>(
        <Card key={i} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/40 rounded-2xl">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-2 w-28" />
            <Skeleton className="h-2 w-40" />
          </div>
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </Card>
      ))}
    </div>
  )
}
