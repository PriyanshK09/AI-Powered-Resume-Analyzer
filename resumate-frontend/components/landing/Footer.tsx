"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Mail, Twitter, Linkedin, Github } from "lucide-react"

export default function Footer() {
  const footerSections = [
    {
      title: "Product",
      links: ["Features", "Templates", "Pricing", "API"],
    },
    {
      title: "Company",
      links: ["About", "Blog", "Careers", "Contact"],
    },
    {
      title: "Resources",
      links: ["Help Center", "Privacy", "Terms", "Status"],
    },
  ]

  return (
    <footer className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-violet-950 to-purple-950"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto max-w-7xl relative z-10 text-white">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/25">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold font-display">ResuMate</span>
            </div>
            <p className="text-gray-300 leading-relaxed font-light">
              AI-powered resume optimization for the modern job seeker. Transform your career with intelligent
              insights.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Linkedin, Github].map((Icon, index) => (
                <div
                  key={index}
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                >
                  <Icon className="w-6 h-6 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div key={index} className="space-y-6">
              <h4 className="text-xl font-bold font-display">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-12">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            <div className="text-gray-400 font-light">
              © 2025 ResuMate. All rights reserved. | Privacy Policy | Terms of Service
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-300 font-medium">Stay updated:</span>
              <div className="flex space-x-3">
                <Input
                  placeholder="Enter your email"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400 rounded-xl px-4 py-3 w-64 focus:bg-white/20 transition-all duration-300"
                />
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 px-6 py-3 rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 btn-glow">
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}