"use client"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'

interface PlanStatusProps {
  plan: 'free' | 'pro'
  usage: { resumes: number; limit: number; aiAnalyses: number; aiLimit: number }
  onUpgrade?: () => void
}

export function PlanStatus({ plan, usage, onUpgrade }: PlanStatusProps) {
  const percent = Math.min(100, Math.round((usage.resumes / usage.limit) * 100))
  return (
    <Card className="p-6 bg-gradient-to-br from-violet-600/90 to-purple-600/90 text-white border border-white/20 rounded-2xl overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5" />
          <h2 className="font-semibold font-display">{plan === 'pro' ? 'Pro Plan' : 'Free Plan'}</h2>
        </div>
        <p className="text-xs text-white/80 mb-4">{plan === 'free' ? 'Upgrade to unlock unlimited resumes and deeper AI insights.' : 'Enjoy unlimited access to advanced features.'}</p>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[11px] mb-1"><span>Resumes</span><span>{usage.resumes}/{usage.limit}</span></div>
            <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden"><div className="h-full bg-white/70" style={{ width: `${percent}%` }} /></div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] mb-1"><span>AI Analyses</span><span>{usage.aiAnalyses}/{usage.aiLimit}</span></div>
            <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden"><div className="h-full bg-white/70" style={{ width: `${Math.min(100, Math.round((usage.aiAnalyses / usage.aiLimit) * 100))}%` }} /></div>
          </div>
        </div>
        {plan === 'free' && (
          <Button size="sm" className="mt-4 bg-white text-violet-700 hover:bg-violet-50" onClick={onUpgrade}>Upgrade</Button>
        )}
      </div>
    </Card>
  )
}
