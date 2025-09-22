"use client"
import { Card } from '@/components/ui/card'
import { History } from 'lucide-react'

interface ActivityItem {
  id: string
  action: string
  ts: string
}

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-4 h-4 text-violet-600 dark:text-violet-400" />
        <h2 className="font-semibold font-display text-gray-900 dark:text-slate-100">Recent Activity</h2>
      </div>
      <ul className="space-y-3 text-sm">
        {items.map(i => (
          <li key={i.id} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
            <div>
              <p className="text-gray-700 dark:text-slate-300 leading-snug">{i.action}</p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{i.ts}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
