"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Globe, 
  Lock, 
  BarChart3, 
  ExternalLink,
  Copy,
  Settings
} from 'lucide-react'

interface Portfolio {
  _id: string
  title: string
  slug: string
  theme: string
  isPublic: boolean
  fullName?: string
  tagline?: string
  views?: number
  createdAt: string
  updatedAt: string
}

export default function PortfoliosPage() {
  const router = useRouter()
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPortfolios()
  }, [])

  const loadPortfolios = async () => {
    try {
      const res = await fetch('/api/portfolios')
      const data = await res.json()
      if (data.success) {
        setPortfolios(data.portfolios || [])
      }
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to load portfolios', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const togglePublic = async (id: string, isPublic: boolean) => {
    try {
      const res = await fetch(`/api/portfolios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic })
      })
      
      const data = await res.json()
      if (data.success) {
        setPortfolios(prev => prev.map(p => 
          p._id === id ? { ...p, isPublic } : p
        ))
        toast({ 
          title: 'Success', 
          description: isPublic ? 'Portfolio is now public' : 'Portfolio is now private' 
        })
      } else {
        throw new Error(data.message)
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    }
  }

  const deletePortfolio = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio?')) return
    
    try {
      const res = await fetch(`/api/portfolios/${id}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (data.success) {
        setPortfolios(prev => prev.filter(p => p._id !== id))
        toast({ title: 'Success', description: 'Portfolio deleted' })
      } else {
        throw new Error(data.message)
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    }
  }

  const copyPortfolioUrl = (slug: string) => {
    const url = `${window.location.origin}/portfolio/${slug}`
    navigator.clipboard.writeText(url)
    toast({ title: 'Copied', description: 'Portfolio URL copied to clipboard' })
  }

  const getThemeColor = (theme: string) => {
    const colors = {
      modern: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      minimal: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      creative: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      professional: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      dark: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
      colorful: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
    }
    return colors[theme as keyof typeof colors] || colors.modern
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            My Portfolios
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2">
            Manage your portfolio websites
          </p>
        </div>
        
        <Button 
          onClick={() => router.push('/dashboard/portfolios/new')}
          className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Portfolio
        </Button>
      </div>

      {portfolios.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <Globe className="w-16 h-16 mx-auto text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold">No portfolios yet</h3>
              <p className="text-gray-600 dark:text-slate-400">
                Create your first portfolio to showcase your work
              </p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard/portfolios/new')}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Portfolio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map(portfolio => (
            <Card key={portfolio._id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{portfolio.title}</CardTitle>
                    {portfolio.tagline && (
                      <CardDescription className="truncate mt-1">
                        {portfolio.tagline}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {portfolio.isPublic ? (
                      <Globe className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getThemeColor(portfolio.theme)}>
                    {portfolio.theme}
                  </Badge>
                  
                  {portfolio.views !== undefined && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <BarChart3 className="w-3 h-3" />
                      {portfolio.views} views
                    </div>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <div>Created: {new Date(portfolio.createdAt).toLocaleDateString()}</div>
                  <div>Updated: {new Date(portfolio.updatedAt).toLocaleDateString()}</div>
                  <div className="flex items-center gap-1">
                    <span>URL:</span>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
                      /{portfolio.slug}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyPortfolioUrl(portfolio.slug)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={portfolio.isPublic}
                      onCheckedChange={(checked) => togglePublic(portfolio._id, checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-slate-400">
                      {portfolio.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  {portfolio.isPublic && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/portfolio/${portfolio.slug}`, '_blank')}
                      className="flex-1"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/portfolios/${portfolio._id}/preview`)}
                    className="flex-1"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/portfolios/${portfolio._id}/edit`)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletePortfolio(portfolio._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}