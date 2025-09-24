"use client"
import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface PortfolioData {
  title: string
  fullName?: string
  tagline?: string
  bio?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
  twitter?: string
  about?: string
  experience?: string
  projects?: string
  skills?: string
  education?: string
  achievements?: string
  testimonials?: string
  services?: string
  contact?: string
}

interface Props {
  portfolio: PortfolioData
}

export default function ModernTheme({ portfolio }: Props) {
  const socialLinks = [
    { url: portfolio.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { url: portfolio.github, icon: Github, label: 'GitHub' }, 
    { url: portfolio.twitter, icon: Twitter, label: 'Twitter' },
    { url: portfolio.website, icon: ExternalLink, label: 'Website' }
  ].filter(link => link.url)

  const sections = [
    { id: 'about', title: 'About', content: portfolio.about },
    { id: 'experience', title: 'Experience', content: portfolio.experience },
    { id: 'projects', title: 'Projects', content: portfolio.projects },
    { id: 'skills', title: 'Skills', content: portfolio.skills },
    { id: 'education', title: 'Education', content: portfolio.education },
    { id: 'achievements', title: 'Achievements', content: portfolio.achievements },
    { id: 'services', title: 'Services', content: portfolio.services },
    { id: 'testimonials', title: 'Testimonials', content: portfolio.testimonials }
  ].filter(section => section.content)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {portfolio.fullName || portfolio.title}
            </h1>
            <div className="hidden md:flex space-x-8">
              {sections.slice(0, 4).map(section => (
                <a 
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
            {portfolio.fullName || 'Portfolio'}
          </h1>
          {portfolio.tagline && (
            <p className="text-xl md:text-2xl text-slate-600 mb-8">
              {portfolio.tagline}
            </p>
          )}
          {portfolio.bio && (
            <p className="text-lg text-slate-700 max-w-2xl mx-auto mb-12">
              {portfolio.bio}
            </p>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {portfolio.email && (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <a href={`mailto:${portfolio.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Get In Touch
                </a>
              </Button>
            )}
            {socialLinks.map(link => {
              const Icon = link.icon
              return (
                <Button key={link.label} variant="outline" asChild>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </a>
                </Button>
              )
            })}
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6 text-slate-600">
            {portfolio.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{portfolio.email}</span>
              </div>
            )}
            {portfolio.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{portfolio.phone}</span>
              </div>
            )}
            {portfolio.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{portfolio.location}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-6 pb-20">
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="mb-20">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">
                  {section.title}
                </h2>
                <div className="prose prose-slate max-w-none">
                  <div 
                    className="whitespace-pre-wrap text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: (section.content || '').replace(/\n/g, '<br />') 
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </section>
        ))}

        {/* Contact Section */}
        {portfolio.contact && (
          <section id="contact" className="mb-20">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                <div 
                  className="prose prose-white max-w-none text-white/90"
                  dangerouslySetInnerHTML={{ 
                    __html: (portfolio.contact || '').replace(/\n/g, '<br />') 
                  }}
                />
                {portfolio.email && (
                  <Button asChild className="mt-6 bg-white text-blue-600 hover:bg-slate-100">
                    <a href={`mailto:${portfolio.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-slate-400">
            © {new Date().getFullYear()} {portfolio.fullName || 'Portfolio'}. All rights reserved.
          </p>
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-4 mt-6">
              {socialLinks.map(link => {
                const Icon = link.icon
                return (
                  <a 
                    key={link.label}
                    href={link.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </footer>
    </div>
  )
}