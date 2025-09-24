"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { 
  Edit, 
  Eye, 
  Globe, 
  Trash2, 
  Copy, 
  BarChart3, 
  Calendar,
  Loader2,
  ExternalLink,
  Settings
} from 'lucide-react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

interface Portfolio {
  _id: string
  title: string
  slug: string
  theme: string
  isPublic: boolean
  fullName?: string
  tagline?: string
  bio?: string
  email?: string
  views: number
  createdAt: string
  updatedAt: string
}

export default function PortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [publishLoading, setPublishLoading] = useState(false)
  const [portfolioId, setPortfolioId] = useState<string | null>(null)

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setPortfolioId(resolvedParams.id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (portfolioId) {
      loadPortfolio()
    }
  }, [portfolioId])

  const loadPortfolio = async () => {
    if (!portfolioId) return
    
    try {
      const res = await fetch(`/api/portfolios/${portfolioId}`)
      const data = await res.json()
      
      if (data.success) {
        setPortfolio(data.portfolio)
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Portfolio not found',
          variant: 'destructive'
        })
        router.push('/dashboard/portfolios')
      }
    } catch (error) {
      console.error('Portfolio load error:', error)
      toast({
        title: 'Error',
        description: 'Failed to load portfolio',
        variant: 'destructive'
      })
      router.push('/dashboard/portfolios')
    } finally {
      setLoading(false)
    }
  }

  const togglePublic = async () => {
    if (!portfolio) return
    
    setPublishLoading(true)
    try {
      const res = await fetch(`/api/portfolios/${portfolio._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !portfolio.isPublic })
      })
      
      const data = await res.json()
      if (data.success) {
        setPortfolio(prev => prev ? { ...prev, isPublic: !prev.isPublic } : null)
        toast({
          title: 'Success',
          description: `Portfolio ${!portfolio.isPublic ? 'published' : 'unpublished'} successfully`
        })
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update portfolio',
        variant: 'destructive'
      })
    } finally {
      setPublishLoading(false)
    }
  }

  const copyPortfolioUrl = () => {
    if (!portfolio) return
    
    const url = `${window.location.origin}/portfolio/${portfolio.slug}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'Copied!',
      description: 'Portfolio URL copied to clipboard'
    })
  }

  const deletePortfolio = async () => {
    if (!portfolio) return
    
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/portfolios/${portfolio._id}`, {
        method: 'DELETE'
      })
      
      const data = await res.json()
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Portfolio deleted successfully'
        })
        router.push('/dashboard/portfolios')
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete portfolio',
        variant: 'destructive'
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Portfolio Not Found</h2>
            <p className="text-muted-foreground mb-4">The portfolio you're looking for doesn't exist.</p>
            <Button onClick={() => router.push('/dashboard/portfolios')}>
              Back to Portfolios
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{portfolio.title}</h1>
          <p className="text-muted-foreground">
            Created {new Date(portfolio.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={portfolio.isPublic ? 'default' : 'secondary'}>
            {portfolio.isPublic ? 'Public' : 'Draft'}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            {portfolio.views} views
          </Badge>
        </div>
      </div>

      {/* Portfolio Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Portfolio Overview
          </CardTitle>
          <CardDescription>
            Manage your portfolio settings and content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="font-medium">{portfolio.fullName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Theme</label>
              <p className="font-medium capitalize">{portfolio.theme}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">URL Slug</label>
              <p className="font-medium font-mono text-sm">{portfolio.slug}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="font-medium">{portfolio.email || 'Not set'}</p>
            </div>
          </div>
          
          {portfolio.tagline && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tagline</label>
              <p className="font-medium">{portfolio.tagline}</p>
            </div>
          )}
          
          {portfolio.bio && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Bio</label>
              <p className="text-sm text-muted-foreground line-clamp-3">{portfolio.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Button 
          onClick={() => router.push(`/dashboard/portfolios/${portfolio._id}/edit`)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Portfolio
        </Button>
        
        {portfolio.isPublic && (
          <Button 
            variant="outline"
            onClick={() => window.open(`/portfolio/${portfolio.slug}`, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            View Live
          </Button>
        )}
        
        <Button 
          variant="outline"
          onClick={copyPortfolioUrl}
          className="flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy URL
        </Button>
        
        <Button 
          variant={portfolio.isPublic ? 'secondary' : 'default'}
          onClick={togglePublic}
          disabled={publishLoading}
          className="flex items-center gap-2"
        >
          {publishLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          {portfolio.isPublic ? 'Unpublish' : 'Publish'}
        </Button>
      </div>

      {/* Portfolio URL */}
      {portfolio.isPublic && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Public URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="flex-1 text-sm">
                {typeof window !== 'undefined' ? window.location.origin : ''}/portfolio/{portfolio.slug}
              </code>
              <Button size="sm" variant="outline" onClick={copyPortfolioUrl}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Portfolio
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your portfolio
                  "{portfolio.title}" and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={deletePortfolio}
                  disabled={deleteLoading}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Delete Portfolio'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}