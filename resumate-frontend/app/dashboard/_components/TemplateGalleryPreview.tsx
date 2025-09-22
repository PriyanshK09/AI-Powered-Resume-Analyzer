"use client"
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// @ts-ignore
import { ChevronRight } from 'lucide-react'

interface TemplateGalleryPreviewProps {
  onBrowse?: () => void
  templates: { id: string; name: string; image: string; category?: string }[]
}
// @ts-ignore
import { useRouter } from 'next/navigation'

export function TemplateGalleryPreview({ onBrowse, templates }: TemplateGalleryPreviewProps) {
  const router = useRouter()
  return (
    <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 rounded-2xl flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold font-display text-gray-900 dark:text-slate-100">Templates</h2>
        <Button {...({ variant: "ghost", size: "sm" } as any)} className="text-violet-600 dark:text-violet-400" onClick={onBrowse}>View all</Button>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {templates.slice(0,3).map(t => (
          <div key={t.id} className="relative aspect-[3/4] rounded-lg overflow-hidden group ring-1 ring-white/40 dark:ring-slate-700/40">
            <Image src={t.image} alt={t.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute bottom-1 left-1.5 text-[10px] font-medium text-white drop-shadow">{t.name}</span>
          </div>
        ))}
      </div>
      <Button {...({ variant: "outline" } as any)} className="group mt-auto" onClick={onBrowse || (() => router.push('/dashboard/templates'))}>
        Browse templates <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
      </Button>
    </Card>
  )
}
