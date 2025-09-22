"use client"
import { Card } from '@/components/ui/card'
import { CheckCircle2, Circle } from 'lucide-react'

interface ChecklistItem { id: string; label: string; done: boolean }

export function GettingStartedChecklist({ items }: { items: ChecklistItem[] }) {
  return (
    <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl">
      <h2 className="font-semibold font-display text-gray-900 dark:text-slate-100 mb-4">Getting Started</h2>
      <ul className="space-y-3">
        {items.map(i => (
          <li key={i.id} className="flex items-center gap-3 text-sm">
            {i.done ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300 dark:text-slate-600" />}
            <span className={i.done ? 'text-gray-500 line-through dark:text-slate-500' : 'text-gray-700 dark:text-slate-300'}>{i.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
