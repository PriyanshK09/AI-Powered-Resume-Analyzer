"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { Sparkles, Upload, FileUser, Link2, Check, X, Loader2, Eye, Globe } from 'lucide-react'
import AIPortfolioGenerator from '@/components/portfolio/AIPortfolioGenerator'

interface PortfolioFormData {
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

export default function CreatePortfolioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [importLoading, setImportLoading] = useState(false)
  const [slugChecking, setSlugChecking] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [resumes, setResumes] = useState<any[]>([])
  const [form, setForm] = useState<PortfolioFormData>({
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

  // Load user's resumes for import
  useEffect(() => {
    async function loadResumes() {
      try {
        const res = await fetch('/api/resumes')
        const data = await res.json()
        if (data.success) {
          setResumes(data.resumes || [])
        }
      } catch (e) {
        console.error('Failed to load resumes:', e)
      }
    }
    loadResumes()
  }, [])

  // Generate slug from title
  useEffect(() => {
    if (form.title && !form.slug) {
      const slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 60)
      setForm(f => ({ ...f, slug }))
    }
  }, [form.title])

  // Check slug availability
  useEffect(() => {
    if (form.slug && form.slug.length >= 3) {
      const timeoutId = setTimeout(async () => {
        setSlugChecking(true)
        try {
          const res = await fetch(`/api/portfolios/check-slug?slug=${encodeURIComponent(form.slug)}`)
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
  }, [form.slug])

  const updateForm = (field: keyof PortfolioFormData, value: string | boolean) => {
    setForm(f => ({ ...f, [field]: value }))
  }

  const importFromResume = async (resumeId: string) => {
    setImportLoading(true)
    try {
      const res = await fetch(`/api/resumes/${resumeId}`)
      const data = await res.json()
      if (data.success && data.resume) {
        const resume = data.resume
        setForm(f => ({
          ...f,
          fullName: resume.fullName || f.fullName,
          email: resume.email || f.email,
          phone: resume.phone || f.phone,
          location: resume.location || f.location,
          linkedin: resume.linkedin || f.linkedin,
          github: resume.github || f.github,
          website: resume.website || f.website,
          about: resume.summary || f.about,
          experience: resume.experience || f.experience,
          projects: resume.projects || f.projects,
          skills: resume.skills || f.skills,
          education: resume.education || f.education,
          achievements: resume.achievements || f.achievements,
        }))
        toast({ title: 'Success', description: 'Resume data imported successfully!' })
      } else {
        throw new Error(data.message || 'Failed to load resume')
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to import resume data', variant: 'destructive' })
    } finally {
      setImportLoading(false)
    }
  }

  const handleAIGenerate = (data: any) => {
    // Normalize any structured AI output (arrays/objects) into string fields expected by the form
    const normalize = (key: string, value: any): string => {
      if (value == null) return ''
      if (typeof value === 'string') return value
      // Per-section formatting
      const joinBullets = (items: any[]): string => items.map(v => `- ${String(v).trim()}`).join('\n')

      if (Array.isArray(value)) {
        // Heuristics by key
        if (['experience', 'projects', 'achievements'].includes(key)) {
          // Map objects to bullet-ish lines when possible
          const lines: string[] = []
          for (const item of value) {
            if (!item) continue
            if (typeof item === 'string') { lines.push(item.trim()); continue }
            if (typeof item === 'object') {
              const title = item.title || item.role || item.position || ''
              const org = item.company || item.organization || item.org || ''
              const period = item.period || item.dates || item.year || ''
              const header = [title, org].filter(Boolean).join(' @ ')
              const headWithPeriod = [header, period].filter(Boolean).join(' (') + (period ? ')' : '')
              if (header || period) lines.push(`- ${headWithPeriod}`.trim())
              // bullets/details
              if (Array.isArray(item.bullets)) {
                for (const b of item.bullets) lines.push(`  • ${String(b).trim()}`)
              } else if (item.description || item.summary) {
                lines.push(`  • ${String(item.description || item.summary).trim()}`)
              }
              continue
            }
            lines.push(String(item))
          }
          return lines.join('\n')
        }
        if (key === 'education') {
          const lines: string[] = []
          for (const item of value) {
            if (!item) continue
            if (typeof item === 'string') { lines.push(item.trim()); continue }
            if (typeof item === 'object') {
              const degree = item.degree || item.qualification || ''
              const school = item.school || item.institution || ''
              const year = item.year || item.graduationYear || item.dates || ''
              const composed = [degree, school, year].filter(Boolean).join(' | ')
              if (composed) lines.push(composed)
              else lines.push(JSON.stringify(item))
              continue
            }
            lines.push(String(item))
          }
          return lines.join('\n')
        }
        if (key === 'skills' || key === 'metaKeywords') {
          // Deduplicate and join with comma
          const flat = value.map(v => (typeof v === 'string' ? v : JSON.stringify(v))).map(s => s.trim()).filter(Boolean)
          return Array.from(new Set(flat)).join(', ')
        }
        if (key === 'testimonials') {
          const blocks: string[] = []
          for (const t of value) {
            if (!t) continue
            if (typeof t === 'string') { blocks.push(t.trim()); continue }
            if (typeof t === 'object') {
              const quote = t.quote || t.text || t.content || ''
              const author = [t.author, t.name].find(Boolean) || ''
              const title = t.title || t.role || ''
              const byline = [author, title].filter(Boolean).join(', ')
              if (quote || byline) blocks.push(`“${String(quote).trim()}” — ${byline}`.trim())
              else blocks.push(JSON.stringify(t))
            }
          }
          return blocks.join('\n\n')
        }
        if (key === 'services') {
          return value.map(v => (typeof v === 'string' ? v.trim() : JSON.stringify(v))).filter(Boolean).join('\n')
        }
        // default for other arrays: newline bullets
        return joinBullets(value)
      }
      if (typeof value === 'object') {
        // Provide friendly formatting for common objects
        if (key === 'skills') {
          const parts: string[] = []
          for (const [k, v] of Object.entries(value)) {
            if (Array.isArray(v)) parts.push(`${k}: ${v.map(x => String(x).trim()).join(', ')}`)
            else parts.push(`${k}: ${String(v).trim()}`)
          }
          return parts.join('\n')
        }
        if (key === 'contact') {
          const { email, phone, location, website } = value as any
          const parts = [email && `Email: ${email}`, phone && `Phone: ${phone}`, location && `Location: ${location}`, website && `Website: ${website}`].filter(Boolean)
          if (parts.length) return parts.join(' | ')
        }
        // Fallback to JSON string to avoid [object Object]
        try { return JSON.stringify(value, null, 2) } catch { return String(value) }
      }
      return String(value)
    }

    const normalized: Partial<PortfolioFormData> = {}
    for (const [k, v] of Object.entries(data)) {
      // Only normalize keys we know about in the form; ignore extras
      if ((k as keyof PortfolioFormData) in form) {
        // @ts-expect-error index type
        normalized[k] = normalize(k, v)
      }
    }
    setForm(f => ({ ...f, ...normalized }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.slug || slugAvailable === false) {
      toast({ title: 'Validation Error', description: 'Please fix all errors before saving', variant: 'destructive' })
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      
      const data = await res.json()
      if (data.success) {
        toast({ title: 'Success', description: 'Portfolio created successfully!' })
        router.push(`/dashboard/portfolios/${data.portfolio._id}`)
      } else {
        throw new Error(data.message || 'Failed to create portfolio')
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Create Portfolio
        </h1>
        <p className="text-gray-600 dark:text-slate-400 mt-2">
          Build your professional portfolio website with AI assistance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Basic Information
            </CardTitle>
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
                  {slugAvailable === true && <Check className="w-3 h-3 text-green-500" />}
                  {slugAvailable === false && <X className="w-3 h-3 text-red-500" />}
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

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Setup</CardTitle>
            <CardDescription>
              Get started faster with these options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AIPortfolioGenerator 
                onGenerate={handleAIGenerate} 
                theme={form.theme}
                isLoading={aiLoading}
              />
              
              {resumes.length > 0 && (
                <Select onValueChange={importFromResume} disabled={importLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={importLoading ? "Importing..." : "Import from Resume"} />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map(resume => (
                      <SelectItem key={resume._id} value={resume._id}>
                        <div className="flex items-center gap-2">
                          {importLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUser className="w-4 h-4" />}
                          {resume.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              <Button type="button" variant="outline" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Resume
              </Button>
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
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || slugAvailable === false}
            className="bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Create Portfolio
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}