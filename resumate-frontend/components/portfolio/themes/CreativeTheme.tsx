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

export default function CreativeTheme({ portfolio }: Props) {
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

  const colors = [
    'from-pink-500 to-orange-500',
    'from-purple-500 to-pink-500', 
    'from-blue-500 to-purple-500',
    'from-green-500 to-blue-500',
    'from-yellow-500 to-red-500',
    'from-indigo-500 to-purple-500'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gradient-to-r from-green-500/20 to-yellow-500/20 rounded-full blur-3xl animate-bounce"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {portfolio.fullName || portfolio.title}
            </h1>
            <div className="hidden md:flex space-x-8">
              {sections.slice(0, 4).map(section => (
                <a 
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-white/80 hover:text-white transition-colors relative group"
                >
                  {section.title}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6 animate-pulse">
            {portfolio.fullName || 'Portfolio'}
          </h1>
          {portfolio.tagline && (
            <p className="text-xl md:text-2xl text-white/90 mb-8 font-light">
              {portfolio.tagline}
            </p>
          )}
          {portfolio.bio && (
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed">
              {portfolio.bio}
            </p>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {portfolio.email && (
              <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                <a href={`mailto:${portfolio.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Get In Touch
                </a>
              </Button>
            )}
            {socialLinks.map(link => {
              const Icon = link.icon
              return (
                <Button key={link.label} variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </a>
                </Button>
              )
            })}
          </div>

          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-8 text-white/70">
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
      <div className="container mx-auto max-w-4xl px-6 pb-20 relative">
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="mb-20">
            <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:scale-[1.02]">
              <CardContent className="p-8">
                <h2 className={`text-3xl font-bold mb-6 pb-4 border-b border-gradient-to-r ${colors[index % colors.length]} bg-gradient-to-r ${colors[index % colors.length]} bg-clip-text text-transparent`}>
                  {section.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  <div 
                    className="whitespace-pre-wrap text-white/90 leading-relaxed"
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
            <Card className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg border border-pink-500/30 text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Get In Touch
                </h2>
                <div 
                  className="prose prose-invert max-w-none text-white/90 mb-8"
                  dangerouslySetInnerHTML={{ 
                    __html: (portfolio.contact || '').replace(/\n/g, '<br />') 
                  }}
                />
                {portfolio.email && (
                  <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
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
      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-white/60">
            © {new Date().getFullYear()} {portfolio.fullName || 'Portfolio'}. All rights reserved.
          </p>
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-6 mt-6">
              {socialLinks.map(link => {
                const Icon = link.icon
                return (
                  <a 
                    key={link.label}
                    href={link.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors transform hover:scale-110"
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