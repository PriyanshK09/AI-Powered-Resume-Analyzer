"use client"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/hooks/use-toast'
import { Loader2, Save, Eye, ArrowLeft, Check, X } from 'lucide-react'

interface PortfolioData {
  _id: string
  title: string
  slug: string
  theme: string
  isPublic: boolean
  fullName: string
  tagline: string
  bio: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  website: string
  twitter: string
  dribbble: string
  behance: string
  about: string
  experience: string
  projects: string
  skills: string
  education: string
  achievements: string
  testimonials: string
  services: string
  contact: string
  metaDescription: string
  metaKeywords: string
}

const themes = [
  { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant layout' },
  { id: 'creative', name: 'Creative', description: 'Bold and artistic design' },
  { id: 'professional', name: 'Professional', description: 'Corporate and formal style' },
  { id: 'dark', name: 'Dark', description: 'Dark mode aesthetic' },
  { id: 'colorful', name: 'Colorful', description: 'Vibrant and energetic design' }
]

export default function EditPortfolioPage() {
  const router = useRouter()
  const params = useParams()
  const portfolioId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [slugChecking, setSlugChecking] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [originalSlug, setOriginalSlug] = useState('')
  const [form, setForm] = useState<PortfolioData>({
    _id: '',
    title: '',
    slug: '',
    theme: 'modern',
    isPublic: false,
    fullName: '',
    tagline: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    twitter: '',
    dribbble: '',
    behance: '',
    about: '',
    experience: '',
    projects: '',
    skills: '',
    education: '',
    achievements: '',
    testimonials: '',
    services: '',
    contact: '',
    metaDescription: '',
    metaKeywords: ''
  })

  useEffect(() => {
    loadPortfolio()
  }, [portfolioId])

  // Check slug availability when slug changes
  useEffect(() => {
    if (form.slug && form.slug !== originalSlug && form.slug.length >= 3) {
      const timeoutId = setTimeout(async () => {
        setSlugChecking(true)
        try {
          const res = await fetch(`/api/portfolios/check-slug?slug=${encodeURIComponent(form.slug)}&excludeId=${portfolioId}`)
          const data = await res.json()
          setSlugAvailable(data.available)
        } catch (e) {
          console.error('Slug check failed:', e)
        } finally {
          setSlugChecking(false)
        }
      }, 500)
      
      return () => clearTimeout(timeoutId)
    } else {
      setSlugAvailable(null)
    }
  }, [form.slug, originalSlug, portfolioId])

  const loadPortfolio = async () => {
    try {
      const res = await fetch(`/api/portfolios/${portfolioId}`)
      const data = await res.json()
      
      if (data.success && data.portfolio) {
        setForm(data.portfolio)
        setOriginalSlug(data.portfolio.slug)
      } else {
        throw new Error(data.message || 'Failed to load portfolio')
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
      router.push('/dashboard/portfolios')
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (field: keyof PortfolioData, value: string | boolean) => {
    setForm(f => ({ ...f, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.slug || (form.slug !== originalSlug && slugAvailable === false)) {
      toast({ title: 'Validation Error', description: 'Please fix all errors before saving', variant: 'destructive' })
      return
    }
    
    setSaving(true)
    try {
      const res = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      
      const data = await res.json()
      if (data.success) {
        toast({ title: 'Success', description: 'Portfolio updated successfully!' })
        setOriginalSlug(form.slug) // Update original slug to prevent unnecessary checks
      } else {
        throw new Error(data.message || 'Failed to update portfolio')
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/portfolios')}
            className="mb-4 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolios
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Edit Portfolio
          </h1>
          <p className="text-gray-600 dark:text-slate-400 mt-2">
            Update your portfolio content and settings
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/portfolios/${portfolioId}/preview`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details for your portfolio website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Portfolio Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="My Portfolio"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="slug" className="flex items-center gap-2">
                  URL Slug *
                  {slugChecking && <Loader2 className="w-3 h-3 animate-spin" />}
                  {form.slug === originalSlug && <Check className="w-3 h-3 text-green-500" />}
                  {form.slug !== originalSlug && slugAvailable === true && <Check className="w-3 h-3 text-green-500" />}
                  {form.slug !== originalSlug && slugAvailable === false && <X className="w-3 h-3 text-red-500" />}
                </Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => updateForm('slug', e.target.value)}
                  placeholder="my-portfolio"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your portfolio will be available at: yoursite.com/<strong>{form.slug || 'your-slug'}</strong>
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={form.theme} onValueChange={(value) => updateForm('theme', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.map(theme => (
                    <SelectItem key={theme.id} value={theme.id}>
                      <div>
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-xs text-gray-500">{theme.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isPublic">Make Public</Label>
                <p className="text-xs text-gray-500">Allow others to view your portfolio</p>
              </div>
              <Switch
                id="isPublic"
                checked={form.isPublic}
                onCheckedChange={(checked) => updateForm('isPublic', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => updateForm('fullName', e.target.value)}
                      placeholder="John Doe"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={form.tagline}
                      onChange={(e) => updateForm('tagline', e.target.value)}
                      placeholder="Full Stack Developer"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm('email', e.target.value)}
                      placeholder="john@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => updateForm('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => updateForm('location', e.target.value)}
                      placeholder="San Francisco, CA"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={(e) => updateForm('bio', e.target.value)}
                    placeholder="Brief introduction about yourself..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Social Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={form.linkedin}
                        onChange={(e) => updateForm('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/johndoe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={form.github}
                        onChange={(e) => updateForm('github', e.target.value)}
                        placeholder="https://github.com/johndoe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={form.website}
                        onChange={(e) => updateForm('website', e.target.value)}
                        placeholder="https://johndoe.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={form.twitter}
                        onChange={(e) => updateForm('twitter', e.target.value)}
                        placeholder="https://twitter.com/johndoe"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="professional" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="about">About Section</Label>
                  <Textarea
                    id="about"
                    value={form.about}
                    onChange={(e) => updateForm('about', e.target.value)}
                    placeholder="Tell your professional story..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    value={form.experience}
                    onChange={(e) => updateForm('experience', e.target.value)}
                    placeholder="Your work experience..."
                    rows={6}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="projects">Projects</Label>
                  <Textarea
                    id="projects"
                    value={form.projects}
                    onChange={(e) => updateForm('projects', e.target.value)}
                    placeholder="Your notable projects..."
                    rows={6}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                      id="skills"
                      value={form.skills}
                      onChange={(e) => updateForm('skills', e.target.value)}
                      placeholder="Your technical skills..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      value={form.education}
                      onChange={(e) => updateForm('education', e.target.value)}
                      placeholder="Your educational background..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="achievements">Achievements</Label>
                  <Textarea
                    id="achievements"
                    value={form.achievements}
                    onChange={(e) => updateForm('achievements', e.target.value)}
                    placeholder="Your notable achievements..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="testimonials">Testimonials</Label>
                  <Textarea
                    id="testimonials"
                    value={form.testimonials}
                    onChange={(e) => updateForm('testimonials', e.target.value)}
                    placeholder="Client or colleague testimonials..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="services">Services</Label>
                  <Textarea
                    id="services"
                    value={form.services}
                    onChange={(e) => updateForm('services', e.target.value)}
                    placeholder="Services you offer..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact">Contact Info</Label>
                  <Textarea
                    id="contact"
                    value={form.contact}
                    onChange={(e) => updateForm('contact', e.target.value)}
                    placeholder="How people can reach you..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={form.metaDescription}
                    onChange={(e) => updateForm('metaDescription', e.target.value)}
                    placeholder="Brief description for search engines (max 160 characters)..."
                    maxLength={160}
                    rows={3}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {form.metaDescription.length}/160 characters
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="metaKeywords">Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={form.metaKeywords}
                    onChange={(e) => updateForm('metaKeywords', e.target.value)}
                    placeholder="web developer, react, node.js, portfolio"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Comma-separated keywords for SEO
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/portfolios')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving || (form.slug !== originalSlug && slugAvailable === false)}
            className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}