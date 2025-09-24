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

export default function DarkTheme({ portfolio }: Props) {
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-green-400">
              {portfolio.fullName || portfolio.title}
            </h1>
            <div className="hidden md:flex space-x-8">
              {sections.slice(0, 4).map(section => (
                <a 
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-gray-400 hover:text-green-400 transition-colors"
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
        <div className="container mx-auto max-w-4xl">
          <div className="text-center">
            <div className="mb-8">
              <span className="text-green-400 text-sm font-mono">~/portfolio $</span>
              <span className="text-white ml-2 font-mono">whoami</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-mono">
              {portfolio.fullName || 'Portfolio'}
            </h1>
            
            {portfolio.tagline && (
              <p className="text-xl md:text-2xl text-green-400 mb-8 font-mono">
                &gt; {portfolio.tagline}
              </p>
            )}
            
            {portfolio.bio && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-2xl mx-auto mb-12 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm ml-2">terminal</span>
                </div>
                <p className="text-gray-300 leading-relaxed font-mono text-sm">
                  <span className="text-green-400">$</span> cat bio.txt<br />
                  {portfolio.bio}
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {portfolio.email && (
                <Button asChild className="bg-green-600 hover:bg-green-700 text-black font-mono">
                  <a href={`mailto:${portfolio.email}`}>
                    <Mail className="w-4 h-4 mr-2" />
                    ./contact.sh
                  </a>
                </Button>
              )}
              {socialLinks.map(link => {
                const Icon = link.icon
                return (
                  <Button key={link.label} variant="outline" asChild className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-mono">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <Icon className="w-4 h-4 mr-2" />
                      {link.label.toLowerCase()}
                    </a>
                  </Button>
                )
              })}
            </div>

            {/* System Info */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 max-w-lg mx-auto text-left font-mono text-sm">
              <div className="text-green-400 mb-2">System Information:</div>
              {portfolio.email && (
                <div className="text-gray-300">
                  <span className="text-blue-400">email:</span> {portfolio.email}
                </div>
              )}
              {portfolio.location && (
                <div className="text-gray-300">
                  <span className="text-blue-400">location:</span> {portfolio.location}
                </div>
              )}
              {portfolio.phone && (
                <div className="text-gray-300">
                  <span className="text-blue-400">phone:</span> {portfolio.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-6 pb-20">
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="mb-20">
            <Card className="bg-gray-800 border-gray-700 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-green-400 font-mono">$</span>
                  <h2 className="text-2xl font-bold text-white font-mono">
                    ls {section.title.toLowerCase()}/
                  </h2>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                  <div 
                    className="whitespace-pre-wrap text-gray-300 leading-relaxed font-mono text-sm"
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
            <Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-green-500 text-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-green-400 font-mono">$</span>
                  <h2 className="text-2xl font-bold text-white font-mono">
                    ./contact.sh --init
                  </h2>
                </div>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
                  <div 
                    className="whitespace-pre-wrap text-gray-300 leading-relaxed font-mono text-sm"
                    dangerouslySetInnerHTML={{ 
                      __html: (portfolio.contact || '').replace(/\n/g, '<br />') 
                    }}
                  />
                </div>
                {portfolio.email && (
                  <div className="text-center">
                    <Button asChild className="bg-green-600 hover:bg-green-700 text-black font-mono">
                      <a href={`mailto:${portfolio.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        execute contact
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-12">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm">
            <div className="text-green-400 mb-2">
              $ echo "© {new Date().getFullYear()} {portfolio.fullName || 'Portfolio'}"
            </div>
            <div className="text-gray-400">
              © {new Date().getFullYear()} {portfolio.fullName || 'Portfolio'}. All rights reserved.
            </div>
            
            {socialLinks.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-green-400 mb-2">$ ls social_links/</div>
                <div className="flex gap-6">
                  {socialLinks.map(link => {
                    const Icon = link.icon
                    return (
                      <a 
                        key={link.label}
                        href={link.url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-green-400 transition-colors flex items-center gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.label.toLowerCase()}</span>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}