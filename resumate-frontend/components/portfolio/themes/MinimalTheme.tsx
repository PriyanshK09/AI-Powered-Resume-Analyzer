"use client"
import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

export default function MinimalTheme({ portfolio }: Props) {
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-light tracking-wide text-gray-900">
              {portfolio.fullName || portfolio.title}
            </h1>
            <div className="hidden md:flex space-x-12">
              {sections.slice(0, 4).map(section => (
                <a 
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors tracking-wide"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-32 px-6">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-8 tracking-tight">
              {portfolio.fullName || 'Portfolio'}
            </h1>
            {portfolio.tagline && (
              <p className="text-lg md:text-xl text-gray-600 mb-12 font-light tracking-wide">
                {portfolio.tagline}
              </p>
            )}
            {portfolio.bio && (
              <p className="text-base text-gray-700 max-w-xl mx-auto mb-16 leading-relaxed font-light">
                {portfolio.bio}
              </p>
            )}
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-600 mb-12">
              {portfolio.email && (
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${portfolio.email}`} className="hover:text-gray-900">
                    {portfolio.email}
                  </a>
                </div>
              )}
              {portfolio.location && (
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{portfolio.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex justify-center gap-8">
                {socialLinks.map(link => {
                  const Icon = link.icon
                  return (
                    <a 
                      key={link.label}
                      href={link.url}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-3xl px-6 pb-32">
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="mb-24">
            <div className="border-l-2 border-gray-100 pl-8">
              <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
                {section.title}
              </h2>
              <div className="prose prose-gray max-w-none">
                <div 
                  className="whitespace-pre-wrap text-gray-700 leading-relaxed font-light"
                  dangerouslySetInnerHTML={{ 
                    __html: (section.content || '').replace(/\n/g, '<br />') 
                  }}
                />
              </div>
            </div>
          </section>
        ))}

        {/* Contact Section */}
        {portfolio.contact && (
          <section id="contact" className="mt-24 pt-24 border-t border-gray-100">
            <div className="text-center">
              <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-wide">
                Get In Touch
              </h2>
              <div 
                className="prose prose-gray max-w-none text-gray-700 mb-8 font-light"
                dangerouslySetInnerHTML={{ 
                  __html: (portfolio.contact || '').replace(/\n/g, '<br />') 
                }}
              />
              {portfolio.email && (
                <Button 
                  asChild 
                  variant="outline" 
                  className="border-gray-300 text-gray-900 hover:bg-gray-50"
                >
                  <a href={`mailto:${portfolio.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </a>
                </Button>
              )}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <p className="text-sm text-gray-500 font-light">
            © {new Date().getFullYear()} {portfolio.fullName || 'Portfolio'}
          </p>
        </div>
      </footer>
    </div>
  )
}