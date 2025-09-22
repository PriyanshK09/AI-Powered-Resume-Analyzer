"use client"
import { Card } from '@/components/ui/card'
import { Brain, Target, TrendingUp, AlertTriangle } from 'lucide-react'

interface Insight {
  id: string
  type: 'strength' | 'opportunity' | 'metric'
  title: string
  description: string
  impact?: string
}

interface AIInsightsProps {
  insights: Insight[]
}

export function AIInsights({ insights }: AIInsightsProps) {
  return (
    <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        <h2 className="font-semibold font-display text-gray-900 dark:text-slate-100">AI Insights</h2>
      </div>
      <div className="space-y-4">
        {insights.map(i => (
          <div key={i.id} className="flex gap-3">
            <div className="mt-0.5">
              {i.type === 'strength' && <TrendingUp className="w-4 h-4 text-green-500" />}
              {i.type === 'opportunity' && <AlertTriangle className="w-4 h-4 text-fuchsia-500 dark:text-fuchsia-400" />}
              {i.type === 'metric' && <Target className="w-4 h-4 text-violet-500" />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-slate-200">{i.title}</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{i.description}</p>
              {i.impact && <p className="text-[11px] text-violet-600 dark:text-violet-400 mt-1 font-medium">Potential impact: {i.impact}</p>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
