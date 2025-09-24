"use client"
import { Mail, Phone, MapPin, ExternalLink, Github, Linkedin, Twitter, Heart, Star } from 'lucide-react'
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

export default function ColorfulTheme({ portfolio }: Props) {
  const socialLinks = [
    { url: portfolio.linkedin, icon: Linkedin, label: 'LinkedIn' },
    { url: portfolio.github, icon: Github, label: 'GitHub' }, 
    { url: portfolio.twitter, icon: Twitter, label: 'Twitter' },
    { url: portfolio.website, icon: ExternalLink, label: 'Website' }
  ].filter(link => link.url)

  const sections = [
    { id: 'about', title: 'About Me', content: portfolio.about, color: 'from-pink-500 to-rose-500' },
    { id: 'experience', title: 'Experience', content: portfolio.experience, color: 'from-purple-500 to-indigo-500' },
    { id: 'projects', title: 'Projects', content: portfolio.projects, color: 'from-blue-500 to-cyan-500' },
    { id: 'skills', title: 'Skills', content: portfolio.skills, color: 'from-green-500 to-emerald-500' },
    { id: 'education', title: 'Education', content: portfolio.education, color: 'from-yellow-500 to-orange-500' },
    { id: 'achievements', title: 'Achievements', content: portfolio.achievements, color: 'from-red-500 to-pink-500' },
    { id: 'services', title: 'Services', content: portfolio.services, color: 'from-indigo-500 to-purple-500' },
    { id: 'testimonials', title: 'Testimonials', content: portfolio.testimonials, color: 'from-teal-500 to-cyan-500' }
  ].filter(section => section.content)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              {portfolio.fullName || portfolio.title}
            </h1>
            <div className="hidden md:flex space-x-8">
              {sections.slice(0, 4).map((section, index) => (
                <a 
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300 font-medium"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 to-green-500 bg-clip-text text-transparent mb-6 animate-pulse">
              {portfolio.fullName || 'Portfolio'}
            </h1>
            <div className="absolute -top-4 -right-4">
              <Star className="w-8 h-8 text-yellow-400 animate-spin" />
            </div>
            <div className="absolute -bottom-4 -left-4">
              <Heart className="w-6 h-6 text-pink-400 animate-bounce" />
            </div>
          </div>
          
          {portfolio.tagline && (
            <div className="relative">
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-8">
                {portfolio.tagline}
              </p>
            </div>
          )}
          
          {portfolio.bio && (
            <Card className="max-w-2xl mx-auto mb-12 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-gradient-to-r border-pink-200">
              <CardContent className="p-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {portfolio.bio}
                </p>
              </CardContent>
            </Card>
          )}
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {portfolio.email && (
              <Button asChild className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <a href={`mailto:${portfolio.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  ✨ Get In Touch
                </a>
              </Button>
            )}
            {socialLinks.map((link, index) => {
              const Icon = link.icon
              const gradients = [
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500', 
                'from-green-500 to-emerald-500',
                'from-yellow-500 to-orange-500'
              ]
              return (
                <Button key={link.label} asChild className={`bg-gradient-to-r ${gradients[index % gradients.length]} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </a>
                </Button>
              )
            })}
          </div>

          {/* Contact Info Cards */}
          <div className="flex flex-wrap justify-center gap-4">
            {portfolio.email && (
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Mail className="w-4 h-4" />
                    <span className="font-medium">{portfolio.email}</span>
                  </div>
                </CardContent>
              </Card>
            )}
            {portfolio.phone && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">{portfolio.phone}</span>
                  </div>
                </CardContent>
              </Card>
            )}
            {portfolio.location && (
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-purple-700">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">{portfolio.location}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-6 pb-20 relative">
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="mb-20">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${section.color}`}></div>
              <CardContent className="p-8">
                <h2 className={`text-3xl font-bold mb-6 pb-4 border-b-2 border-gradient-to-r ${section.color} bg-gradient-to-r ${section.color} bg-clip-text text-transparent`}>
                  {section.title}
                </h2>
                <div className="prose prose-gray max-w-none">
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

        {/* Contact Section */}
        {portfolio.contact && (
          <section id="contact" className="mb-20">
            <Card className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative">
                  <h2 className="text-4xl font-bold mb-6 text-white">
                    🌟 Let's Connect! 🌟
                  </h2>
                  <div 
                    className="prose prose-white max-w-none text-white/90 mb-8"
                    dangerouslySetInnerHTML={{ 
                      __html: (portfolio.contact || '').replace(/\n/g, '<br />') 
                    }}
                  />
                  {portfolio.email && (
                    <Button asChild className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <a href={`mailto:${portfolio.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        🚀 Send Message
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="text-white/80 mb-6">
            © {new Date().getFullYear()} {portfolio.fullName || 'Portfolio'}. Made with ❤️ and lots of colors!
          </p>
          {socialLinks.length > 0 && (
            <div className="flex justify-center gap-6">
              {socialLinks.map((link, index) => {
                const Icon = link.icon
                const hoverColors = [
                  'hover:text-blue-300',
                  'hover:text-pink-300',
                  'hover:text-green-300', 
                  'hover:text-yellow-300'
                ]
                return (
                  <a 
                    key={link.label}
                    href={link.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-white/70 ${hoverColors[index % hoverColors.length]} transition-colors transform hover:scale-110 duration-300`}
                  >
                    <Icon className="w-6 h-6" />
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