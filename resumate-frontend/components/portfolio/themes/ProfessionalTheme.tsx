"use client"
import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Twitter, Briefcase } from 'lucide-react'
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

export default function ProfessionalTheme({ portfolio }: Props) {
  const socialLinks = [
    { url: portfolio.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { url: portfolio.github, icon: Github, label: 'GitHub' }, 
    { url: portfolio.website, icon: ExternalLink, label: 'Website' }
  ].filter(link => link.url)

  const sections = [
    { id: 'about', title: 'Professional Summary', content: portfolio.about },
    { id: 'experience', title: 'Professional Experience', content: portfolio.experience },
    { id: 'skills', title: 'Core Competencies', content: portfolio.skills },
    { id: 'projects', title: 'Key Projects', content: portfolio.projects },
    { id: 'education', title: 'Education & Certifications', content: portfolio.education },
    { id: 'achievements', title: 'Achievements & Recognition', content: portfolio.achievements },
    { id: 'services', title: 'Professional Services', content: portfolio.services }
  ].filter(section => section.content)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-4 border-blue-600">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {portfolio.fullName || 'Professional Portfolio'}
              </h1>
              {portfolio.tagline && (
                <p className="text-xl text-blue-600 font-medium">
                  {portfolio.tagline}
                </p>
              )}
            </div>
            
            <div className="text-right">
              {portfolio.email && (
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${portfolio.email}`} className="hover:text-blue-600">
                    {portfolio.email}
                  </a>
                </div>
              )}
              {portfolio.phone && (
                <div className="flex items-center gap-2 text-gray-700 mb-1">
                  <Phone className="w-4 h-4" />
                  <span>{portfolio.phone}</span>
                </div>
              )}
              {portfolio.location && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4" />
                  <span>{portfolio.location}</span>
                </div>
              )}
            </div>
          </div>
          
          {portfolio.bio && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-600">
              <p className="text-gray-700 leading-relaxed">
                {portfolio.bio}
              </p>
            </div>
          )}
          
          {socialLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map(link => {
                const Icon = link.icon
                return (
                  <Button key={link.label} variant="outline" asChild className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <Icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </a>
                  </Button>
                )
              })}
              {portfolio.email && (
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a href={`mailto:${portfolio.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Me
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id}>
              <Card className="bg-white shadow-sm border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <div className="border-l-4 border-blue-100 pl-6">
                    <div 
                      className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: (section.content || '').replace(/\n/g, '<br />') 
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>
          ))}

          {/* Testimonials */}
          {portfolio.testimonials && (
            <section id="testimonials">
              <Card className="bg-blue-50 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Client Testimonials
                    </h2>
                  </div>
                  <div 
                    className="whitespace-pre-wrap text-gray-700 leading-relaxed italic"
                    dangerouslySetInnerHTML={{ 
                      __html: portfolio.testimonials.replace(/\n/g, '<br />') 
                    }}
                  />
                </CardContent>
              </Card>
            </section>
          )}

          {/* Contact Section */}
          {portfolio.contact && (
            <section id="contact">
              <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
                <CardContent className="p-8 text-center">
                  <h2 className="text-3xl font-bold mb-6">
                    Professional Contact
                  </h2>
                  <div 
                    className="whitespace-pre-wrap text-blue-100 leading-relaxed mb-8"
                    dangerouslySetInnerHTML={{ 
                      __html: (portfolio.contact || '').replace(/\n/g, '<br />') 
                    }}
                  />
                  {portfolio.email && (
                    <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
                      <a href={`mailto:${portfolio.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Initiate Contact
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {portfolio.fullName || 'Professional Portfolio'}. All rights reserved.
          </p>
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-6 mt-4">
              {socialLinks.map(link => {
                const Icon = link.icon
                return (
                  <a 
                    key={link.label}
                    href={link.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
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